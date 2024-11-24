# app/controllers/sessions_controller.rb
class SessionsController < ApplicationController
  require 'net/http'
  require 'uri'
  require 'json'

  # Método para mostrar el formulario de inicio de sesión
  def new
  end

  # Método para manejar el inicio de sesión
  def create
    uri = URI.parse('http://localhost:3001/auth/login')
    response = Net::HTTP.post_form(uri, {
      email: params[:email],
      password: params[:password]
    })

    if response.is_a?(Net::HTTPSuccess)
      # Redirige al usuario a la pantalla de inicio tras el login exitoso
      redirect_to inicio_path, notice: 'Inicio de sesión exitoso'
    else
      # Muestra un mensaje de error si las credenciales son incorrectas
      flash.now[:alert] = 'Correo o contraseña incorrectos'
      render :new
    end
  end

  # Método para manejar el cierre de sesión
  def destroy
    uri = URI.parse('http://localhost:3001/auth/logout')
    Net::HTTP.post(uri, {})

    # Redirige al formulario de login tras cerrar la sesión
    redirect_to login_path, notice: 'Sesión cerrada correctamente'
  end
end
