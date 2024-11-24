class AppointmentProduct < ApplicationRecord
  belongs_to :appointment
  belongs_to :product
end
# app/models/appointment_product.rb
class AppointmentProduct < ApplicationRecord
  belongs_to :appointment
  belongs_to :product

  validates :appointment_id, :product_id, :quantity, presence: true
  validates :quantity, numericality: { only_integer: true, greater_than: 0 }

  validate :sufficient_stock, on: :create

  after_create :deduct_stock
  after_destroy :restore_stock

  private

  def sufficient_stock
    if product.stock < quantity
      errors.add(:quantity, "no hay suficiente inventario para el producto #{product.name}")
    end
  end

  def deduct_stock
    product.decrement!(:stock, quantity)
  end

  def restore_stock
    product.increment!(:stock, quantity)
  end
end
