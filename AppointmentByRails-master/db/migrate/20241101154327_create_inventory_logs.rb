class CreateInventoryLogs < ActiveRecord::Migration[7.2]
  def change
    create_table :inventory_logs do |t|
      t.references :product, null: false, foreign_key: true
      t.integer :change, null: false
      t.string :reason, null: false
      t.references :appointment, null: false, foreign_key: true
      t.timestamps
    end
  end
end
