import parse from 'url-parse';
import LmControllerView from './lmControllerView';
import switchController from './switchController';
// import haveyController from './haveyController';
// import explorerController from './explorerController';

const machineData = {
  maxLikes: 101,
  machineSwitch: false,
  counter: {
    likeTotal: 0,
    likeToday: 0,
    saveAll: 0,
    saveToday: 0
  }
};


window.onload = () => {
  window.scrollTo(0, 0);

  const controller = switchController(machineData);
  const lmControllerView = new LmControllerView(controller);
  controller.onSwitchHavey();
  lmControllerView.addElement();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const {
      firstLoad, click, url, maxLikes, machineSwitch
    } = message;
    const href = parse(url, true).pathname.match(/^\/([^\/]*).*$/);
    const postName = href[0];
    const path = href[1];
    console.log('postName: ', postName);
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
    // lmControllerView.addElement();
    machineSwitch ? lmControllerView.showElement() : lmControllerView.hiddenElement();
  });
  chrome.runtime.sendMessage({ status: 'onload' });
};
