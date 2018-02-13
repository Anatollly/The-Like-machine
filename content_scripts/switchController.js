import HaveyController from './haveyController';
import ExplorerController from './explorerController';
import Model from './model';

export default class SwitchController {
  constructor(data) {
    this.data = data;
    this.model = new Model(this.data);
    this.haveyController = new HaveyController(this.model);
    this.explorerController = new ExplorerController(this.model);
  }

  get controller() {
    return this._controller;
  }

  onSwitchHavey() {
    if(this._controller !== this.haveyController) this.switchToHaveyController();
  }

  onSwitchExplorer(postName) {
    if(this._controller !== this.explorerController) this.switchToExplorerController();
    this.explorerController.openPost(postName);
  }

  onSwitchOff() {
    this.switchOffController();
  }

  switchToHaveyController() {
    this._controller = this.haveyController;
    this.haveyController.startController();
    this.explorerController.stopController();
  }

  switchToExplorerController() {
    this._controller = this.explorerController;
    this.explorerController.startController();
    this.haveyController.stopController();
  }

  switchOffController() {
    this._controller = null;
    this.haveyController.stopController();
    this.explorerController.stopController();
  }
}

// export default (data) => new SwitchController(data);
