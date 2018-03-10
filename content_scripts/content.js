import parse from 'url-parse';
import LmControllerView from './lmControllerView';
import SwitchController from './switchController';
import { checkAccounts } from './firebase';
import storage from './storage';

const setLocationsAndTags = (path, controller) => {
  const currentTag = {};
  const typeTag = path.match(/^\/[^\/]*\/([^\/]*)\/.*$/);
  if (typeTag && typeTag[1] === 'locations') {
    const location = path.match(/^\/explore\/locations\/.*\/([^\/]*)\/$/);
    currentTag.type = 'locations';
    if (location[1]) currentTag.name = location[1];
    if (location[0]) currentTag.link = location[0];
  }
  if (typeTag && typeTag[1] === 'tags') {
    currentTag.type = 'tags';
    const tag = path.match(/^\/explore\/tags\/([^\/]*)\/$/);
    if (tag[1]) currentTag.name = tag[1];
    if (tag[0]) currentTag.link = tag[0];
  }
  controller.model.currentTag = currentTag;
}

const setAccount = (path, controller) => {
  const currentTag = {};
  const account = path.match(/^\/([^\/]*)\/$/);
  if (account && account[0]) {
    controller.onSwitchExplore();
    currentTag.type = 'accounts';
    if (account[1]) currentTag.name = account[1];
    if (account[0]) currentTag.link = account[0];
    controller.model.currentTag = currentTag;
  } else {
    controller.model.currentTag = { type: '', name: '', link: '' };
  }
}


const handUrl = (url, controller) => {
  if ((/^https:\/\/www\.instagram\.com.*$/).test(url)) {
    const href = parse(url, true).pathname.match(/^\/([^\/]*).*$/);
    const postName = href[0];
    const path = href[1];
    const { currentLink, playFavorites } = storage.state;
    switch (path) {
      case '':
        controller.onSwitchHavey();
        controller.model.currentTag = { type: 'photos', name: '', link: '' };
        break;
      case 'p':
        controller.onSwitchPhoto(postName);
        controller.model.currentTag = { type: 'photos', name: '', link: postName };
        break;
      case 'explore':
        setLocationsAndTags(postName, controller);
        controller.onSwitchExplore();
        if (postName === currentLink && playFavorites) {
          storage.currentLink = '';
          controller.controller.startLM();
        }
        break;
      default:
        controller.onSwitchOff();
        setAccount(postName, controller);
    }
  }
};

const handClick = (click, controller, model) => {
  controller && controller.model.errorOff();
  controller && controller.model.error400Off();
  switch (click) {
    case 'start':
      controller && controller.startLM();
      break;
    case 'pause':
      controller && controller.pauseLM();
      break;
    case 'stop':
      controller && controller.stopLM();
      storage.resetStorage();
      break;
    case 'on':
      if (model.state.LMOn) {
        model.switchOffLM();
      } else {
        model.switchOnLM();
        location.reload();
      }
      break;
    case 'top':
      controller && window.scrollTo(0, 0);
      break;
    case 'download':
      controller && controller.model.saveImage();
      break;
    case 'saveTag':
      controller && model.saveFavorites();
      break;
    case 'fullVersion':
      model.openFullVersion();
      break;
    default:
  }
};

const handMaxLikes = (maxLikes, model) => {
  model.maxLikes = maxLikes;
};

const handViewElementSwitch = (toogle, model) => {
  model.viewElementSwitch = toogle;
};

const getProfile = () => {
  try {
    const navProfile = document.querySelector('.coreSpriteDesktopNavProfile');
    const navProfileHref = navProfile && navProfile.href;
    const linkProfile = document.querySelector('#link_profile a');
    const linkProfileHref = linkProfile && linkProfile.href;
    const profile = navProfileHref || linkProfileHref;
    return profile.match(/^https:\/\/www.instagram.com\/([^\/]*)\/$/)[1].replace(/[.,#$\/\[\]]/g, '&dot');
  } catch (e) {
  }
}

const loadAccountData = (data, globalData, account) => {
  const controller = new SwitchController(data, globalData, account);
  const lmControllerView = new LmControllerView(controller);

  lmControllerView.addElement();
  controller.model.setInitState();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const {
      onload,
      click,
      url,
      maxLikes,
      machineSwitch,
      popupInitState,
      popupChangeSettings,
      saveSettings,
      cancelSettings,
      popupResetSettings,
      viewElementSwitch,
      link,
      deleteTag,
      error,
      error400,
      favoritesLinks
    } = message;


    if (url) handUrl(url, controller);
    if (click) handClick(click, controller.controller, controller.model);
    if (maxLikes) handMaxLikes(maxLikes, controller.model);
    if (popupInitState) controller.model.setInitPopupState();
    if (popupChangeSettings) controller.model.setPopupSettings(popupChangeSettings);
    if (saveSettings) controller.model.infoMessage = 'Save settings';
    if (cancelSettings) controller.model.infoMessage = 'Cancel settings';
    if (popupResetSettings) controller.model.resetPopupSettings();
    if (viewElementSwitch) handViewElementSwitch(viewElementSwitch, controller.model);
    if (link) controller.model.clickInstagramLink(link);
    if (deleteTag) controller.model.delFavoriteTag(deleteTag.type, deleteTag.name);
    if (error) controller.model.errorOn();
    if (error400) controller.model.error400On();
    if (favoritesLinks) controller.model.startFavorites(favoritesLinks);
  });
  chrome.runtime.sendMessage({ status: 'onload' });
}

window.onload = () => {
  let n = 0;
  const timerOnloadID = setInterval(() => {
    n += 1;
    const account = getProfile();
    if (account) {
      clearInterval(timerOnloadID);
      window.scrollTo(0, 0);
      checkAccounts(account, loadAccountData);
    }
    if (n > 10) clearInterval(timerOnloadID);
  },300);
  window.onbeforeunload = () => {
    if (!storage.currentLink) storage.playFavorites = false;
  };
};
