(function(){

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
        renderStatus(returnUrl);
        chrome.tabs.getSelected(null, function(tab) {
          var code = 'window.location.reload();';
          chrome.tabs.executeScript(tab.id, {code: code});
          window.close();
        });
    });
  }

  var invokeDeviceSwitch = function(deviceToSwitchTo, callback){

      var url = deviceToSwitchTo;

      var x = new XMLHttpRequest();
      x.open('GET', url);
      x.responseType = 'json';
      x.onreadystatechange = function()
      {
          if (x.readyState == 4 && x.status == 200)
          {
            callback();
          }
      }
      x.onerror = function() {
        renderStatus('Network error.');
      };
      x.send();
  }

})();
