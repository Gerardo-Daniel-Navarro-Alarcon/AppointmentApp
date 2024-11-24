# app/controllers/api/notifications_controller.rb
class Api::NotificationsController < ApplicationController
  require 'httparty'

  # Acción para enviar notificación de inventario bajo
  def send_low_stock_notification
    # Obtiene los tokens de los administradores
    admin_tokens = Employee.admin_tokens

    # Verifica que haya tokens disponibles
    if admin_tokens.empty?
      render json: { message: "No hay administradores con tokens registrados." }, status: :not_found
      return
    end

    # Detalles de la notificación
    message = {
      to: admin_tokens,
      title: "Alerta de Inventario Bajo",
      body: "Algunos productos están por agotarse. Verifique el inventario.",
      sound: "default"
    }

    # Envío de la notificación a través de Expo
    response = HTTParty.post(
      "https://exp.host/--/api/v2/push/send",
      headers: { 'Content-Type' => 'application/json' },
      body: message.to_json
    )

    # Manejo de la respuesta
    if response.success?
      render json: { message: "Notificación enviada con éxito." }, status: :ok
    else
      render json: { error: "Error al enviar la notificación.", details: response.body }, status: :internal_server_error
    end
  end
end
