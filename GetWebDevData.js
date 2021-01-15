/***************************************************************************
 * Created by Joshua Greenert on 7/30/2020                                 *
 ***************************************************************************
 *                                            DESCRIPTION
 * This script will run to open a webpage, input the URL of the site, press the enter key
 * and get the results from the search to store in each respective area.  Found that the audit on
 * the site must be ran in order for it to register.
 **************************************************************************************************
 *                                             PARAMETERS 
 * URL - The URL of the website to update the content for.
 **************************************************************************************************
 */
function getWebDevData(userurl) {
  
  // Set the URL object for testing
  var urlAddress = userurl
  
  var array = []
  
  // Set the URL to fetch and fetch it.  Then parse the JSON object and set it as a string.
  var url = 'https:\/\/lighthouse-dot-webdotdevsite.appspot.com\/\/lh\/reports?url=' +urlAddress;
  var response = UrlFetchApp.fetch(url);
  
  var obj = JSON.parse(response.getContentText())
  var str = JSON.stringify(obj, ['lhrSlim', 'score'])
  
  // cycle through the string and add the scores to the array.
  for(var i = 0; i < 4; i++){
    
    if(str.indexOf("score") != -1){
      var testscore = str.substring(str.indexOf("score\":")+7, str.indexOf("}"))
      
      // check if score == 1, set to 100
      if(testscore == 1){
        testscore = 100.0
      }
      else{
        testscore = testscore * 100;
      }
      
      // Add the reference and update the string.
      array.push(testscore)
      str = str.substring(str.indexOf("}")+1, str.length)
    }
  }
  
  //Now put the data in the sheet
  return array
}