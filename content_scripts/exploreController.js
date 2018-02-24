import elementData from './elementData';
import storage from './storage';

export default class ExploreController {
  constructor(model) {
    this.model = model;
    this.model.onStartItemFavorites = this.startLM.bind(this);
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
      console.log('ExploreController startLM');
      let n = 0;
      this.timerStartID = setInterval(() => {
        console.log('ExploreController interval');
        n += 1;
        if (this.haveyElement) {
          clearInterval(this.timerStartID);
          const skipTheBest = this.model.state.settings.skipTheBest;
          this.model.remotePhoto = { start: true, pause: false, stop: false};
          !skipTheBest && this.firstBestPhoto ? this.firstBestPhoto.click() : this.firstNewPhoto.click();
        }
        if (n > 100) clearInterval(timerStartID);
      }, 300);
    } catch (e) {
      clearInterval(this.timerStartID);
      this.model.playFavorites = false;
      this.model.remotePhoto = { start: false, pause: false, stop: false};
    }
  }

  pauseLM() {
    this.model.remotePhoto = { start: false, pause: true, stop: false};
  }

  stopLM() {
    this.model.remotePhoto = { start: false, pause: false, stop: true};
  }

  startController() {
    console.log('startController ExploreController: ');
    // storage.playFavorites && this.startLM();
  }

  stopController() {
    console.log('stop ExploreController');
  }

}
