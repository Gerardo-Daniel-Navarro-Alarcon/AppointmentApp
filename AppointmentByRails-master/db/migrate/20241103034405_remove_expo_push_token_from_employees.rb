class RemoveExpoPushTokenFromEmployees < ActiveRecord::Migration[7.2]
  def change
    remove_column :employees, :expo_push_token, :string
  end
end
