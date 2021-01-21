/*
 * Created by Joshua Greenert on 1/15/2020
 * 
 * This function will add a new row with the updated EST time from the GMT time
 * presented within column J whenever a new row is inserted to the sheet by zapier.
 */
function onChange(e){
  var sheet = SpreadsheetApp.getActive();
  ScriptApp.newTrigger("updateRowESTTime")
    .forSpreadsheet(sheet)
    .onChange()
    .create();
}

function updateRowESTTime(e) {
    var sh = SpreadsheetApp.getActiveSheet();
    
    // Once a new row is added, get the row and set the object to 
    if(e.changeType === 'INSERT_ROW') {
      var row = sh.getActiveRange().getRow();
      var cellstring = "J" + row
      var gmtDates = sh.getRange(cellstring).getValue()

      var gmtstring = ""
      var datestring = ""
      var period = ""
      
      var hour
      var minutes
      var year
      var month
      var day

      gmtstring = gmtDates.toString()
    
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

      // Get the minutes and correct as needed.
      if(gmtdate.getUTCMinutes().toString().length == 1){
        minutes = "0" + gmtdate.getUTCMinutes().toString()
      }
      else{
        minutes = gmtdate.getUTCMinutes().toString()
      }
      
      // Set the datestring to be displayed in a user friendly way.
      datestring = (gmtdate.getHours().toString() + ":" + minutes + period + " " + gmtdate.getFullYear().toString() + "-" +
      (parseInt(gmtdate.getMonth().toString())+1) + "-" + gmtdate.getDate().toString())

      sh.getRange(row, 11).setValue(datestring)
  }

  deleteProjectTriggers()
}

function deleteProjectTriggers(){
    // do some stuff here then stop the trigger(s) by name
    var triggers = getProjectTriggersByName('updateRowESTTime');
    for (var i = 0; i < triggers.length; ++i)
        ScriptApp.deleteTrigger(triggers[i]);
}

function getProjectTriggersByName(name) {
    return ScriptApp.getProjectTriggers().filter(
        function(s) {return s.getHandlerFunction() === name;}
    );
}
