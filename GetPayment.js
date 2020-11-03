/*
 * Created by Joshua Greenert on 6/12/2019
 * This function will support an external budget sheet to show if the payment is due
 * within the date ranges that are provided.
 *
 * Updated on 2/18/2020 to support V8 engine.
 * 
 */

function getPayment(begin, end, type) {
  
  // Set the new ranges to get the data from the cells.
  var rangeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Ranges")
  var types = rangeSheet.getRange("A1:A").getValues()
  var amts = rangeSheet.getRange("B1:B").getValues()
  var dates = rangeSheet.getRange("C1:C").getValues()

  var newDateRange = []
  var oldDateRange= []
  
  // Create the variable for today to use as a reference and the future date to compare
  // against other dates to ensure that the range reference is correct.
  var today = new Date()
  var HOAdate = new Date(getHOAdate(today))

  // Convert begin and end values to dates to ensure that they return properly.
  begin = Date.parse(begin)   //   8292040320292304920929029
  end = Date.parse(end)
  begin = new Date(begin)     //  mon etc.  
  end = new Date(end)

  // Update each date value inside of the old date range and the new date range.
  for(var i = 0; i < dates.length; i++){
    oldDateRange[i] = new Date(today.getFullYear(), (today.getMonth() + 1), dates[i])
    newDateRange[i] = new Date(today.getFullYear(), (today.getMonth()), dates[i])
  }
  
  // Set the exception (HOA) into the list at the index of the HOA type.
  for(var i = 0; i < types.length; i++){
    if(types[i] == "HOA"){
      oldDateRange[i] = HOAdate
      newDateRange[i] = HOAdate
      
      break;
    }
  }

  // Find the type and set the index.
  var index = 0
  for(var i = 0; i < types.length; i++){
    if(types[i][0] == type){
      index = i
    }
  }

  // Check if the date is within range or not and return it.
  if(newDateRange[index] >= begin && newDateRange[index] < end){
    return amts[index]
  }
  else if(oldDateRange[index] >= begin && oldDateRange[index] < end){
    return amts[index]
  }
  else{
    return 0
  }
  
}


/** This function will grab the HOA date so that it doesn't make the rest look ugly.   */
/** Let's be honest.  That's the real reason why I did this.                           */
function getHOAdate(today){
  
  // Define your variables.
  var rangeSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Budget_Tracker")
  var hoaPayDates = rangeSheet.getRange("S1:S").getValues()
  var payDates = rangeSheet.getRange("C1:C").getValues()
  var lastRow = rangeSheet.getLastRow()
  var tempDate = new Date()
  var hoaDate = new Date()
  
  // Get the date object of the last payment.
  for(var i = lastRow; i > 0; i--){
    if(hoaPayDates[i] == 88){
      tempDate = new Date(payDates[i])
      break
    }
  }

  // Increase the date by three months and return it.
  hoaDate.setMonth(tempDate.getMonth() + 4)
 
  if (hoaDate.getDate() != tempDate.getDate()) {
    hoaDate.setDate(0);
  }
  
  hoaDate.setDate(24)
  
  return hoaDate
}



