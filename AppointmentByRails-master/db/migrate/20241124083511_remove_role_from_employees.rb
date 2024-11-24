class RemoveRoleFromEmployees < ActiveRecord::Migration[7.2]
  def change
    remove_column :employees, :role, :string
  end
end
