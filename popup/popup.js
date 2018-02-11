let data = {
  click: '',
  url: '',
  maxLikes: 0
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('onMessage: ', message, sender, sendResponse);
});

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {click: "icon", url: tabs[0].url}, () => {
      console.log('click icon');
    });
  });
});

window.onload = () => {

  const maxLikesInput = document.querySelector('#max-likes');
  const form = document.querySelector('form');
  const start = document.querySelector('#start');
  const pause = document.querySelector('#pause');
  const stop = document.querySelector('#stop');

  const sendMessageToContent = (data) => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      // data.url = tabs[0].url;
      chrome.tabs.sendMessage(tabs[0].id, data);
    });
  }

  form.addEventListener('click', (e) => {
    if (e.target === start) data.click = 'start';
    if (e.target === pause) data.click = 'pause';
    if (e.target === stop) data.click = 'stop';
    sendMessageToContent(data);
  })

  maxLikesInput.addEventListener('input', (e) => {
    data.maxLikes = maxLikesInput.value;
    sendMessageToContent(data);
  });
};
