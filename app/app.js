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

  var switchDevice = function(deviceToSwitchTo, url){

    var baseDomain = getBaseDomainFromUrl(url);


    invokeDeviceSwitch(baseDomain, deviceToSwitchTo, function(){
        chrome.tabs.getSelected(null, function(tab) {
          var code = 'window.location.reload();';
          chrome.tabs.executeScript(tab.id, {code: code});
          window.close();
        });
    });
  }

  var getBaseDomainFromUrl = function(url){
    var domain;
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    return domain;
  }

  var invokeDeviceSwitch = function(baseDomain, deviceToSwitchTo, callback){

      var url = "http://" + baseDomain + "/changedevice/" + deviceToSwitchTo;

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
