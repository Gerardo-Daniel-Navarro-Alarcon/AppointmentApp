# config/application.rb
require_relative 'boot'

require 'rails/all'

Bundler.require(*Rails.groups)

module AppointmentByRails
  class Application < Rails::Application
    config.load_defaults 7.2

    # Configuración de CORS para permitir peticiones desde cualquier origen (para pruebas)
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'  # Permitir cualquier origen durante desarrollo y pruebas
        resource '*',
                 headers: :any,
                 methods: [:get, :post, :put, :patch, :delete, :options, :head]
      end
    end

    # Habilitar cookies y sesiones para aplicaciones API
    config.api_only = false

    # Configuración para usar cookies de sesión
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, key: '_appointment_by_rails_session'
  end
end
