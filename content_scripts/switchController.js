import HaveyController from './haveyController';
import ExplorerController from './explorerController';
import Model from './model';

class SwitchController {
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

  onSwitchExplorer() {
    if (this._controller !== this.explorerController) this.switchToExplorerController();
  }

  onSwitchOff() {
    this.switchOffController();
  }

  switchToHaveyController() {
    console.log('switch havey');
    this._controller = this.haveyController;
    this.explorerController.removeListInsertElement();
    this.haveyController.addListSpace();
    this.haveyController.collectDataStart();
  }

  switchToExplorerController() {
    console.log('switch explorer');
    this._controller = this.explorerController;
    this.explorerController.addListInsertElement();
    this.haveyController.removeListSpace();
    this.haveyController.collectDataStop();
  }

  switchOffController() {
    console.log('switch off');
    this._controller = null;
    this.explorerController.removeListInsertElement();
    this.haveyController.removeListSpace();
    this.haveyController.collectDataStop();
  }
}

export default (data) => new SwitchController(data);
