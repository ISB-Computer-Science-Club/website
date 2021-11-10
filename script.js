// The window.onload function is excecuted when the page is completely loaded.
window.onload = async function() {
  // Gets future meeting data from the getMeetingData() function. (Found on line 166)
  var meetingData = await getMeetingData();


  // ===== REFORMATTING THE MEETING DATA FOR THE MEETING CALENDAR. =====
  // Creates a empty array that will be later be filled with future meetings to be used in the calendar.
  var calendarData = [];

  // Looks through the future meetings (which are formatted in a list) and formats them to meet the format for the calendar package.
  // for loops look through each item in the array. i is the index/counter (which counts up the index of items in the array) and meetingData is the array the for loop will look through.
  for(i in meetingData) {
    // Items in the array are accessed by the array (in this case meetingData) followed by the index (the position) in brackets. 
    // For example, to access the first item in the array, you would do meetingData[0] (JavaScript starts counting at 0, so the first item is 0 not 1.)
    // This would return an object with the properties date, start, end, place, gdrive, replit and agenda.
    // Since the for loop is iterating through a array, the i variable would count up to how many items there are in the list. So meetingData[i] would be used.
    // Properties of objects are accessed in two ways, dot notation and bracket notation.
    // Dot notation: meetingData[i].date
    // Bracket notation: meetingData[i]["date"] (similar to accessing arrays)

    // Formats the data which is currently in the 1-1-2000 style to 1/1/2000 style by replacing all the dashes with forward slashes.
    meetingData[i].date = meetingData[i].date.replaceAll("-","/");
    // JavaScript has a speciate Date specification that can be used to turn a string date such as "1/1/2020" and turn it into a machine-readable format. new Date(*and the date here*) helps generate this machine readable format. This combines the date properties and start properites.
    // These new start and end variables which now contain the machine readable dates and times are assigned to parsedStart and parsedEnd.
    var parsedStart = new Date(`${meetingData[i].date} ${meetingData[i].start}`);
    var parsedEnd = new Date(`${meetingData[i].date} ${meetingData[i].end}`);

    // A new object is assigned to a new variable called calendarDataObject.
    // This formats the data into a format readable by the calendar package.
    var calendarDataObject = {
      "name": "Club Meeting", // This assigns the name of the event (which is a meeting).
      "start": parsedStart, // This assigns the start time/date of the meeting.
      "end": parsedEnd, // This assigns the end time/date of the meeting.
      "data": meetingData[i] // This assigns the meeting data, the data we just used, so it can be used for future referece. 
    };
    
    // This .push() function "pushes" the object we just made into the array that we made. (Found on line 9)
    calendarData.push(calendarDataObject)
  }

  // ===== SETTING THE "THE NEXT MEETING" WIDGET ======
  // This reuses the calendarData array that we just generated and sorts it. The sort function by itself works fine if it is a array of numerical values, but for a array with objects, we need to tell it how to sort.
  var sortedMeetingData = calendarData.sort((a,b)=>{
    // Similar to a for loop, this goes through the list and compares two valeus, which are in variables a and b.

    // Sort function return by subtracting the value you are sorting by. In this case it is the data and time, which can be found by getting a Unix timestamp using the .getTime() function.
    // The .getTime() function works because it is a built-in function of the special machine readable Date format that was discussed before. (Found on line 24)
    // Unix timestamps are a long series of numbers that count up the seconds since January 1, 1970. It is a common format used in programming to measure time since machiens can't easily sort dates with letters, commas and spaces.
    return a.start.getTime() - b.start.getTime()
  })
  // This function gets the sorted values, which were assigned to the sortedMeetingData function and filters them to only the ones in the future, since people visiting don't need to know the time passed since the last meeting.
  var filteredMeetingData = sortedMeetingData.filter((a)=>{
    // The filter function also works by going through the list and checking values. If you return a true value, it will include it, if its false or you return nothing, then it won't include it.
    // The if function compares the Unix timestamp between that of the event/meeting we are checking, and the current Unix timestamp, which can be obtained by using the Date.now() function. 
    if(a.start.getTime() > Date.now()) return true
  })

  // Gets the first object in the filtered and sorted array and assigns it to the nextMeeting variable.
  var nextMeeting = filteredMeetingData[0]
  // Logs it to the console with a message.
  console.log("Next Meeting Object: (From Line 62)",nextMeeting)

  // Uses jQuery to "select" the elements with "meetings-nextmeeting-relativetime" class and change the text to the "written relative difference". This uses the function writtenRelativeDifference(). (Found on line 178) 
  $(".meetings-nextmeeting-relativetime").text(writtenRelativeDifference(nextMeeting.start.getTime()))

  // These next 8 lines reforat the machine-readable date format into the 'dayoftheweek, month date year' format
  // This line takes the meeting start date and converts it to a GMT string, then splits it up into a array separated by spaces and taking the first 4 parts of the array.
  // A GMT string is a 'dayoftheweek, day, month, year, time' format.
  var nextMeetingDateArray = nextMeeting.start.toGMTString().split(" ").slice(0,4);
  // This line swaps the day and month positions of the array. This uses a package called utilities.
  var nextMeetingDateFormattedArray = utilities.arraySwapPositions(nextMeetingDateArray,1,2)
  // Puts the array together in order into a string.
  var nextMeetingDate = nextMeetingDateFormattedArray.join(" ")
  // Gets the element which has the rest of the meeting information and change the text on it to say the correct meeting date and location. 
  $(".meetings-nextmeeting-date").text(`on ${nextMeetingDate} in ${nextMeeting.data.place}`)

  // The next two lines hides the Google Drive and Replit buttons. They will be shown later if it turns out to have Google Drive or Replit links for the meeting.
  $("#nextmeeting-gdrive").hide();
  $("#nextmeeting-replit").hide();
  // This if statement checks if the meeting object has a property called "gdrive" (which is where the Google Drive links are) and if there is a 'gdrive' property, it checks if the length of the value is greater than 0. (So as to make sure it isn't a empty string.
  /*if(
    nextMeeting.data.hasOwnProperty("gdrive")
    && // && is a "operator" for if functions. It tells the computer to excecute the if function only if both of them are true. If either or none of them are true, it will return false.
    nextMeeting.data.gdrive.length > 0
  ) {
    // Changes the 'link destination' or href of the button to the 'gdrive' property of the meetining data.
    $("#nextmeeting-gdrive").attr("href",nextMeeting.data.gdrive);
    // Shows the button.
    $("#nextmeeting-gdrive").show();
  }
  // The next 9 lines are the same thing except for the replit links.
  if(
    nextMeeting.data.hasOwnProperty("replit")
    &&
    nextMeeting.data.replit.length > 0
  ) {
    console.log("replit exists")
    $("#nextmeeting-replit").attr("href",nextMeeting.data.replit);
    $("#nextmeeting-replit").show();
  }*/
  for(i in nextMeeting.data.buttons) {
    var buttonName = i
    var buttonLink = nextMeeting.data.buttons[i]
    console.log(buttonName,buttonLink)

    var newElement = document.createElement("a")
    console.log(newElement)
    newElement.classList.add("button")
    newElement.href = buttonLink
    newElement.innerText = buttonName

    document.getElementById("meetings-nextmeeting-buttons").appendChild(newElement)
  }

  // ===== SETS UP THE CALENDAR ======
  // The calendar package uses a 'Constructor' (think if it as, constructing a new calendar object.) which accepts an id (the id of the element in which the calendar should be placed), the calendarSize, the eventsData, (which is the formatted array of meetings that we generated earliner on line 7 to line 40) and the dateChanged. The dateChanged property is a 'event listener'.
  // Event listeners listen for events that occur. For this example, it excecutes the function inside every time the date is changed. 
  new Calendar({
    id: "#calendar",
    calendarSize: "small",
    eventsData: calendarData,
    dateChanged: function(currentDate,filteredDateEvents) {
      // The insides of this function are only excecuted when a user clicks the a different date.
      // This event listener returns the current date, and the events that are on that date.
      
      // Since there will only be a maximum of 1 meeting per day, we will just get the first item of the filteredDateEvents and assign it to a variable called meeting. 
      var meeting = filteredDateEvents[0];
      // Hide the 'No Meeting On **date**' message and the meeting information section. (Because the calendar might have previously been on a date that might have had or had not had a meeting.) 
      $("#meetingdoesntexist").hide();
      $("#meetingexists").hide();
      // If the meeting is undefined, it means that the filteredDateEvents was empty, meaning no events or meeting were on that date.
      if(meeting === undefined) {
        // Change the text to inform the user that there is no meeting.
        $("#meetingdoesntexist").text("No Meeting On "+new Date(currentDate).toLocaleDateString()).show();
      } else { // Else functions can be attached onto if functions. If the if function returns false, the else function would be excecuted.
        // Setting the calendar information elements empty sicne there may have been previously set information.
        $("#cal-date").text("");
        $("#cal-time").text("");
        $("#cal-location").text("");
        $("#cal-agenda").text("");

        // Setting the calendar information elements to their respecitve values in the meeting data.
        $("#cal-date").text(meeting.data.date);
        $("#cal-time").text(meeting.data.start);
        $("#cal-location").text(meeting.data.place);
        $("#cal-agenda").html(meeting.data.agenda.replace(/(?:\r\n|\r|\n)/g, '<br>'));

        // Hides the buttons.
        $("#cal-googlebutton").hide();
        $("#cal-replbutton").hide();
        // Lines  to  check if there are Google Drive or Repl.it links and if there are, show them and change the button link.
        /*if(
          meeting.data.hasOwnProperty("gdrive")
          &&
          meeting.data.gdrive.length > 0
        ) {
          $("#cal-googlebutton").attr("href",meeting.data.gdrive);
          $("#cal-googlebutton").show();
        }
        if(
          meeting.data.hasOwnProperty("replit")
          &&
          meeting.data.replit.length > 0
        ) {
          $("#cal-replbutton").attr("href",meeting.data.replit);
          $("#cal-replbutton").show();
        }*/
        $("#meetingexists > a").remove()
        for(i in meeting.data.buttons) {
          var buttonName = i
          var buttonLink = meeting.data.buttons[i]
          console.log(buttonName,buttonLink)

          var newElement = document.createElement("a")
          console.log(newElement)
          newElement.classList.add("button")
          newElement.href = buttonLink
          newElement.innerText = buttonName

          document.getElementById("meetingexists").appendChild(newElement);
        }

        // SHow the meeting information section.
        $("#meetingexists").show();
      }
    }
  });
}

// A function to get the meeting data from the backend API server.
async function getMeetingData() {
  // Get the data.
  var data = await fetch("https://api.isb-computer-science-club.repl.co");
  // Turn the data into a Javascript object/JSON.
  var processedData = await data.json();
  // Set the global data variable.
  window.data = processedData;
  // Return the data to the place it was requested.
  return processedData
}

// Get the relative time difference. 
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