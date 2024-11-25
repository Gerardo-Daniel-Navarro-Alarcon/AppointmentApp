# app/controllers/appointments_controller.rb
class AppointmentsController < ApplicationController
  before_action :authenticate_employee! # Asumiendo que tienes una autenticación
  before_action :set_appointment, only: %i[show edit update destroy]
  before_action :load_form_data, only: %i[new edit]

  # GET /appointments or /appointments.json
  def index
    @appointments = Appointment.all
    respond_to do |format|
      format.html # Renderiza la vista index.html.erb
      format.json { render json: @appointments }
    end
  end

  # GET /appointments/1 or /appointments/1.json
  def show
    respond_to do |format|
      format.html # Renderiza la vista show.html.erb
      format.json { render json: @appointment }
    end
  end

  # GET /appointments/new
  def new
    @appointment = Appointment.new
  end

  # GET /appointments/:id/edit
  def edit
    # @appointment ya está establecido por set_appointment
  end

  # POST /appointments
  def create
    @appointment = Appointment.new(appointment_params)

    ActiveRecord::Base.transaction do
      if @appointment.save
        # Asociar productos si se seleccionaron
        associate_products
        redirect_to @appointment, notice: 'La cita fue creada exitosamente.'
      else
        load_form_data
        render :new
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    load_form_data
    @appointment.errors.add(:base, e.message)
    render :new
  end

  # PATCH/PUT /appointments/:id
  def update
    ActiveRecord::Base.transaction do
      if @appointment.update(appointment_params)
        # Actualizar productos si se seleccionaron
        @appointment.appointment_products.destroy_all
        associate_products
        redirect_to @appointment, notice: 'La cita fue actualizada exitosamente.'
      else
        load_form_data
        render :edit
      end
    end
  rescue ActiveRecord::RecordInvalid => e
    load_form_data
    @appointment.errors.add(:base, e.message)
    render :edit
  end

  # DELETE /appointments/1 or /appointments/1.json
  def destroy
    @appointment.destroy!
    respond_to do |format|
      format.html { redirect_to appointments_url, notice: 'La cita fue eliminada exitosamente.', status: :see_other }
      format.json { head :no_content }
    end
  end

  private

  # Método para establecer la cita
  def set_appointment
    @appointment = Appointment.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    redirect_to appointments_path, alert: 'Cita no encontrada'
  end

  # Método para cargar datos necesarios para el formulario
  def load_form_data
    @employees = Employee.all
    @services = Service.where(active: true)
    @products = Product.where(active: true)
  end

  # Parámetros permitidos
  def appointment_params
    params.require(:appointment).permit(
      :employee_id,
      :service_id,
      :appointment_date,
      :status,
      :notes,
      product_ids: [] # Permite un array de product_ids
    )
  end

  # Método para asociar productos con una cantidad predeterminada
  def associate_products
    return unless params[:appointment][:product_ids].present?

    params[:appointment][:product_ids].reject(&:blank?).each do |product_id|
      @appointment.appointment_products.create!(
        product_id: product_id,
        quantity: 1 # Cantidad predeterminada
      )
    end
  end
end

# app/controllers/products_controller.rb

def new
  @product = Product.new
  @categories = Category.all
end

def edit
  @categories = Category.all
end
