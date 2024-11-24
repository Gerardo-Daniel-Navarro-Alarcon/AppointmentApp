# app/models/employee.rb
class Employee < ApplicationRecord
  belongs_to :role
  has_secure_password

  has_many :employee_services, dependent: :destroy
  has_many :services, through: :employee_services

  # Validaciones
  validates :first_name, :last_name, :email, :role, presence: true
  validates :email, uniqueness: true
  validates :phone_number, length: { is: 10 }, allow_blank: true
  validates :authentication_token, uniqueness: true, allow_nil: true

  # Callbacks
  before_create :generate_authentication_token

  # Método para obtener nombre completo
  def full_name
    "#{first_name} #{last_name}"
  end

  # Scope para obtener los tokens de los administradores
  scope :admin_tokens, -> { where(role: "admin").where.not(authentication_token: nil).pluck(:authentication_token) }

  private

  # Generar un token de autenticación único antes de crear el registro
  def generate_authentication_token
    self.authentication_token = SecureRandom.hex(10) if authentication_token.blank?
  end
end