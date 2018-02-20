import HaveyController from './haveyController';
import PhotoController from './photoController';
import ExploreController from './exploreController';
import Model from './model';

export default class SwitchController {
  constructor(data, account) {
    this.data = data;
    this.account = account;
    this.model = new Model(this.data, this.account);
    this.haveyController = new HaveyController(this.model);
    this.photoController = new PhotoController(this.model);
    this.exploreController = new ExploreController(this.model);
  }

  get controller() {
    return this._controller;
  }

  onSwitchHavey() {
    if(this._controller !== this.haveyController) this.switchToHaveyController();
  }

  onSwitchPhoto(postName) {
    if(this._controller !== this.photoController) this.switchToPhotoController();
    this.photoController.openPost(postName);
  }

  onSwitchExplore() {
    if(this._controller !== this.exploreController) this.switchToExploreController();
  }

  onSwitchOff() {
    this.switchOffController();
  }

  switchToHaveyController() {
    this._controller = this.haveyController;
    this.haveyController.startController();
    this.photoController.stopController();
  }

  switchToPhotoController() {
    this._controller = this.photoController;
    this.photoController.startController();
    this.haveyController.stopController();
  }

  switchToExploreController() {
    this._controller = this.exploreController;
    this.haveyController.stopController();
    this.photoController.stopController();
  }

  switchOffController() {
    this._controller = null;
    this.haveyController.stopController();
    this.photoController.stopController();
  }
}
