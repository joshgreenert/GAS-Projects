/*
 * Created on 6/22/2021 by Joshua Greenert
 * 
 * This function will check the list of plugins to find ones that are 10 days away from
 * expiring to be renewed.  Then a list is compiled and an email is sent out with all of 
 * the sites needed to be updated.
 */

function sendEmailPlugins() {

  // Set the new ranges to get the data from the cells.
  var rangeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Plugins")
  var pluginData = rangeSheet.getRange("A5:G40").getValues()

  // Variables
  var pluginArray = []
  var msg = ""

  // Loop through the days left to find out what items need to be added to the plugin array
  for(var i = 0; i < pluginData.length; i++){
    if(pluginData[i][6] < 10){
      pluginArray.push([pluginData[i][0], pluginData[i][1], pluginData[i][2], pluginData[i][3], pluginData[i][6]])
    }
  }

  // Set the message to include the plugins and display them to the user.
  if(pluginArray === undefined || pluginArray.length == 0) {
    Logger.log("No plugins have expired!")
  }
  else{

    msg = "<html><body><table style='width:25%; text-align: center;'><tr><th>Plugin Name</th><th>Price</th> <th>CMS</th><th>Provider</th><th>Days Left</th></tr>"

    for(var i = 0; i < pluginArray.length; i++){
      msg += "<tr>"
      msg += "<td>" + pluginArray[i][0] + "</td>"
      msg += "<td>" + pluginArray[i][1] + "</td>"
      msg += "<td>" + pluginArray[i][2] + "</td>"
      msg += "<td>" + pluginArray[i][3] + "</td>"
      msg += "<td>" + pluginArray[i][4] + "</td>"
      msg += "</tr>"
    }

    msg += "</table></body></html>"

    MailApp.sendEmail({
    to: "dev@dang-designs.com",
    subject: "Plugins Expiring Soon:",
    htmlBody: msg,
    });
  }
}
