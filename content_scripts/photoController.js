import elementData from './elementData';
import storage from './storage';
import {
  checkTodayLikes,
  checkFullHearts,
  checkLikes,
  checkError
} from './util';

export default class PhotoController {
  constructor(model) {
    this.model = model;
    this.likesHeart = 0;
    this.exploreName = '';
  }

  get wrapElement() {
    this._wrapElement = document.querySelector('div div._pfyik') || document.querySelector('main._8fi2q');
    return this._wrapElement;
  }

  get articleElement() {
    return this._wrapElement && this._wrapElement.querySelector('article');
  }

  get element() {
    return elementData(this.articleElement).element;
  }

  openPost(postName) {
    if (!this.openingPost) {
      this.openingPost = true;
      this.openCount = 0;
      try {
        this.openPostTimerID = setInterval(() => {
          this.openCount += 1;
          if (this.openCount > 100)  clearInterval(this.openPostTimerID);
          if (this.wrapElement && elementData(this.articleElement).postLink === postName) {
            const { start, pause, stop, name } = this.model.state.remotePhoto;
            const currentElement = this.model.state.currentElement;
            const newCurrentElement = this.element;
            !this.play && this.addListKeyboard();
            clearInterval(this.openPostTimerID);
            if (currentElement !== newCurrentElement) {
              this.model.currentElement = newCurrentElement;
              this.addListElement(newCurrentElement);
              currentElement && this.removeListElement(currentElement);
              this.rightArrow = elementData(newCurrentElement).rightArrow;
              this.leftArrow = elementData(newCurrentElement).leftArrow;
            }
            this.onOpenPost && this.onOpenPost(postName);
            this.openingPost = false;
            if (name) this.exploreName = name;
            if (start) this.startLM();
            if (pause) this.pauseLM();
            if (stop) this.stopLM();
          }
        }, 300);
      } catch (e) {
        this.stopController();
        if (storage.playFavorites) this.model.startNextItemFavorites();
      }
    }
  }

  addListElement(element) {
    element.addEventListener('click', this.onElementClick.bind(this));
    element.addEventListener('dblclick', this.onElementDblclick.bind(this));
  }

  removeListElement(element) {
    element.removeEventListener('click', this.onElementClick.bind(this));
    element.removeEventListener('dblclick', this.onElementDblclick.bind(this));
  }

  onElementClick(e) {
    const currentElement = this.model.state.currentElement;
    if (e.target === elementData(currentElement).heartElement) this.model.onClick(currentElement);
  }

  onElementDblclick(e) {
    const currentElement = this.model.state.currentElement;
    if (e.target === elementData(currentElement).dblclickImageElement || e.target.classList[0] === '_rcw2i') {
      this.model.onDblclick(currentElement);
    }
  }

  goToNextElement(callback) {
    try {
      this.onOpenPost = () => {
        this.onOpenPost = null;
        callback && callback();
      };
      this.rightArrow.click();
    } catch (e) {
      this.stopLM();
      if (storage.playFavorites) this.model.startNextItemFavorites();
    }
  }

  goToPrevElement(callback) {
    try {
      this.onOpenPost = () => {
        this.onOpenPost = null;
        callback && callback();
      };
      this.leftArrow.click();
    } catch (e) {
      this.stopLM();
    }
  }

  onStartLM() {
    const {
      settings: { maxLikes, fiftyDelay, errorDelay, numFullHearts, photoDelay },
      counter: { likeToday },
      fullHearts,
      likeNowCounter,
      error,
      error400,
      version: { todayMaxLikes }
    } = this.model.state;
    checkTodayLikes(likeToday, todayMaxLikes)
      .then(() => {
        return new Promise((resolve, reject) => {
          this.likePhotoTimerID = setTimeout(() => {
            this.model.likeCurrentElement();
            resolve();
          }, photoDelay * 1000);
        })
      })
      .then(() => {
        return checkFullHearts(fullHearts, numFullHearts);
      })
      .then(() => {
        return checkLikes(likeNowCounter, maxLikes);
      })
      .then(() => {
        return checkError(error400, error);
      })
      .then(() => {
        return new Promise((resolve, reject) => {
          this.likePhotoTimerID = setTimeout(() => {
            this.goToNextElement(this.onStartLM.bind(this));
            resolve();
          }, 800);
        })
      })
      .catch((message) => {
        switch (message) {
          case 'limitLikes':
            this.stopLM();
            this.model.infoMessage = `You have reached the limit of likes for today (maximum ${todayMaxLikes} likes)`;
            break;
          case 'fullHearts':
            this.stopLM();
            this.model.infoMessage = `${numFullHearts} full hearts in a row`;
            if (storage.playFavorites) this.model.startNextItemFavorites();
            break;
          case '50likes':
            this.pauseLM();
            this.model.infoMessage = `50 likes: Delay ${fiftyDelay} min`;
            this.timerDelayID = setTimeout(() => {
              this.goToNextElement(this.onStartLM.bind(this));
              this.model.infoMessage = `Start ${this.exploreName ? this.exploreName : ''}`;
            }, fiftyDelay * 60 * 1000);
            break;
          case 'maxLikes':
            this.stopLM();
            this.model.infoMessage = `You have reached ${maxLikes} likes`;
            if (storage.playFavorites) this.model.startNextItemFavorites();
            break;
          case 'error400':
            this.pauseLM();
            this.model.infoMessage = 'Warning! Delay 1 hours';
            this.timerDelayID = setTimeout(() => {
              this.model.error400Off();
              this.goToNextElement(this.onStartLM.bind(this));
              this.model.infoMessage = `Start ${this.exploreName ? this.exploreName : ''}`;
            }, 60 * 60 * 1000);
            break;
          case 'error':
            this.pauseLM();
            this.model.infoMessage = `Warning! Delay ${this.state.settings.errorDelay} min`;
            this.timerDelayID = setTimeout(() => {
              this.errorOff();
              this.goToNextElement(this.onStartLM.bind(this));
              this.model.infoMessage = `Start ${this.exploreName ? this.exploreName : ''}`;
            }, errorDelay * 60 * 1000);
            break;
          default:
            this.stopLM();
            this.model.infoMessage = `error`;
        }
      })
  }

