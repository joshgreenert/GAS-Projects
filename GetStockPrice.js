/*
 * Created by Joshua Greenert on 7/7/2021
 * 
 * This function will provide the user with the stock price of their symbol.
 * However, since there is no valid API that works with Google sheets,this is
 * more of a data scrape.  Update the indexes as needed.
 */

function getStockPrice(symbol) {

    if(symbol == "DOGE" ){
      var url = "https://finance.yahoo.com/quote/" + symbol + "?p=" +symbol+ "&.tsrc=fin-srch"
      var response = UrlFetchApp.fetch(url)
      var obj = response.getContentText()
      var json = JSON.stringify(obj)
  
      // get index of Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)
      var classindex = json.indexOf("data-col2 Ta(end) Pstart(20px) Pend(15px)")
      var newobj = String(json.substring(classindex, classindex + 150))
  
      var priceIndexStart = newobj.indexOf('>')+1
      var priceIndexEnd = newobj.indexOf('<')
      var price = newobj.substring(priceIndexStart, priceIndexEnd)
    }
    else if(symbol == ""){
      // Do nothing because there is no data to display.
    }
    else{
      var url = "https://finance.yahoo.com/quote/" + symbol + "?p=" +symbol+ "&.tsrc=fin-srch"
      var response = UrlFetchApp.fetch(url)
      var obj = response.getContentText()
      var json = JSON.stringify(obj)
  
      // get index of Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)
      var classindex = json.indexOf("Trsdu(0.3s) Fw(b) Fz(36px) Mb(-4px) D(ib)")
      var newobj = String(json.substring(classindex, classindex + 150))
  
      var priceIndexStart = newobj.indexOf('>')+1
      var priceIndexEnd = newobj.indexOf('<')
      var price = newobj.substring(priceIndexStart, priceIndexEnd)
    }
  
    return price
  }
  