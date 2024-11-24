class AddDurationToServices < ActiveRecord::Migration[7.2]
  def change
    add_column :services, :duration, :integer
  end
end
