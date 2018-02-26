import elementData from './elementData';
import storage from './storage';

export default class ExploreController {
  constructor(model) {
    this.model = model;
    this.model.onStartItemFavorites = this.startLM.bind(this);
    this.name = '';
  }

  get haveyElement() {
    this._haveyElement = document.querySelectorAll('._havey');
    return this._haveyElement;
  }

  get firstBestPhoto() {
    try {
      if (this.haveyElement[1]) {
        this._firstBestPhoto = this.haveyElement[0].querySelector('a div');
        return this._firstBestPhoto;
      } else {
        return null;
      }
    } catch (e) {
    }
  }

  get firstNewPhoto() {
    try {
      if (this.haveyElement[1]) {
        this._firstNewPhoto = this.haveyElement[1].querySelector('a div');
        return this._firstNewPhoto;
      } else {
        this._firstNewPhoto = this.haveyElement[0].querySelector('a div');
        return this._firstNewPhoto;
      }
    } catch (e) {
    }

  }

  startLM() {
    try {
      let n = 0;
      this.timerStartID = setInterval(() => {
        n += 1;
        if (this.haveyElement) {
          const { remotePhoto, settings: { skipTheBest }, currentTag: { name } } = this.model.state;
          clearInterval(this.timerStartID);
          this.model.remotePhoto = { start: true, pause: false, stop: false, name: this.name };
          !skipTheBest && this.firstBestPhoto ? this.firstBestPhoto.click() : this.firstNewPhoto.click();
        }
        if (n > 100) clearInterval(timerStartID);
      }, 300);
    } catch (e) {
      clearInterval(this.timerStartID);
      this.model.playFavorites = false;
      this.model.remotePhoto = { start: false, pause: false, stop: false, name: '' };
    }
  }

  pauseLM() {
    this.model.remotePhoto = { start: false, pause: true, stop: false, name: this.name };
  }

  stopLM() {
    this.model.remotePhoto = { start: false, pause: false, stop: true, name: this.name };
  }

  startController() {
    const { currentTag: { name } } = this.model.state;
    this.name = name;
    this.model.remotePhoto = { start: false, pause: false, stop: false, name };
  }

  stopController() {

  }

}
