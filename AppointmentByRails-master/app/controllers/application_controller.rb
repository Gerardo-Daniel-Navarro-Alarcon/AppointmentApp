# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  before_action :authenticate_employee!

  private

  # Método de autenticación que utiliza el token en el encabezado o en la sesión para verificar al usuario
  def authenticate_employee!
    # Intenta obtener el token desde el encabezado `Authorization` o desde la sesión
    token = request.headers['Authorization']&.split(' ')&.last || session[:authentication_token]
    @current_employee = Employee.find_by(authentication_token: token)

    # Maneja el caso de autenticación fallida
    unless @current_employee
      # Responde con un mensaje JSON si la solicitud es para una API (formato JSON)
      if request.format.json?
        render json: { error: 'Acceso denegado: autenticación requerida' }, status: :unauthorized
      else
        # Redirige al formulario de inicio de sesión para solicitudes de navegador
        redirect_to login_path, alert: 'Por favor, inicia sesión'
      end
    end
  end

  # Permitir que otros controladores accedan al empleado autenticado
  attr_reader :current_employee
end
