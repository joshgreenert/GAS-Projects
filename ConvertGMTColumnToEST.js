function convertToEST(){
  var logsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Missed_Calls")
  var testSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("testing")
  var gmtDates = logsSheet.getRange("J2:J").getValues()

  var array = []
  var gmtstring = ""
  var datestring = ""
  var period = ""

  var hour
  var minutes
  var year
  var month
  var day

  // For each value in the array, convert them to a date object.
  for(var i = 0; i < gmtDates.length; i++){

    gmtstring = gmtDates[i].toString()
    
    // get the time of the object and set the remainder for the date.
    if(gmtstring.indexOf("pm") != -1){
      hour = parseInt(gmtstring.substring(0,2)) +12
      minutes = parseInt(gmtstring.substring(3,6))
      gmtstring = gmtstring.substring(gmtstring.indexOf("pm")+3, gmtstring.length)
    }
    else if(gmtstring.indexOf("am") != -1){
      hour = parseInt(gmtstring.substring(0,2)) 
      minutes = parseInt(gmtstring.substring(3,6))
      gmtstring = gmtstring.substring(gmtstring.indexOf("pm")+3, gmtstring.length)
    }

    // Get the year, month, and day from the object.
    year = parseInt(gmtstring.substring(0, 4))
    month = parseInt(gmtstring.substring(5, 8)) - 1
    day = parseInt(gmtstring.substring(8, 11))
    
    // Set up the new date object
    var gmtdate = new Date(year, month, day, hour, minutes, 0, 0)
    gmtdate.setHours(gmtdate.getHours() - 5)

    // Set the period to add to the date.
    if(parseInt(gmtdate.getHours().toString()) >= 12){
      period = "PM"
    }
    else{
      period = "AM"
    }

    // Set the datestring to be displayed in a user friendly way.
    datestring = (gmtdate.getHours().toString() + ":" + gmtdate.getUTCMinutes().toString() + period + " " + gmtdate.getFullYear().toString() + "-" +
     (parseInt(gmtdate.getMonth().toString())+1) + "-" + gmtdate.getDate().toString())

    array.push(datestring)
  }

  return array
}