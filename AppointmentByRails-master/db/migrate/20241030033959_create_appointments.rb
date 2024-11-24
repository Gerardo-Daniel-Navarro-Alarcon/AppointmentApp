class CreateAppointments < ActiveRecord::Migration[7.2]
  def change
    create_table :appointments do |t|
      t.references :employee, null: false, foreign_key: true
      t.references :service, null: false, foreign_key: true
      t.datetime :appointment_date
      t.string :status
      t.text :notes
      t.timestamps
    end
  end
end
