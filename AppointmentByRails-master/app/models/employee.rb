# app/models/employee.rb
class Employee < ApplicationRecord
  belongs_to :role

  # Seguridad de contraseñas
  has_secure_password

  has_many :employee_services, dependent: :destroy
  has_many :services, through: :employee_services
  has_many :appointments


  # Validaciones
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :email, presence: true, uniqueness: true
  validates :password, presence: true, length: { minimum: 6 }, if: :password_required?
  validates :phone_number, presence: true
  validates :role_id, presence: true
  validates :active, inclusion: { in: [true, false] }

  # Método para manejar la validación condicional de contraseña
  def password_required?
    new_record? || !password.nil?
  end

  # Callbacks
  before_create :generate_authentication_token

  # Método para obtener nombre completo
  def full_name
    "#{first_name} #{last_name}"
  end
    # Asume que tienes los campos first_name y last_name
  def name
    "#{first_name} #{last_name}"
  end

  # Scope para obtener los tokens de los administradores
  scope :admin_tokens, -> { where(role: "admin").where.not(authentication_token: nil).pluck(:authentication_token) }

  # Método para manejar la validación condicional de contraseña
  def password_required?
    new_record? || !password.nil?
  end

  private

  # Generar un token de autenticación único antes de crear el registro
  def generate_authentication_token
    self.authentication_token = SecureRandom.hex(10) if authentication_token.blank?
  end
end