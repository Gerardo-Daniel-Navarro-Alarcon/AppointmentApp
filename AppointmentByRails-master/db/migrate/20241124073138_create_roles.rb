class CreateRoles < ActiveRecord::Migration[7.2]
  def change
    create_table :roles do |t|
      t.string :name, null: false

      t.timestamps
    end

    # Agregar un índice único en la columna :name
    add_index :roles, :name, unique: true
  end
end