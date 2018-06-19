import SelectElementView from './selectElementView';
import InputElementView from './inputElementView';
import favoritesElement from './favoritesLinkView';
import manualContent from './manualContent';
import additionallyContent from './additionallyContent';
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
  const { nodeName, dataset } = e.target;
  if (nodeName === 'A') {
    if (dataset.type === 'link') sendMessageToContent({ link: dataset.link });
    if (dataset.type === 'delete') sendMessageToContent({ deleteTag: { type: dataset.tab, name: dataset.item} });
  }
};

const showTags = (state, parentElement) => {
  const tabs = parentElement.querySelectorAll('div.tab-pane.fade');
  let tabIndex = 0;
  if (tabs.length > 0) {
    tabs.forEach((item, i) => {
      if (item.classList.value === 'tab-pane fade active show') tabIndex = i;
    })
  }
  parentElement.innerHTML = '';
  const dataCheckBoxesStorage = localStorage.getItem('dataCheckBoxes');
  const dataCheckBoxes = dataCheckBoxesStorage && dataCheckBoxesStorage.split(',');
  const spanElement = favoritesElement(state, tabIndex, dataCheckBoxes);
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
  const onBtn = btnGroupMain.querySelector('.lm--button-on');
  const topBtn = btnGroupMain.querySelector('.lm--button-top');
  const downloadBtn = btnGroupMain.querySelector('.lm--button-download');
  const saveTagBtn = btnGroupMain.querySelector('.lm--button-saveTag');
  const startFavoritesBtn = document.querySelector('.lm--button-startFavorite');
  const favoritesTab = document.querySelector('.favorites-element');
  const infoMessageText = document.querySelector('.info-message');
  const manualTab = document.querySelector('#manual');
  const additionallyTab = document.querySelector('#additionally');

  // listening incoming messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { settingsState, favoritesState, LMOn, infoMessage } = message;
    if (settingsState) {
      popupData['settingsData'] = settingsState;
      popupData['settingsElement'] = getSettingsElements(settingsState);
      changeElementLang({ save, cancel, reset, settings, favorites, manual, additionally }, settingsState.language);
      manualTab.innerHTML = manualContent[settingsState.language];
      additionallyTab.innerHTML = additionallyContent[settingsState.language];
      showSettingsElements(settingsTab, popupData.settingsElement, settingsState);
      const fullVersion = document.querySelector('.full-version');
      fullVersion && fullVersion.addEventListener('click', () => {
        sendMessageToContent({click: 'fullVersion'});
      })
    }
    if (favoritesState) showTags(favoritesState, favoritesTab);
    if (infoMessage) infoMessageText.innerHTML = infoMessage;
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
    sendMessageToContent({ popupChangeSettings: getSettingsValue(settingsElement, settingsData), saveSettings: true });
  })

  cancel.addEventListener('click', () => {
    sendMessageToContent({ popupChangeSettings: popupData.settingsData, cancelSettings: true });
  })

  reset.addEventListener('click', () => {
    sendMessageToContent({ popupResetSettings: true });
  })

  favoritesTab.addEventListener('click', (e) => {
    if (e.target.nodeName === 'INPUT') {
      const checkBoxesValues = favoritesTab.querySelectorAll('.form-check-input');
      const dataCheckBoxes = [];
      checkBoxesValues.forEach((item, i) => {
        if (item.checked) dataCheckBoxes.push(item.value);
      });
      localStorage.setItem('dataCheckBoxes', dataCheckBoxes);
    };
  })

  startFavoritesBtn.addEventListener('click', (e) => {
    const dataCheckBoxesStorage = localStorage.getItem('dataCheckBoxes');
    const dataCheckBoxes = dataCheckBoxesStorage && dataCheckBoxesStorage.split(',');
    sendMessageToContent({favoritesLinks: dataCheckBoxes});
  })

  btnGroupMain.addEventListener('click', (e) => {
    if (e.target === onBtn) sendMessageToContent({click: 'on'});
    if (e.target === topBtn) sendMessageToContent({click: 'top'});
    if (e.target === startBtn) sendMessageToContent({click: 'start'});
    if (e.target === pauseBtn) sendMessageToContent({click: 'pause'});
    if (e.target === stopBtn) sendMessageToContent({click: 'stop'});
    if (e.target === downloadBtn) sendMessageToContent({click: 'download'});
    if (e.target === saveTagBtn) sendMessageToContent({click: 'saveTag'});
  })

  // request initial state
  sendMessageToContent({ popupInitState: true });
};
