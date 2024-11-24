class AddDefaultStatusToAppointments < ActiveRecord::Migration[7.2]
  def change
      change_column_default :appointments, :status, "confirmed" # O el estado que prefieras
  end
end
