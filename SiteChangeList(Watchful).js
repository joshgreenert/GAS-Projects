/*
 * Created by Joshua Greenert on 9/16/2020
 *
 * This script will separate the site, date, and plugin update
 
                              PSEUDOCODE
 Find indexOf Activity Logs
	grab website and end at forward slash(/)
Start where forward slash ends
	grab date and end at indexOf m
Start where m ends
	grab update data where month begins 
		month variable will need to be specified in 01, 10, 12 format

 */

function SiteChangeList(index1, index2) {
  var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Multiple_Input")

  // Add the ranges to pull data from.
  var dataArrayRange = dataSheet.getRange("A1:A").getValues()
  var dataRange = []
  
  // Variables to hold the data.
  var siteRange = []
  var dateRange = []
  var pluginRange = []
  var finalArray = []
  
  var site = ""
  var date = ""
  var plugin = ""
  var updatestr = ""
  
  var plugstr = 0
  var datelen = 0
  var pluginlen = 0
  
  var month
  
  
  // Set all pieces within the given array to strings.
  for(var i = 0; i < dataArrayRange.length; i++){
    dataRange.push(dataArrayRange[i][0].toString())
  }
  
  // Set each site, date, and plugin through a for loop.
  for(var i = 0; i < dataRange.length; i++){
    
    // Set the site for each record, the date, and the plugin data.
    site = dataRange[i].substring(13, dataRange[i].indexOf("/"))
    
    /* This is to catch the 360twin issue and will need to be updated every month that the report is ran.*/
    if(dataRange[i].indexOf("360twin") == -1){
      dataRange[i] = dataRange[i].substring(dataRange[i].indexOf(index1), dataRange[i].length)
    }
    else{
      dataRange[i] = dataRange[i].substring(dataRange[i].indexOf(index2), dataRange[i].length)
    }
    
    // For loop through each record after the first to ensure that the data is grabbed.
    for(var j = 0; j < dataRange[i].length; j++){
      
      if((dataRange[i].indexOf("am") != -1) || (dataRange[i].indexOf("pm") != -1)){
        date = dataRange[i].substring(0, dataRange[i].indexOf("m") +1)
        Logger.log(date)
        month = date.substring(0, 2)
        datelen = date.length
        date = new Date(Date.parse(date.substring(0, 10)))
        
        // Update the dataRange again to strip the data based on the end of the date.
        dataRange[i] = dataRange[i].substring(datelen, dataRange[i].length)
        
        if(dataRange[i].indexOf(month) == -1){
          plugin = (dataRange[i].indexOf("Page") != -1) ? dataRange[i].substring(0, dataRange[i].indexOf("Page")) : dataRange[i].substring(0, dataRange[i].length)
          pluginlen = plugin.length
        }
        else{
          plugin = dataRange[i].substring(0, dataRange[i].indexOf(month + "/"))
          pluginlen = plugin.length
        }
        dataRange[i] = dataRange[i].substring(pluginlen, dataRange[i].length)
        
        // Separate the plugin from the modification.
        if(plugin.indexOf("updated") != -1){
          plugstr = plugin.substring(0, plugin.indexOf("has been updated")-1)
          updatestr = plugin.substring(plugin.indexOf("updated"), plugin.length)
          updatestr = updatestr.charAt(0).toUpperCase() + updatestr.substring(1,updatestr.length)
        }
        else if(plugin.indexOf("installed") != -1){
          plugstr = plugin.substring(0, plugin.indexOf("has been installed")-1)
          updatestr = plugin.substring(plugin.indexOf("installed"), plugin.length)
          updatestr = updatestr.charAt(0).toUpperCase() + updatestr.substring(1,updatestr.length)
        }
        else if(plugin.indexOf("modified") != -1){
          plugstr = plugin.substring(0, plugin.indexOf("has been modified")-1)
          updatestr = plugin.substring(plugin.indexOf("modified"), plugin.length)
          updatestr = updatestr.charAt(0).toUpperCase() + updatestr.substring(1,updatestr.length)
        }
        else if(plugin.indexOf("deleted") != -1){
          plugstr = plugin.substring(0, plugin.indexOf("has been deleted")-1)
          updatestr = plugin.substring(plugin.indexOf("deleted"), plugin.length)
          updatestr = updatestr.charAt(0).toUpperCase() + updatestr.substring(1,updatestr.length)
        }
        else if(plugin.indexOf("detected") != -1){
          continue
        }
        else if(plugin.indexOf("failed") != -1 || plugin.indexOf("fausse") != -1){
          continue
        }
        else{
          plugstr = plugin
        }
        
        // Add the fields to a the final array.
        finalArray.push([date, site, plugstr, updatestr])
      }
      else{
        continue
      }
    }
  }
  return finalArray
}