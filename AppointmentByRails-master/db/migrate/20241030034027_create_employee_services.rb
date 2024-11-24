class CreateEmployeeServices < ActiveRecord::Migration[7.2]
  def change
    create_table :employee_services do |t|
      t.references :employee, null: false, foreign_key: true
      t.references :service, null: false, foreign_key: true
      t.timestamps
    end
  end
end
