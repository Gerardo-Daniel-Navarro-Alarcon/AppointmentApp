# app/models/product.rb
class Product < ApplicationRecord
  belongs_to :category
  has_many :appointment_products, dependent: :destroy
  has_many :appointments, through: :appointment_products

  # Validaciones
  validates :name, presence: true, uniqueness: true
  validates :description, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :category_id, presence: true

  # Scope para productos activos
  scope :active, -> { where(active: true) }
end
