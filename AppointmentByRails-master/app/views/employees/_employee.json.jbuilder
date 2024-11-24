json.extract! employee, :id, :first_name, :last_name, :email, :password_digest, :role, :phone_number, :created_at, :updated_at, :created_at, :updated_at
json.url employee_url(employee, format: :json)
