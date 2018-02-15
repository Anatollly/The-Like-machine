import parse from 'url-parse';
import LmControllerView from './lmControllerView';
import SwitchController from './switchController';

const profileData = {
  counter: {
    likeTotal: 2500,
    likeToday: 303
  },
  maxLikes: 88,
  viewElementSwitch: 'true',
  version: 'free',
  scrollSpeed: 800,
  scrollType: 'out-expo',
  likeDelay: 500,
  scrollToUnlike: 'true',
  dblclickInterval: 300,
  currentPhotoColor: 'rgba(128,128,0,0.3)',
  viewElementColor: 'rgba(192,192,192,0.3)',
  viewElementPosition: 'right:50px;top:50px;',
  pageZoom: 0.75,
  language: 'russian'
};

const controller = new SwitchController(profileData);
const lmControllerView = new LmControllerView(controller);

const handUrl = (url, controller) => {
  const href = parse(url, true).pathname.match(/^\/([^\/]*).*$/);
  const postName = href[0];
  const path = href[1];
  switch (path) {
    case '':
      controller.onSwitchHavey();
      break;
    case 'p':
      controller.onSwitchExplorer(postName);
      break;
    case 'explore':
      controller.onSwitchOff();
      break;
    default:
      controller.onSwitchOff();
  }
};

const handClick = (click, controller) => {
  switch (click) {
    case 'start':
      controller.startLM();
      break;
    case 'pause':
      controller.pauseLM();
      break;
    case 'stop':
      controller.stopLM();
      break;
    default:
      console.log('click: ', click);
  }
};

const handMaxLikes = (maxLikes, model) => {
  model.maxLikes = maxLikes;
};

const handViewElementSwitch = (toogle, model) => {
  model.viewElementSwitch = toogle;
}

window.onload = () => {
  window.scrollTo(0, 0);
  lmControllerView.addElement();
  controller.model.setInitState();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('content message: ', message);
    const {
      onload,
      click,
      url,
      maxLikes,
      machineSwitch,
      popupInitState,
      popupChangeState,
      popupResetState,
      viewElementSwitch
    } = message;

    if (url) handUrl(url, controller);
    if (click) handClick(click, controller.controller);
    if (maxLikes) handMaxLikes(maxLikes, controller.model);
    if (popupInitState) controller.model.setInitPopupState();
    if (popupChangeState) controller.model.setPopupState(popupChangeState);
    if (popupResetState) controller.model.resetSettings();
    if (viewElementSwitch) handViewElementSwitch(viewElementSwitch, controller.model);

    if (url) console.log('current controller: ', controller.controller);
  });
  chrome.runtime.sendMessage({ status: 'onload' });
};
