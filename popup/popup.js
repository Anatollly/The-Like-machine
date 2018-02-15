import AbstractSelectElementView from './abstractSelectElementView';
import AbstractInputElementView from './abstractInputElementView';
import { settigsDataSelect, settigsDataInput, initProfileData, translator, languageMap } from './data';

// onClick icon
chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {click: "icon", url: tabs[0].url}, () => {
      console.log('click icon');
    });
  });
});

const sendMessageToContent = (data) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    // data.url = tabs[0].url;
    chrome.tabs.sendMessage(tabs[0].id, data);
  });
}

const getSettingsElements = (state) => {
  const elements = {};
  Object.keys(state).forEach((item, i) => {
    if (settigsDataSelect.hasOwnProperty(item)) {
      elements[item] = new AbstractSelectElementView(settigsDataSelect[item]);
    }
    if (settigsDataInput.hasOwnProperty(item)) {
      elements[item] = new AbstractInputElementView(settigsDataInput[item]);
    }
  })
  return elements;
}

const showSettingsElements = (element, elements, state) => {
  element.innerHTML = '';
  Object.keys(elements).forEach((item, i) => {
    element.appendChild(elements[item].getElement(state.language, state[item]));
  })
}

const saveSettings = (elements, state) => {
  Object.keys(state).forEach((item, i) => {
    if (settigsDataSelect.hasOwnProperty(item)) {
       state[item] = elements[item].value;
    }
    if (settigsDataInput.hasOwnProperty(item)) {
       state[item] = elements[item].value;
    }
  })
  return state;
}

const changeElementLang = (elements, language) => {
  const lang = languageMap[language];
  Object.keys(elements).forEach((item) => {
    elements[item].innerHTML = translator[item][lang];
  })
}

window.onload = () => {
  const popupData = {};
  const settingsBlock = document.querySelector('.settings-element');
  const btnGroupMain = document.querySelector('.lm--btn-main');
  const btnGroupAdd = document.querySelector('.lm--btn-add');
  const save = document.querySelector('.lm--button-save');
  const cancel = document.querySelector('.lm--button-cancel');
  const reset = document.querySelector('.lm--button-reset');
  const settings = document.querySelector('.lm--tab-sattings');
  const manual = document.querySelector('.lm--tab-manual');
  const additionally = document.querySelector('.lm--tab-additionally');
  const start = btnGroupMain.querySelector('.lm--button-start');
  const pause = btnGroupMain.querySelector('.lm--button-pause');
  const stop = btnGroupMain.querySelector('.lm--button-stop');

  // listening incoming messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message: ', message);
    const { profileState } = message;
    if (profileState) {
      popupData['profileData'] = profileState;
      popupData['settingsElement'] = getSettingsElements(profileState);
      changeElementLang({ save, cancel, reset, settings, manual, additionally}, profileState.language);
      showSettingsElements(settingsBlock, popupData.settingsElement, profileState);
    }
  });

  save.addEventListener('click', () => {
    const { profileData, settingsElement } = popupData;
    sendMessageToContent({ popupChangeState: saveSettings(settingsElement, profileData) });
  })

  cancel.addEventListener('click', () => {
    sendMessageToContent({ popupChangeState: popupData.profileData });
  })

  reset.addEventListener('click', () => {
    sendMessageToContent({ popupResetState: true });
  })

  // listening click elements
  btnGroupMain.addEventListener('click', (e) => {
    if (e.target === start) sendMessageToContent({click: 'start'});
    if (e.target === pause) sendMessageToContent({click: 'pause'});
    if (e.target === stop) sendMessageToContent({click: 'stop'});
  })

  // listening input elements
  // maxLikesInput.addEventListener('input', (e) => {
  //   profileData.maxLikes = maxLikesInput.value * 1;
  //   sendMessageToContent({ popupChangeState: profileData });
  // });

  // request initial state
  sendMessageToContent({ popupInitState: true });
};
