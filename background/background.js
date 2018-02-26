let data = {
  onload: false,
  click: '',
  url: ''
};

chrome.webRequest.onCompleted.addListener(function(responseHeaders) {
  const statusCode = responseHeaders.statusCode;
  if(statusCode >= 400 && statusCode < 500) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      if (statusCode === 400) {
        chrome.tabs.sendMessage(tabs[0].id, { error400: true }, () => {});
      } else {
        chrome.tabs.sendMessage(tabs[0].id, { error: true }, () => {});
      }
    });
  }
}, {urls: ["<all_urls>"]},
        ["responseHeaders"]);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      data.url = changeInfo.url;
      chrome.tabs.sendMessage(tabs[0].id, data, () => {});
    });
  }
});

chrome.browserAction.setTitle({title: 'The Like-machine'});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { status, pageZoom, unlimited } = message;
  if (status === 'onload') {
    data.onload = true;
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      data.url = tabs[0].url;
      !(/^http.?:\/\/www\.instagram\.com\/.*$/).test(data.url) && chrome.tabs.setZoom(1);
      chrome.tabs.sendMessage(tabs[0].id, data, () => {});
    });
  }
  if (pageZoom) chrome.tabs.setZoom(pageZoom);
  if (unlimited) chrome.browserAction.setBadgeText({text: unlimited });
});
