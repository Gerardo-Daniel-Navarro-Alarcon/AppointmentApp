class AddExpoPushTokenToEmployees < ActiveRecord::Migration[7.2]
  def change
    add_column :employees, :expo_push_token, :string
  end
end
