class CreateAppointmentProducts < ActiveRecord::Migration[7.2]
  def change
    create_table :appointment_products do |t|
      t.references :appointment, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.integer :quantity
      t.timestamps
    end
  end
end
