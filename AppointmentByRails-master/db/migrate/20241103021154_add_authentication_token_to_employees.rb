class AddAuthenticationTokenToEmployees < ActiveRecord::Migration[7.2]
  def change
    add_column :employees, :authentication_token, :string
    add_index :employees, :authentication_token, unique: true  
  end
end
