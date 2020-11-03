/*
 * Created by Joshua Greenert on 11/1/2020.
 *
 * This script will add the rows from the new cells and paste their values in the cells
 * for the current time period.
 */
function addRows() {
  
  // Set the new ranges to get the data from the cells.
  var budgetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Budget_Tracker")
  var rangesSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ranges")
  
  // Each weekly dataset.
  var week1 = budgetSheet.getRange("F8:S8").getValues()
  var week2 = budgetSheet.getRange("F10:S10").getValues()
  var week3 = budgetSheet.getRange("F12:S12").getValues()
  
  // Rows for data.
  var dateRange = budgetSheet.getRange("C16:C").getValues()
  var letterRange = rangesSheet.getRange("D1:D").getValues()
  var rowRange = []
  var newDateRange = []
  
  var today = new Date()
  var begin = new Date()
  var end = new Date()
  
  var cellString = ""
  var letterarray = []
  
  // convert ranges to strings and then back to arrays.
  var strweek1 = week1.toString()
  var strweek2 = week2.toString()
  var strweek3 = week3.toString()
  
  var newweek1 = strweek1.split(",")
  var newweek2 = strweek2.split(",")
  var newweek3 = strweek3.split(",")
  
  // Update each date value inside of the old date range and the new date range.
  for(var i = 0; i < dateRange.length; i++){
    if(dateRange[i] != ""){
      newDateRange.push( new Date(dateRange[i]))
    }
  }

  // Add letters to the array to use them later.
  for(var i = 0; i < letterRange.length; i++){
    if(letterRange[i] == ""){
      break;
    }
    else{
      letterarray.push(letterRange[i])
    }
  }
  
  // For loop to find date and paste information.
  for(var i = 0; i < dateRange.length; i++){
    if(dateRange[i+1] == ""){
      break
    }
    else{
      begin = newDateRange[i]
      end = newDateRange[i+1]

      if(today >= begin && today < end){

        for(var j = 0; j < letterarray.length; j++){
          cellString = String(letterarray[j])
          cellString = cellString + (i+16)
          Logger.log(cellString)
          rowRange = budgetSheet.getRange(cellString).setValue(newweek1[j])
        }
        for(var j = 0; j < letterarray.length; j++){
          cellString = String(letterarray[j])
          cellString = cellString + (i+17)

          rowRange = budgetSheet.getRange(cellString).setValue(newweek2[j])
        }
        for(var j = 0; j < letterarray.length; j++){
          cellString = String(letterarray[j])
          cellString = cellString + (i+18)

          rowRange = budgetSheet.getRange(cellString).setValue(newweek3[j])
        }

        break;
        
      }
    }
  }
}
