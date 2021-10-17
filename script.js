window.onload = async function() {
  var meetingData = await getMeetingData();
  console.log(meetingData)
  var calendarData = [];
  for(i in meetingData) {
    meetingData[i].date = meetingData[i].date.replaceAll("-","/");
    var parsedDate = new Date(`${meetingData[i].date} ${meetingData[i].start}`);

    var calendarDataObject = {
      "name": "Club Meeting",
      "start": parsedDate,
      "end": parsedDate,
      "data": meetingData[i]
    };
    
    calendarData.push(calendarDataObject)
  }


  var sortedMeetingData = calendarData.sort((a,b)=>{
    return a.start.getTime() - b.start.getTime()
  })
  var filteredMeetingData = sortedMeetingData.filter((a)=>{
    if(a.start.getTime() > Date.now()) return true
  })
  var nextMeeting = filteredMeetingData[0]
  console.log(nextMeeting)
  $(".meetings-nextmeeting-relativetime").text(writtenRelativeDifference(nextMeeting.start.getTime()))
  console.log(nextMeeting.start.toGMTString().split(" ").slice(0,4))
  var nextMeetingDateArray = nextMeeting.start.toGMTString().split(" ").slice(0,4);
  var nextMeetingDateFormattedArray = utilities.arraySwapPositions(nextMeetingDateArray,1,2)
  var nextMeetingDate = nextMeetingDateFormattedArray.join(" ")
  console.log(nextMeetingDateArray,nextMeetingDateFormattedArray,nextMeetingDate)
  $(".meetings-nextmeeting-date").text(`on ${nextMeetingDate} in ${nextMeeting.data.place}`)

  $("#nextmeeting-gdrive").hide();
  $("#nextmeeting-replit").hide();
  if(
    nextMeeting.data.hasOwnProperty("gdrive")
    &&
    nextMeeting.data.gdrive.length > 0
  ) {
    console.log("gdrive exists")
    $("#nextmeeting-gdrive").attr("href",nextMeeting.data.gdrive);
    $("#nextmeeting-gdrive").show();
  }
  if(
    nextMeeting.data.hasOwnProperty("replit")
    &&
    nextMeeting.data.replit.length > 0
  ) {
    console.log("replit exists")
    $("#nextmeeting-replit").attr("href",nextMeeting.data.replit);
    $("#nextmeeting-replit").show();
  }

  new Calendar({
    id: "#calendar",
    calendarSize: "small",
    eventsData: calendarData,
    dateChanged: function(currentDate,filteredDateEvents) {
      var meeting = filteredDateEvents[0];
      $("#meetingdoesntexist").hide();
      $("#meetingexists").hide();
      if(meeting === undefined) {
        $("#meetingdoesntexist").text("No Meeting On "+new Date(currentDate).toLocaleDateString()).show();
      } else {
        $("#cal-date").text("");
        $("#cal-time").text("");
        $("#cal-location").text("");
        $("#cal-agenda").text("");

        $("#meetingexists").show();
        
        $("#cal-date").text(meeting.data.date);
        $("#cal-time").text(meeting.data.start);
        $("#cal-location").text(meeting.data.place);
        $("#cal-agenda").text(meeting.data.agenda);

        $("#cal-googlebutton").hide();
        $("#cal-replbutton").hide()
        console.log(meeting.data)
        if(
          meeting.data.hasOwnProperty("gdrive")
          &&
          meeting.data.gdrive.length > 0
        ) {
          console.log("gdrive exists")
          $("#cal-googlebutton").attr("href",meeting.data.gdrive);
          $("#cal-googlebutton").show();
        }
        if(
          meeting.data.hasOwnProperty("replit")
          &&
          meeting.data.replit.length > 0
        ) {
          console.log("replit exists")
          $("#cal-replbutton").attr("href",meeting.data.replit);
          $("#cal-replbutton").show();
        }
      }
    }
  });
}

async function getMeetingData() {
  var data = await fetch("https://api.isb-computer-science-club.repl.co");
  var processedData = await data.json();
  window.data = processedData;
  return processedData
}

function writtenRelativeDifference(target) {
  const now = Date.now();
  var difference = target - now;

  function plural(unit) {
    if(Math.round(difference/unit)>1) {
      return "s"
    } else {
      return ""
    }
  }
  var past = false;
  if (difference < 0) {
    past = true
    difference = Math.abs(difference)
  }
  var writtendifference = "Beyond Comprehension"
  if(difference < 1000) {
    writtendifference = `Less Than A Second`;
  } else {
    if(difference < 60000) {
      writtendifference = `${Math.round(difference/1000)} Second${plural(1000)}`;
    } else {
      if(difference < 3600000) {
        writtendifference = `${Math.round(difference/60000)} Minute${plural(60000)}`;
      } else {
        if(difference < 86400000) {
          writtendifference = `About ${Math.round(difference/3600000)} Hour${plural(3600000)}`;
        } else {
          if(difference < 604800000) {
            writtendifference = `About ${Math.round(difference/86400000)} Day${plural(86400000)}`;
          } else {
            if(difference < 2629800000) {
              writtendifference = `About ${Math.round(difference/604800000)} Week${plural(604800000)}`;
            } else {
              writtendifference = `About ${Math.round(difference/2629800000)} Month${plural(2629800000)}`;
            }
          }
        }
      }
    }
  }
  return `${writtendifference}${past ? ` In The Past`:""}`
}