# app/models/service.rb
class Service < ApplicationRecord
  belongs_to :category
  has_many :appointments, dependent: :destroy

  # Validaciones
  validates :name, presence: true, uniqueness: true
  validates :description, presence: true
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :duration, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :category_id, presence: true

  # Scopes opcionales para filtrar servicios activos
  scope :active, -> { where(active: true) }
end