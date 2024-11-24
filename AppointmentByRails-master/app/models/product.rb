# app/models/product.rb
class Product < ApplicationRecord
  # Validaciones
  validates :name, :description, :price, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :name, uniqueness: true

  # Scope para productos activos
  scope :active, -> { where(active: true) }
end
