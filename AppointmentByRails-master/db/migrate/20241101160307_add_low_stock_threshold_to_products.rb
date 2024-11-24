class AddLowStockThresholdToProducts < ActiveRecord::Migration[7.2]
  def change
    add_column :products, :low_stock_threshold, :integer
  end
end
