import SelectElementView from './selectElementView';
import InputElementView from './inputElementView';
import favoritesElement from './favoritesLinkView'
import { settigsDataSelect, settigsDataInput, initProfileData, translator, languageMap } from './data';

// onClick icon
chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {click: "icon", url: tabs[0].url}, () => {
    });
  });
});

const sendMessageToContent = (data) => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, data);
  });
};

const getSettingsElements = (state) => {
  const elements = {};
  Object.keys(state).forEach((item, i) => {
    if (settigsDataSelect.hasOwnProperty(item)) {
      elements[item] = new SelectElementView(settigsDataSelect[item]);
    }
    if (settigsDataInput.hasOwnProperty(item)) {
      elements[item] = new InputElementView(settigsDataInput[item]);
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

const setInfoText = (element, text) => {
  element.innerHTML = text;
}

window.onload = () => {
  const popupData = {};
  const hiddenLayer = document.querySelector('.hidden-layer');
  const settingsTab = document.querySelector('.settings-element');
  const btnGroupMain = document.querySelector('.lm--btn-main');
  const btnGroupAdd = document.querySelector('.lm--btn-add');
  const save = document.querySelector('.lm--button-save');
  const cancel = document.querySelector('.lm--button-cancel');
  const reset = document.querySelector('.lm--button-reset');
  const settings = document.querySelector('.lm--tab-settings');
  const favorites = document.querySelector('.lm--tab-favorites');
  const manual = document.querySelector('.lm--tab-manual');
  // const additionally = document.querySelector('.lm--tab-additionally');
  const startBtn = btnGroupMain.querySelector('.lm--button-start');
  const pauseBtn = btnGroupMain.querySelector('.lm--button-pause');
  const stopBtn = btnGroupMain.querySelector('.lm--button-stop');
  const onBtn = btnGroupAdd.querySelector('.lm--button-on');
  const topBtn = btnGroupAdd.querySelector('.lm--button-top');
  const downloadBtn = btnGroupAdd.querySelector('.lm--button-download');
  const saveTagBtn = btnGroupAdd.querySelector('.lm--button-saveTag');
  // const zeroCounterBtn = btnGroupAdd.querySelector('.lm--button-zeroCounter');
  const favoritesTab = document.querySelector('.favorites-element');
  const infoText = document.querySelector('.info-text');

  // listening incoming messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { settingsState, favoritesState, error403, LMOn } = message;
    if (settingsState) {
      popupData['settingsData'] = settingsState;
      popupData['settingsElement'] = getSettingsElements(settingsState);
      changeElementLang({ save, cancel, reset, settings, favorites, manual,
        // additionally
      }, settingsState.language);
      showSettingsElements(settingsTab, popupData.settingsElement, settingsState);
    }
    if (favoritesState) showTags(favoritesState, favoritesTab);
    if (error403) {
      infoText.innerHTML = 'Too much activity';
    } else {
      infoText.innerHTML = '';
    }
    if (LMOn === false) {
      hiddenLayer.style = 'bottom: 0;'
      onBtn.innerHTML = 'On';
    }
    if (LMOn === true) {
      hiddenLayer.style = 'bottom: 100%;';
      onBtn.innerHTML = 'Off';
    }
  });

  save.addEventListener('click', () => {
    const { settingsData, settingsElement } = popupData;
    sendMessageToContent({ popupChangeSettings: getSettingsValue(settingsElement, settingsData) });
  })

  cancel.addEventListener('click', () => {
    sendMessageToContent({ popupChangeSettings: popupData.settingsState });
  })

  reset.addEventListener('click', () => {
    sendMessageToContent({ popupResetSettings: true });
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
    if (e.target === zeroCounterBtn) sendMessageToContent({click: 'zeroCounter'});
  })

  // request initial state
  sendMessageToContent({ popupInitState: true });
};
