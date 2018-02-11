import parse from 'url-parse';
import LmControllerView from './lmControllerView';
import SwitchController from './switchController';

const machineData = {
  // maxLikes: 100,
  counter: {
    likeTotal: 0,
    likeToday: 0,
    saveAll: 0,
    saveToday: 0
  }
};

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
      controller.onSwitchExplorer();
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
  console.log('maxLikes: ', maxLikes);
  model.maxLikes = maxLikes;
};

window.onload = () => {
  window.scrollTo(0, 0);
  const controller = new SwitchController(machineData);
  const lmControllerView = new LmControllerView(controller);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('message: ', message);
    const { onload, click, url, maxLikes, machineSwitch, state } = message;

    if (url) handUrl(url, controller);
    if (click) handClick(click, controller.controller);
    if (maxLikes) handMaxLikes(maxLikes, controller.model);
    if (state) chrome.runtime.sendMessage({ state: controller.model.state });

    lmControllerView.addElement();
    machineSwitch ? lmControllerView.showElement() : lmControllerView.hiddenElement();
  });
  chrome.runtime.sendMessage({ status: 'onload' });
};
