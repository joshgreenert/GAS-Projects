/*
 * Created by Joshua Greenert on 8/24/2020
 *
 * This script will convert the fitment list into an uploadable piece of content to simplify
 * the part entry process for 360twin.com.
 */

function ConvertToList() {
 
  // Get the contents from the cell.
  var rangeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Fitment_Converter")
  var content = rangeSheet.getRange("C4").getValue()
 
  // Create variables to hold data while performing operations.
  var yearSplit = []
  var vehicleArray = []
  var index = 0
  var modelStr = ""
  var yearStr = ""
  var resultStr = ""
  var count = 0
 
  // Set an index variable for where the content begins.  Loop through the content
  // until a colon has been found and capture the years listed before the newline character.
  // Once the newline character has been found grab only the years.
  for(var i = 0; i < content.length; i++){
   
    // When the colon is found, get the model, then search for the
    // year while setting the index after the newline.
    if(content[i] == ":"){
      modelStr = content.substring(index,i-1)

      yearStr = content.substring(i+1, content.indexOf("\n", i))
      var actualYearStr = yearStr.length
     
      // Regex the year to remove spaces, dashes, and commas.
      yearStr = yearStr.replace(/\s/g, '')
      yearSplit = yearStr.split(",")
      Logger.log(yearSplit.length)
     
      // Create a for loop to go through each iteration of year possible to produce
      // an array holding all complete objects.
      while(true){
        if(yearStr.length == 4){
          vehicleArray.push("Harley-Davidson, " + modelStr + ", " + yearStr + "|")
          break;
        }
        else{
          for(var j = 0; j < yearSplit.length; j++){
            if(yearSplit[j].length == 4){
              vehicleArray.push("Harley-Davidson, " + modelStr + ", " + yearSplit[j] + "|")
            }
            else if(yearSplit[j].length == 9){
              var start = parseInt(yearSplit[j].substring(0, 4))
              var end = parseInt(yearSplit[j].substring(5, yearStr.length))
             
              for(var k = start; k <= end; k++){
                vehicleArray.push("Harley-Davidson, " + modelStr + ", " + k + "|")
              }
            }
          }
          break;
        }
      }
     
      // Increment variables to ensure proper excecution.
      count += 1
      i += actualYearStr + 1
      index = i +1
      yearStr = ""
      yearSplit = new Array()
    }
  }
 
  // Set the vehicleArray content to a string.
  for(var i = 0; i < vehicleArray.length; i++){
    resultStr += vehicleArray[i]
  }
 
  // Set the cell to the value.
  var resultCell = rangeSheet.getRange("E4")
  resultCell.setValue(resultStr)
}