# config/routes.rb
Rails.application.routes.draw do
  # Ruta para la página principal (root), redirige al formulario de inicio de sesión
  root 'sessions#new'

  # Rutas para el manejo de sesiones (login, logout)
  get 'login', to: 'sessions#new', as: :login        # Muestra el formulario de inicio de sesión
  post 'sessions', to: 'sessions#create'             # Procesa el formulario y crea la sesión
  get 'logout', to: 'sessions#destroy', as: :logout  # Cierra la sesión

  # Rutas para los recursos principales
  resources :appointments
  resources :products do
    collection do
      get 'low_stock' # Ruta para acceder a los productos con inventario bajo
    end
  end
  resources :services
  resources :employees

  # Ruta para la pantalla de inicio después de iniciar sesión
  get 'inicio', to: 'inicio#index', as: :inicio

  # Soporte para PWA (Progressive Web App)
  get 'service-worker', to: 'rails/pwa#service_worker', as: :pwa_service_worker
  get 'manifest', to: 'rails/pwa#manifest', as: :pwa_manifest

  # Endpoint para verificar el estado del servidor
  get 'up', to: 'rails/health#show', as: :rails_health_check
end
