10.times do
  Event.create({
    title: Faker::Friends.character,
    start_time: Faker::Time.between(2.days.ago, Date.today, :all),
    end_time: Faker::Time.between(2.days.ago, Date.today, :all),
    date: Faker::Time.between(DateTime.now - 1, DateTime.now)
  })
end
