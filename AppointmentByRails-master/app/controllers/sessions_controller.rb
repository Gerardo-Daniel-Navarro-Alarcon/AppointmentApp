# app/controllers/sessions_controller.rb
class SessionsController < ApplicationController
  skip_before_action :authenticate_employee!, only: [:new, :create]
  skip_forgery_protection only: [:create] # Excluye la acción `create` de la protección CSRF

  def new
    # Renderiza el formulario de inicio de sesión para acceso en el navegador
  end

  def create
    employee = Employee.find_by(email: params[:email])

    if employee&.authenticate(params[:password])
      # Genera el token si no existe
      employee.update(authentication_token: SecureRandom.hex) unless employee.authentication_token

      # Verifica si la solicitud es para una API externa (JSON)
      if request.format.json?
        # Responde con el token en formato JSON para el cliente externo (app móvil)
        render json: { token: employee.authentication_token }, status: :created
      else
        # Guarda el token en la sesión y redirige si es una solicitud de navegador
        session[:authentication_token] = employee.authentication_token
        redirect_to inicio_path, notice: 'Inicio de sesión exitoso'
      end
    else
      # Manejo de error para credenciales inválidas
      if request.format.json?
        render json: { error: 'Credenciales inválidas' }, status: :unprocessable_entity
      else
        flash.now[:alert] = 'Credenciales inválidas'
        render :new, status: :unprocessable_entity
      end
    end
  end

  def destroy
    # Elimina el token y cierra la sesión
    if current_employee
      current_employee.update(authentication_token: nil)
      session[:authentication_token] = nil
      redirect_to login_path, notice: 'Sesión cerrada'
    else
      redirect_to login_path, alert: 'No hay ninguna sesión activa'
    end
  end
end
