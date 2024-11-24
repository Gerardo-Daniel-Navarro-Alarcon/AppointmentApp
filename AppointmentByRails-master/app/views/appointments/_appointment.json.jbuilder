json.extract! appointment, :id, :employee_id, :service_id, :appointment_date, :status, :notes, :created_at, :updated_at, :created_at, :updated_at
json.url appointment_url(appointment, format: :json)
