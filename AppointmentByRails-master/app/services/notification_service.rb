# app/services/notification_service.rb
require 'net/http'
require 'uri'
require 'json'

class NotificationService
  EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send".freeze

  def self.send_low_stock_alert(product)
    tokens = Employee.admin_tokens
    return if tokens.empty?

    messages = tokens.map do |token|
      {
        to: token,
        sound: "default",
        title: "Inventario Bajo",
        body: "El inventario del producto #{product.name} está bajo.",
        data: { product_id: product.id }
      }
    end

    uri = URI.parse(EXPO_PUSH_URL)
    headers = { "Content-Type" => "application/json" }
    
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(uri.request_uri, headers)
    request.body = { to: tokens, data: messages }.to_json
    response = http.request(request)

    Rails.logger.info("Notificación enviada: #{response.body}")
  end
end