  startLM() {
    if (!this.play) {
      this.model.infoMessage = `Start ${this.exploreName ? this.exploreName : ''}`;
      this.play = true;
      this.onStartLM();
      this.ignoreKeyboard();
      this.model.remotePhoto = { start: false, pause: false, stop: false, name: '' };
    }
  }

  pauseLM() {
    this.play = false;
    this.model.infoMessage = 'Pause';
    clearTimeout(this.likePhotoTimerID);
    clearTimeout(this.timerDelayID);
    this.addListKeyboard();
    this.model.remotePhoto = { start: false, pause: false, stop: false, name: '' };
  }

  stopLM() {
    this.play = false;
    this.model.fullHearts = 0;
    this.model.infoMessage = 'Stop';
    clearTimeout(this.likePhotoTimerID);
    clearTimeout(this.timerDelayID);
    this.model.resetLikeNowCounter();
    this.addListKeyboard();
    this.model.remotePhoto = { start: false, pause: false, stop: false, name: '' };
  }

  onClickSpace(e) {
    try {
      this.rightArrow.click();
    } catch (e) {
      // console.log('no right arrow');
    }
  }

  onClickUp(e) {
    try {
      elementData(this.model.state.currentElement).rightChevron.click();
    } catch (e) {
      // console.log('no right chevron');
    }
  }

  onClickDown(e) {
    try {
      elementData(this.model.state.currentElement).leftChevron.click();
    } catch (e) {
      // console.log('no left chevron');
    }
  }

  onClickEnter(e) {
    e.preventDefault();
    try {
      elementData(this.model.state.currentElement).playElement.click();
    } catch (e) {
      // console.log('no play element');
    }
  }

  onDblclickSpace(e) {
    this.model.clickCurrentElement();
  }

  onSpace(e) {
    const { dblclickInterval } = this.model.state.settings;
    e.preventDefault();
    if (this.spaceInterval) {
      clearTimeout(this.timerSpaceID);
      this.spaceInterval = false;
      this.onDblclickSpace(e);
    } else {
      this.spaceInterval = true;
      this.timerSpaceID = setTimeout(() => {
        this.spaceInterval = false;
        this.onClickSpace(e);
      }, dblclickInterval);
    }
  }

  onKeyboard(e) {
    switch (e.keyCode) {
      case 32:
        this.onSpace(e);
        break;
      case 40:
        this.onClickDown(e);
        break;
      case 38:
        this.onClickUp(e);
        break;
      case 13:
        this.onClickEnter(e);
        break;
    }
  }

  addListKeyboard() {
    window.onkeydown = this.onKeyboard.bind(this);
  }

  ignoreKeyboard() {
    window.onkeydown = e => {
      if (e.keyCode === 39 || e.keyCode === 37) this.pauseLM();
      if (e.keyCode === 13) e.preventDefault();
    };
  }

  removeListKeyboard() {
    window.onkeydown = null;
  }

  startController() {
    // this.addListKeyboard();
  }

  stopController() {
    this.openingPost = false;
    this.play = false;
    this.onOpenPost = null;
    clearInterval(this.openPostTimerID);
    clearTimeout(this.likePhotoTimerID);
    clearTimeout(this.timerDelayID);
    this.model.resetLikeNowCounter();
    this.removeListKeyboard();
    this.element && this.removeListElement(this.element)
    // this.stopLM();
  }

}
