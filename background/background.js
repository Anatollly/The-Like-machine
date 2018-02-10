let data = {
  firstLoad: false,
  click: '',
  url: '',
  maxLikes: 60,
  machineSwitch: false
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      data.url = changeInfo.url;
      chrome.tabs.sendMessage(tabs[0].id, data, () => {});
    });
  }
});

const setBadgeText = (text) => {
  chrome.browserAction.setBadgeText({text});
};
data.machineSwitch ? setBadgeText('on') : setBadgeText('off');
chrome.browserAction.setTitle({title: 'The Like-machine'});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.status === 'onload') {
    data.firstLoad = true;
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      data.url = tabs[0].url;
      chrome.tabs.sendMessage(tabs[0].id, data, () => {});
    });
  }
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    data.firstLoad = false;
    data.click = 'icon';
    data.url = tabs[0].url;
    data.machineSwitch = !data.machineSwitch;
    data.machineSwitch ? setBadgeText('on') : setBadgeText('off');
    chrome.tabs.sendMessage(tabs[0].id, data, () => {});
  });
});
