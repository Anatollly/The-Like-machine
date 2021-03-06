import HaveyController from './haveyController';
import PhotoController from './photoController';
import ExploreController from './exploreController';
import Model from './model';

export default class SwitchController {
  constructor(data, globalData, account) {
    this.data = data;
    this.account = account;
    this.globalData = globalData;
    this.model = new Model(this.data, this.globalData, this.account);
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
    // if(this._controller !== this.exploreController) this.switchToExploreController();
    this.switchToExploreController();
  }

  onSwitchOff() {
    this.switchOffController();
  }

  switchToHaveyController() {
    this._controller = this.haveyController;
    this.haveyController.startController();
    this.photoController.stopController();
    this.exploreController.stopController();
  }

  switchToPhotoController() {
    this._controller = this.photoController;
    this.photoController.startController();
    this.haveyController.stopController();
    this.exploreController.stopController();
  }

  switchToExploreController() {
    this._controller = this.exploreController;
    this.exploreController.startController();
    this.haveyController.stopController();
    this.photoController.stopController();
  }

  switchOffController() {
    this._controller = null;
    this.haveyController.stopController();
    this.photoController.stopController();
  }
}
