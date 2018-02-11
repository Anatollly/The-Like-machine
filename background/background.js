let data = {
  onload: false,
  click: '',
  url: '',
  maxLikes: 99,
  machineSwitch: false,
  counter: {
    likeTotal: 0,
    likeToday: 0,
    saveAll: 0,
    saveToday: 0
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('onUpdated: ', changeInfo.url);
  if (changeInfo.url) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      data.url = changeInfo.url;
      chrome.tabs.sendMessage(tabs[0].id, data, () => {});
    });
  }
});

// const setBadgeText = (text) => {
//   chrome.browserAction.setBadgeText({text});
// };
// data.machineSwitch ? setBadgeText('on') : setBadgeText('off');
chrome.browserAction.setTitle({title: 'The Like-machine'});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('onMessage: ', message, sender, sendResponse);
  if (message.status === 'onload') {
    data.onload = true;
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      data.url = tabs[0].url;
      chrome.tabs.sendMessage(tabs[0].id, data, () => {});
    });
  }
});

chrome.browserAction.setBadgeText({text: 'LM'});

// chrome.browserAction.onClicked.addListener((tab) => {
//   chrome.tabs.query({active: true, currentWindow: true}, tabs => {
//     data.firstLoad = false;
//     data.click = 'icon';
//     data.url = tabs[0].url;
//     data.machineSwitch = !data.machineSwitch;
//     data.machineSwitch ? setBadgeText('on') : setBadgeText('off');
//     chrome.tabs.sendMessage(tabs[0].id, data, () => {});
//   });
// });
