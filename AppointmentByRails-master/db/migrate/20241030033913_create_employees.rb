class CreateEmployees < ActiveRecord::Migration[7.0]
  def change
    create_table :employees do |t|
      t.string :first_name
      t.string :last_name
      t.string :email, unique: true
      t.string :password_digest
      t.string :role
      t.string :phone_number
      t.references :role, null: false, foreign_key: true
      t.timestamps  # Esta línea ya crea las columnas created_at y updated_at automáticamente
    end
  end
end
