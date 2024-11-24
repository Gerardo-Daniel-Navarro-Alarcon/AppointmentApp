class ChangeCategoryColumnInServices < ActiveRecord::Migration[7.2]
  def change
    remove_column :services, :category, :string
    add_reference :services, :category, null: false, foreign_key: true
  end
end