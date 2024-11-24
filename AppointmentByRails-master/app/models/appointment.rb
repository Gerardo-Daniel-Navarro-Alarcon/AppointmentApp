# app/models/appointment.rb
class Appointment < ApplicationRecord
  after_initialize :set_default_status, if: :new_record?

  # Enum para los estados de la cita en inglés, con traducción a español solo en vistas
  enum status: { pending: "Pendiente", confirmed: "Confirmada", completed: "Completada" }

  # Método de verificación de conflictos de horario (ahora es público)
  def conflict?
    return false if service.nil? || service.duration.nil?

    end_time = appointment_date + service.duration.minutes

    # Buscar citas conflictivas del mismo empleado en el mismo rango de tiempo
    Appointment.where(employee_id: employee_id)
               .where.not(id: id) # Excluir la cita actual
               .where("appointment_date < ? AND ? < appointment_date + interval '1 minute' * services.duration", end_time, appointment_date)
               .joins(:service)
               .exists?
  end

  private

  # Asigna el estado predeterminado como 'pending' si no se ha especificado otro
  def set_default_status
    self.status ||= "pending"
  end

  # Validaciones de campos obligatorios y lógica de estado
  validates :status, presence: true, inclusion: { in: statuses.keys }
  validates :employee_id, :service_id, :appointment_date, presence: true
  validate :appointment_date_cannot_be_in_the_past
  validate :employee_availability
  validate :service_availability

  # Relaciones
  belongs_to :employee
  belongs_to :service
  has_many :appointment_products, dependent: :destroy
  has_many :products, through: :appointment_products

  # Callbacks para manejo de inventario
  after_create :deduct_inventory, if: -> { status == 'confirmed' }
  after_destroy :restore_inventory

  # Validación personalizada para evitar fechas en el pasado
  def appointment_date_cannot_be_in_the_past
    if appointment_date.present? && appointment_date < Time.current
      errors.add(:appointment_date, "no puede estar en el pasado")
    end
  end

  # Verificación de disponibilidad del empleado
  def employee_availability
    if service.nil? || service.duration.nil?
      errors.add(:service_id, "El servicio seleccionado no es válido o no tiene una duración especificada.")
      return
    end

    end_time = appointment_date + service.duration.minutes
    conflicting_appointments = Appointment.where(employee_id: employee_id)
                                          .where.not(id: id)
                                          .where("appointment_date < ? AND ? < appointment_date + interval '1 minute' * services.duration", end_time, appointment_date)
                                          .joins(:service)

    if conflicting_appointments.exists?
      errors.add(:appointment_date, "El empleado no está disponible en el horario seleccionado.")
    end
  end

  # Verificación de disponibilidad del servicio
  def service_availability
    errors.add(:service_id, "El servicio seleccionado no está activo.") unless service&.active?
  end

  # Deducir inventario de productos asociados a la cita
  def deduct_inventory
    appointment_products.each do |appointment_product|
      product = appointment_product.product
      if product.stock >= appointment_product.quantity
        product.update!(stock: product.stock - appointment_product.quantity)
        InventoryLog.create!(
          product: product,
          change: -appointment_product.quantity,
          reason: 'Uso en Cita',
          appointment: self
        )
        check_low_stock_alert(product)
      else
        errors.add(:base, "Producto #{product.name} no tiene suficiente inventario")
        raise ActiveRecord::Rollback
      end
    end
  end

  # Restaurar inventario si la cita es cancelada o eliminada
  def restore_inventory
    appointment_products.each do |appointment_product|
      product = appointment_product.product
      product.update!(stock: product.stock + appointment_product.quantity)

      InventoryLog.create!(
        product: product,
        change: appointment_product.quantity,
        reason: 'Cancelación de Cita',
        appointment: self
      )
    end
  end

  # Verificar si el producto tiene inventario bajo y generar alerta
  def check_low_stock_alert(product)
    low_stock_threshold = product.low_stock_threshold || 5

    if product.stock < low_stock_threshold
      puts "Alerta: El inventario del producto '#{product.name}' está bajo. Stock actual: #{product.stock}"
      
      # Enviar correo de alerta
      LowStockMailer.notify(product).deliver_now

      # Enviar notificación push a la app Expo
      NotificationService.send_low_stock_alert(product)
    end
  end

  # Enviar notificación push usando Expo
  def send_push_notification(product)
    require 'net/http'
    require 'uri'
    require 'json'

    uri = URI.parse('https://exp.host/--/api/v2/push/send')
    token = "TOKEN_DE_LA_APP_EXPO" # Reemplaza con el token de notificación de Expo

    header = { 'Content-Type': 'application/json' }
    message = {
      to: token,
      sound: 'default',
      title: 'Alerta de Inventario Bajo',
      body: "El producto '#{product.name}' está bajo en inventario. Stock actual: #{product.stock}"
    }

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.request_uri, header)
    request.body = message.to_json

    response = http.request(request)
    puts "Notificación enviada: #{response.body}"
  end
end
