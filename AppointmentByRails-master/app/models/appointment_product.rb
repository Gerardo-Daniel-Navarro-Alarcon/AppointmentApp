class AppointmentProduct < ApplicationRecord
  belongs_to :appointment
  belongs_to :product
end
# app/models/appointment_product.rb
class AppointmentProduct < ApplicationRecord
  belongs_to :appointment
  belongs_to :product

  validate :sufficient_stock, on: :create

  private

  def sufficient_stock
    if product.stock < quantity
      errors.add(:quantity, "no hay suficiente inventario para el producto #{product.name}")
    end
  end
end
