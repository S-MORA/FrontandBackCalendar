//Calendar
$(document).ready(function() {
  let date = new Date();
  let today = date.getDate();
  let events = eventCheck(today, date.getMonth() + 1, date.getFullYear());
  $(".month").click({
    date: date
  }, changeMonth);
  $("#add-button").click({
    date: date
  }, newEvent);
  $(".months-row").children().eq(date.getMonth()).addClass("active-month");
  createCalender(date);
  showEventsForDay(events, months[date.getMonth()], today);
});

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function createCalender(date) {
  $(".tbody").empty();
  $(".events-container").empty();
  let calDays = $(".tbody");
  let month = date.getMonth();
  let year = date.getFullYear();
  let dayCounter = daysForMonth(month, year);
  let row = $("<tr class='table-row'></tr>");
  let today = date.getDate();
  // has 5 rows of 7 boxes with the correct date on the correct days
  date.setDate(1);
  let dayOne = date.getDay();

  for (let i = 0; i < 35 + dayOne; i++) {
    // find date out of 5 rows * 7 days
    let day = i - dayOne + 1;
    if (i % 7 === 0) {
      calDays.append(row);
      row = $("<tr class='table-row'></tr>");
    }
    if (i < dayOne || day > dayCounter) {
      let activeDate = $("<td class='table-date nil'>" + "</td>");
      row.append(activeDate);
    } else {
      let activeDate = $("<td class='table-date'>" + day + "</td>");
      let events = eventCheck(day, month + 1, year);
      if (today === day && $(".active-date").length === 0) {
        activeDate.addClass("active-date");
        showEventsForDay(events, months[month], day);
      }
      if (events.length !== 0) {
        activeDate.addClass("event-date");
      }
      activeDate.click({
        events: events,
        day: day,
        month: months[month],
        year: year,
      }, dayClick);
      row.append(activeDate);
    }
  }
  calDays.append(row);
}

function daysForMonth(month, year) {
  let monthStart = new Date(year, month, 1);
  let monthEnd = new Date(year, month + 1, 1);
  let oneDay = (1000 * 60 * 60 * 24);
  return (monthEnd - monthStart) / oneDay;
}
//Switch between months
function changeMonth(event) {
  $(".events-container").show(100);
  $("#pop-out").hide(100);
  let date = event.data.date;
  $(".active-month").removeClass("active-month");
  $(this).addClass("active-month");
  let differentMonth = $(".month").index(this);
  date.setMonth(differentMonth);
  console.log(differentMonth)
  createCalender(date);
}

// GET, POST, DELETE events

function dayClick(event) {
  $(".events-container").show(100);
  $("#pop-out").hide(100);
  $(".active-date").removeClass("active-date");
  $(this).addClass("active-date");
  showEventsForDay(event.data.events, event.data.month, event.data.day);
};
//GET JSON from Rails API
function eventCheck(day, month, year) {
  let events = [];
  $.ajax({
    url: "http://localhost:3000/api/v1/events/",
    async: false,
    dataType: 'json',
    success: function(dataArray) {
      $.each(dataArray.data, function(index, event) {
        if ($.format.date(event.date, "d") === String(day) &&
          $.format.date(event.date, "MMMM") === months[month - 1] &&
          $.format.date(event.date, "yyyy") === String(year)) {
          events.push(event)
        }
      })
    }
  })
  return events
};

function newEvent(event) {
  if ($(".active-date").length === 0)
    return;
  $("#pop-out input[type=text]").val('');
  $("#pop-out input[type=time]").val('');
  $(".events-container").hide(100);
  $("#pop-out").show(100);
  $("#cancel-button").click(function() {
    $("#pop-out").hide(100);
    $(".events-container").show(100);
  });
  //form creates event and makes the form disappear
  $("#ok-button").click(function() {
    let date = event.data.date;
    console.log(date.getFullYear())
    let name = $("#name").val().trim();
    let start = $("#start").val();
    let end = $("#end").val();
    let day = parseInt($(".active-date").html());
    $("#pop-out").hide(100);
    createEvent(name, start, end, day, date);
    date.setDate(day);
    createCalender(date);
  })
};
//POST object to Rails API
function createEvent(name, start, end, day, date) {
  let event = {
    "title": name,
    "start_time": start,
    "end_time": end,
    "date": date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + day
  };
  $.ajax({
    url: 'http://localhost:3000/api/v1/events/',
    type: "POST",
    dataType: 'json',
    data: event,
  })
};

function showEventsForDay(events, month, day) {
  $(".events-container").empty();
  $(".events-container").show(100);
  // if no events
  if (events.length === 0) {
    let event_card = $("<div class='event-card'></div>");
    let event_name = $("<div class='event-name'>You have no events for " + month + "  " + day + ".</div>");
    $(event_card).css({
      "border-left": "8px solid red"
    });
    $(event_card).append(event_name);
    $(".events-container").append(event_card);
  } else {
    // add events to dom
    for (let i = 0; i < events.length; i++) {
      let event_card = $("<div class='event-card'></div>");
      let event_name = $("<div class='event-name'>" + events[i]["title"] + "</div>");
      let event_start = $("<div class='event-time'> Starts: " + $.format.date(events[i].start_time, 'h') + ':' + $.format.date(events[i].start_time, 'mm') + "</div>");
      let event_end = $("<div class='event-time'> Ends: " + $.format.date(events[i].end_time, 'h') + ':' + $.format.date(events[i].end_time, 'mm') + "</div>");
      let event_deletion = $(`<input method='DELETE' type='button' value='Delete' class='button event-delete' id='${events[i].id}'></input>`)
      $(event_card).append(event_name).append(event_start).append(event_end).append(event_deletion);
      $(".events-container").append(event_card);
    }
    //Able to delete events
    $('.events-container').on('click', '.event-delete', function() {
      let id = $(this).attr('id')
      $.ajax({
        url: `http://localhost:3000/api/v1/events/${id}`,
        type: 'DELETE',
        success: function() {
          window.location.reload();
        },
      })
    })
  }
};