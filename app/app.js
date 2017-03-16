function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };
  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {

  document.getElementById("d").addEventListener("click", function(){
    getCurrentTabUrl(function(url) {
      switchDevice("desktop", url);
      return;
    });
  });

  document.getElementById("m").addEventListener("click", function(){
    getCurrentTabUrl(function(url) {
      switchDevice("mobile", url);
      return;
    });
  });

});

var switchDevice = function(deviceToSwitchTo, returnUrl){
  invokeDeviceSwitch(deviceToSwitchTo, function(){

    chrome.runtime.sendMessage({redirect: returnUrl});
  });
}

var invokeDeviceSwitch = function(deviceToSwitchTo, callback){

    var url = deviceToSwitchTo;

    var x = new XMLHttpRequest();
    x.open('GET', url);
    x.responseType = 'json';
    x.onload = function() {
      var response = x.response;
      if (!response || !response.responseData || !response.responseData.results ||
          response.responseData.results.length === 0) {
        errorCallback('No response from server for switch!');
        return;
      }
      renderStatus("testing");
      callback();
    };
    x.onerror = function() {
      errorCallback('Network error.');
    };
    x.send();
}
