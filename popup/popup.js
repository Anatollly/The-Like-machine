const data = {
  click: '',
  url: ''
};

let profileData = {};

const sendMessageToContent = (data) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    // data.url = tabs[0].url;
    chrome.tabs.sendMessage(tabs[0].id, data);
  });
}

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

  // request initial state
  sendMessageToContent({ popupInitState: true });


  // listening incoming messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { profileState } = message;
    if (profileState) {
      const {
        counter: {
          likeTotal,
          likeToday
        },
        maxLikes,
        viewElementSwitch,
        version,
        scrollSpeed,
        scrollType,
        likeDelay,
        scrollToUnlike,
        dblclickInterval,
        currentPhotoColor,
        viewElementColor,
        viewElementPosition,
        zoomPage
      } = profileState;

      profileData = {
        counter: {
          likeTotal,
          likeToday
        },
        maxLikes,
        viewElementSwitch,
        version,
        scrollSpeed,
        scrollType,
        likeDelay,
        scrollToUnlike,
        dblclickInterval,
        currentPhotoColor,
        viewElementColor,
        viewElementPosition,
        zoomPage
      };
      maxLikesInput.value = profileData.maxLikes;
    }
  });

  // listening click elements
  form.addEventListener('click', (e) => {
    if (e.target === start) sendMessageToContent({click: 'start'});
    if (e.target === pause) sendMessageToContent({click: 'pause'});
    if (e.target === stop) sendMessageToContent({click: 'stop'});
  })

  // listening input elements
  maxLikesInput.addEventListener('input', (e) => {
    profileData.maxLikes = maxLikesInput.value * 1;
    sendMessageToContent({ popupChangeState: profileData });
  });
};
