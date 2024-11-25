# app/models/appointment_product.rb
class AppointmentProduct < ApplicationRecord
  belongs_to :appointment
  belongs_to :product

  validates :quantity, presence: true
  validate :sufficient_stock

  def sufficient_stock
    return if product.nil? || product.stock.nil? || quantity.nil?
    if product.stock < quantity
      errors.add(:quantity, "no hay suficiente inventario para el producto #{product.name}")
    end
  end
end
