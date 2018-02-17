import AbstractSelectElementView from './abstractSelectElementView';
import AbstractInputElementView from './abstractInputElementView';
import favoritesElement from './abstractFavoritesLinkView'
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
    console.log('send message: ', data);
    chrome.tabs.sendMessage(tabs[0].id, data);
  });
};

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
};

const showSettingsElements = (element, elements, state) => {
  element.innerHTML = '';
  Object.keys(elements).forEach((item, i) => {
    element.appendChild(elements[item].getElement(state.language, state[item]));
  })
};

const getSettingsValue = (elements, state) => {
  Object.keys(state).forEach((item, i) => {
    const elementItem = elements[item];
    if (elementItem) {
      let value = elements[item].value;
      if (typeof state[item] === 'number') value *= 1;
      if (typeof state[item] === 'boolean') value = value === 'true';
      if (settigsDataSelect.hasOwnProperty(item)) state[item] = value;
      if (settigsDataInput.hasOwnProperty(item)) state[item] = value;
    }
  })
  return state;
};

const onFavoritesElement = (e) => {
  const { nodeName, dataset, href } = e.target;
  if (nodeName === 'A') {
    if (dataset.type === 'link') sendMessageToContent({ link: href });
    if (dataset.type === 'delete') sendMessageToContent({ deleteTag: { type: dataset.tab, name: dataset.item} });
  }
};

const showTags = (state, parentElement) => {
  const tabs = parentElement.querySelectorAll('div');
  let tabIndex = 0;
  if (tabs.length > 0) {
    tabs.forEach((item, i) => {
      if (item.classList.value === 'tab-pane fade active show') tabIndex = i;
    })
  }
  parentElement.innerHTML = '';
  const spanElement = favoritesElement(state, tabIndex);
  spanElement.addEventListener('click', onFavoritesElement)
  spanElement.classList.add('tab-content');
  parentElement.appendChild(spanElement);
};

const changeElementLang = (elements, language) => {
  const lang = languageMap[language];
  Object.keys(elements).forEach((item) => {
    elements[item].innerHTML = translator[item][lang];
  })
}

window.onload = () => {
  const popupData = {};
  const settingsTab = document.querySelector('.settings-element');
  const btnGroupMain = document.querySelector('.lm--btn-main');
  const btnGroupAdd = document.querySelector('.lm--btn-add');
  const save = document.querySelector('.lm--button-save');
  const cancel = document.querySelector('.lm--button-cancel');
  const reset = document.querySelector('.lm--button-reset');
  const settings = document.querySelector('.lm--tab-settings');
  const favorites = document.querySelector('.lm--tab-favorites');
  const manual = document.querySelector('.lm--tab-manual');
  const additionally = document.querySelector('.lm--tab-additionally');
  const startBtn = btnGroupMain.querySelector('.lm--button-start');
  const pauseBtn = btnGroupMain.querySelector('.lm--button-pause');
  const stopBtn = btnGroupMain.querySelector('.lm--button-stop');
  const onBtn = btnGroupAdd.querySelector('.lm--button-on');
  const topBtn = btnGroupAdd.querySelector('.lm--button-top');
  const downloadBtn = btnGroupAdd.querySelector('.lm--button-download');
  const saveTagBtn = btnGroupAdd.querySelector('.lm--button-saveTag');
  const favoritesTab = document.querySelector('.favorites-element');

  // listening incoming messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message: ', message);
    const { profileState, favoritesState } = message;
    if (profileState) {
      popupData['profileData'] = profileState;
      popupData['settingsElement'] = getSettingsElements(profileState);
      changeElementLang({ save, cancel, reset, settings, favorites, manual, additionally}, profileState.language);
      showSettingsElements(settingsTab, popupData.settingsElement, profileState);
    }
    if (favoritesState) showTags(favoritesState, favoritesTab);
  });

  save.addEventListener('click', () => {
    const { profileData, settingsElement } = popupData;
    sendMessageToContent({ popupChangeState: getSettingsValue(settingsElement, profileData) });
  })

  cancel.addEventListener('click', () => {
    sendMessageToContent({ popupChangeState: popupData.profileData });
  })

  reset.addEventListener('click', () => {
    sendMessageToContent({ popupResetState: true });
  })

  // listening click elements
  btnGroupMain.addEventListener('click', (e) => {
    if (e.target === startBtn) sendMessageToContent({click: 'start'});
    if (e.target === pauseBtn) sendMessageToContent({click: 'pause'});
    if (e.target === stopBtn) sendMessageToContent({click: 'stop'});
  })

  btnGroupAdd.addEventListener('click', (e) => {
    if (e.target === onBtn) sendMessageToContent({click: 'on'});
    if (e.target === topBtn) sendMessageToContent({click: 'top'});
    if (e.target === downloadBtn) sendMessageToContent({click: 'download'});
    if (e.target === saveTagBtn) sendMessageToContent({click: 'saveTag'});
  })

  // listening input elements
  // maxLikesInput.addEventListener('input', (e) => {
  //   profileData.maxLikes = maxLikesInput.value * 1;
  //   sendMessageToContent({ popupChangeState: profileData });
  // });

  // request initial state
  sendMessageToContent({ popupInitState: true });
};
