import parse from 'url-parse';
import LmControllerView from './lmControllerView';
import SwitchController from './switchController';

const accountData = {
  profileData: {
    counter: {
      likeTotal: 2500,
      likeToday: 303
    },
    maxLikes: 88,
    viewElementSwitch: true,
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
  },
  favorites: {
    locations: {
      'novosibirsk-russia': '/explore/locations/215711407/novosibirsk-russia/',
      'los-angeles-california': '/explore/locations/212999109/los-angeles-california/'
    },
    tags: {
      'рестораннск': '/explore/tags/рестораннск/',
      'банкетнск': '/explore/tags/банкетнск/',
      'банкетныйзал': '/explore/tags/банкетныйзал/',
      'банкетныйзалнск': '/explore/tags/банкетныйзалнск/'
    },
    accounts: {},
    photos: {}
  }
};

const controller = new SwitchController(accountData);
const lmControllerView = new LmControllerView(controller);

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
    currentTag.type = 'accounts';
    if (account[1]) currentTag.name = account[1];
    if (account[0]) currentTag.link = account[0];
    controller.model.currentTag = currentTag;
  } else {
    controller.model.currentTag = { type: '', name: '', link: '' };
  }
}


const handUrl = (url, controller) => {
  const href = parse(url, true).pathname.match(/^\/([^\/]*).*$/);
  const postName = href[0];
  const path = href[1];

  switch (path) {
    case '':
      controller.onSwitchHavey();
      controller.model.currentTag = { type: 'photos', name: '', link: '' };
      break;
    case 'p':
      controller.onSwitchExplorer(postName);
      controller.model.currentTag = { type: 'photos', name: '', link: postName };
      break;
    case 'explore':
      controller.onSwitchOff();
      setLocationsAndTags(postName, controller);
      break;
    default:
      controller.onSwitchOff();
      setAccount(postName, controller);
  }
};

const handClick = (click, controller, model) => {
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
    case 'on':

      break;
    case 'top':
      window.scrollTo(0, 0);
      break;
    case 'download':
      controller && controller.model.saveImage();
      break;
    case 'saveTag':
      console.log('model: ', model);
      model.saveFavorites();
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
};

const clickLink = (link) => {
  console.log('clickLink: ', link);
  const a = document.createElement("a");
  a.setAttribute("href", link);
  a.click();
};

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
      viewElementSwitch,
      link,
      deleteTag
    } = message;

    if (url) handUrl(url, controller);
    if (click) handClick(click, controller.controller, controller.model);
    if (maxLikes) handMaxLikes(maxLikes, controller.model);
    if (popupInitState) controller.model.setInitPopupState();
    if (popupChangeState) controller.model.setPopupState(popupChangeState);
    if (popupResetState) controller.model.resetSettings();
    if (viewElementSwitch) handViewElementSwitch(viewElementSwitch, controller.model);
    if (link) clickLink(link);
    if (deleteTag) controller.model.delFavoriteTag(deleteTag.type, deleteTag.name);

    // if (url) console.log('current controller: ', controller.controller);
  });
  chrome.runtime.sendMessage({ status: 'onload' });
};
