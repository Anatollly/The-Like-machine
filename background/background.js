let data = {
  onload: false,
  click: '',
  url: ''
};

// change url
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
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
  console.log('onMessage: ', message);
  const { status, pageZoom } = message;
  if (status === 'onload') {
    data.onload = true;
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      data.url = tabs[0].url;
      chrome.tabs.sendMessage(tabs[0].id, data, () => {});
    });
  }
  if (pageZoom) chrome.tabs.setZoom(pageZoom);
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
