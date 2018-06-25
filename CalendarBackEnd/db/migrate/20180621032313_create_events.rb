class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :title
      t.time :start_time
      t.time :end_time
      t.datetime :date

      t.timestamps
    end
  end
end
