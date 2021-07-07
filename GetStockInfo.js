/*
 * Created by Joshua Greenert on 5/30/2021
 * 
 * This set of functions all work in conjunction to product the stock results for
 * any traders on this workbook.  The result should provide traders with accurate
 * and detailed data that helps them understand more about their goals and actions
 * as a trader.  As is standard, this is not legal advice.
 * 
 * @PARAMS: trader, beginDate, endDate
 */

function getStockInfo(trader, beginDate, endDate, sortby){

    // Get all the ranges and set them
    var dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Data")  // Main Sheet Name
  
    var traderArray = dataSheet.getRange("B2:B").getValues()
    var symbolArray = dataSheet.getRange("C2:C").getValues()
    var tradeOptionArray = dataSheet.getRange("D2:D").getValues()
    var entryArray = dataSheet.getRange("E2:E").getValues()
    var closeArray = dataSheet.getRange("F2:F").getValues()
    var openTotalSharesArray = dataSheet.getRange("G2:G").getValues()
    var closeTotalSharesArray = dataSheet.getRange("H2:H").getValues()
    var openDateArray = dataSheet.getRange("I2:I").getValues()
    var closeDateArray = dataSheet.getRange("J2:J").getValues()
    var reasoningArray = dataSheet.getRange("K2:K").getValues()
  
    // Convert begin and end values to dates to ensure that they return properly.
    var begin = Date.parse(beginDate)   //   8292040320292304920929029
    var end = Date.parse(endDate)
    begin = new Date(begin)     //  mon etc.  
    end = new Date(end)
  
    // Local variables for script.
    var closeDateDataArray = []
    var openDateDataArray = []
    var newDateRange = []
  
    var openResultArray = []
    var closeResultArray = []
    var partialCloseResultArray = []
    var resultArray = []
  
    var profitloss = 0.00
    var updateShares = 0.00
    var marketValue = 0.00
  
    // Update each date value inside of the old date range and the new date range.
    for(var i = 0; i < openDateArray.length; i++){
      openDateArray[i] = new Date(openDateArray[i])  // This correct the dates to respond as date objects
      newDateRange[i] = new Date(openDateArray[i].getFullYear(), (openDateArray[i].getMonth()), openDateArray[i].getDate())
  
      closeDateArray[i] = new Date(closeDateArray[i])  // This correct the dates to respond as date objects
  
      // While going through here update the items to floats from data source.
      openTotalSharesArray[i] = parseFloat(openTotalSharesArray[i])
      entryArray[i] = parseFloat(entryArray[i])
      closeArray[i] = parseFloat(closeArray[i])
      closeTotalSharesArray[i] = parseFloat(closeTotalSharesArray[i])
    }
  
    // Get all closed date items into their own array.
    for(var i = 0; i < traderArray.length; i++){
      if(tradeOptionArray[i].toString() === "Close An Existing One"){
        var symbol = symbolArray[i].toString().toUpperCase()
        closeDateDataArray.push([traderArray[i], symbol, closeArray[i], closeTotalSharesArray[i], closeDateArray[i], reasoningArray[i].toString()])
      }
    }
  
    // Get all of the open date items into thier own array.
    for(var i = 0; i < traderArray.length; i++){
      if(tradeOptionArray[i].toString() === "Open New One"){
        var symbol = symbolArray[i].toString().toUpperCase()
        //var dateFix = new Date(newDateRange[i].getFullYear(), (newDateRange[i].getMonth()), openDateArray[i].getDate())
  
        openDateDataArray.push([traderArray[i], symbol, entryArray[i], openTotalSharesArray[i], newDateRange[i], reasoningArray[i].toString()])
      }
    }
  
    // Check for trader and open date for all data that meets.
    for(var i = 0; i < openDateDataArray.length; i++){
  
      if(trader == openDateDataArray[i][0] && begin < openDateDataArray[i][4]){
        var closedCheck = false
        var closedIndex = 0
        
        // Check the closed data array for the object to close it.
        for(var j = 0; j < closeDateDataArray.length; j++){
          if(openDateDataArray[i][1] === closeDateDataArray[j][1]){
            closedCheck = true
            closedIndex = j
            Logger.log(closedIndex)
            break
          }
        }
  
        if(closedCheck == true){
  
          // Check if the shares close the trade.
          updateShares = openDateDataArray[i][3] - closeDateDataArray[closedIndex][3]
  
          if(updateShares == 0){
            /**************************** POSITION IS FULLY CLOSED OUT ***********************/
            profitloss = (closeDateDataArray[closedIndex][2] * closeDateDataArray[closedIndex][3]) - (openDateDataArray[i][2] * openDateDataArray[i][3])
            openDateDataArray[i][5] += "\n" + closeDateDataArray[closedIndex][5]
  
            closeResultArray.push([openDateDataArray[i][1].toString().toUpperCase(), openDateDataArray[i][2], openDateDataArray[i][3], closeDateDataArray[closedIndex][2], openDateDataArray[i][4], closeDateDataArray[closedIndex][4], "CLOSED", profitloss, openDateDataArray[i][5] ])
  
            // Remove the items from the close Date Data array and other arrays pertinent to position.
            closeDateDataArray.splice(closedIndex, 1)
          }
          else if(updateShares > 0){
            /**************************** POSITION IS NOT FULLY CLOSED OUT ***********************/
            profitloss = (closeDateDataArray[closedIndex][2] * closeDateDataArray[closedIndex][3]) - (openDateDataArray[i][2] * closeDateDataArray[closedIndex][3])
            openDateDataArray[i][5] += "\n" + closeDateDataArray[closedIndex][5]
  
            partialCloseResultArray.push([openDateDataArray[i][1].toString().toUpperCase(), openDateDataArray[i][2], openDateDataArray[i][3], closeDateDataArray[closedIndex][2], openDateDataArray[i][4], closeDateDataArray[closedIndex][4], "CLOSED", profitloss, openDateDataArray[i][5] ])
  
            // Remove the items from the close Date Data array and other arrays pertinent to position.
            closeDateDataArray.splice(closedIndex, 1)
            
            // Set the index for less than 1 to ensure it re-searches the array for other closes.
            i = i - 1
          }
        }
        else{
          
          // Symbol was not found in closed positions.  Operate as normal.
          var marketValue = openDateDataArray[i][2] * openDateDataArray[i][3] 
  
          openResultArray.push([openDateDataArray[i][1].toString().toUpperCase(), openDateDataArray[i][2].toString(), openDateDataArray[i][3].toString(), "-", openDateDataArray[i][4], "-", marketValue, "-", openDateDataArray[i][5].toString() ])
        }
      }
      else{
        // Either the trader is not the right trader or the open date is not before the begin date.
      }
    }
  
    // Set the items into the result array to return.  Set them to be based on the toggle to return the way the user wants them.
    if(sortby == "Open"){
      resultArray = openResultArray.concat(partialCloseResultArray)
      resultArray = resultArray.concat(closeResultArray)
    }
    else if(sortby == "Closed"){
      resultArray = closeResultArray.concat(partialCloseResultArray)
      resultArray = resultArray.concat(openResultArray)
    }
    else if(sortby == "Partial-Closed"){
      resultArray = partialCloseResultArray.concat(closeResultArray)
      resultArray = resultArray.concat(openResultArray)
    }
  
    return resultArray
  }
  
  
  