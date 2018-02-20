import elementData from './elementData';

export default class PhotoController {
  constructor(model) {
    this.model = model;
  }

  get wrapElement() {
    this._wrapElement = document.querySelector('div div._pfyik') || document.querySelector('main._8fi2q');
    return this._wrapElement;
  }

  get articleElement() {
    return this._wrapElement && this._wrapElement.querySelector('article');
  }

  get elementNodes() {
    return elementData(this.articleElement).elementNodes;
  }

  openPost(postName) {
    if (!this.openingPost) {
      this.openingPost = true;
      this.openCount = 0;
      try {
        this.openPostTimerID = setInterval(() => {
          this.openCount += 1;
          if (this.openCount > 30)  clearInterval(this.openPostTimerID);
          if (this.wrapElement && elementData(this.articleElement).postLink === postName) {
            !this.play && this.addListKeyboard();
            clearInterval(this.openPostTimerID);
            this.currentNodes = this.elementNodes;
            if (this.element !== this.currentNodes.element) {
              this.addListElement(this.currentNodes.element);
              this.element && this.removeListElement(this.element)
            }
            this.model.currentElement = this.currentNodes.element;
            this.element = this.currentNodes.element;
            this.rightArrow = elementData(this.currentNodes.element).rightArrow;
            this.leftArrow = elementData(this.currentNodes.element).leftArrow;
            this.onOpenPost && this.onOpenPost(postName);
            this.openingPost = false;
            if (this.model.state.playPhoto) this.startLM();
          }
        }, 200);
      } catch (e) {
        this.stopController();
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
    const currentNodes = this.currentNodes;
    if (e.target === currentNodes.heartElement) this.model.onClick(currentNodes.element);
  }

  onElementDblclick(e) {
    const currentNodes = this.currentNodes;
    if (e.target === currentNodes.dblclickImageElement || e.target.classList[0] === '_rcw2i') {
      this.model.onDblclick(currentNodes.element);
    }
  }

  likeElement(elementNodes) {
    const image = elementNodes.dblclickImageElement;
    const heart = elementNodes.heartElement;
    image ? image.dispatchEvent(new MouseEvent('dblclick', {'bubbles': true})) : heart.click();
  }

  unlikeElement(elementNodes) {
    elementNodes.heartElement.click();
  }

  clickCurrentElement() {
    const { currentNodes } = this;
    const heartFull = elementData(currentNodes.element).heartFull;
    heartFull ? this.unlikeElement(currentNodes) : this.likeElement(currentNodes);
  }

  likeCurrentElement() {
    const { currentNodes } = this;
    const heartFull = elementData(currentNodes.element).heartFull;
    !heartFull && this.likeElement(currentNodes);
  }

  goToNextElement(callback) {
    this.onOpenPost = () => {
      this.onOpenPost = null;
      callback && callback();
    };
    this.rightArrow.click();
  }

  goToPrevElement(callback) {
    this.onOpenPost = () => {
      this.onOpenPost = null;
      callback && callback();
    };
    this.leftArrow.click();
  }

  onStartLM() {
    const likeDelay = this.model.state.settings.likeDelay;
    if (this.play) {
      this.likePhotoTimerID = setTimeout(() => {
        this.likeCurrentElement();
        this.likePhotoTimerID = setTimeout(() => {
          const { settings: { maxLikes }, counter: { likeToday }, likeNowCounter, todayMaxLikes } = this.model.state;
          likeNowCounter < maxLikes && likeToday < todayMaxLikes ? this.goToNextElement(this.onStartLM.bind(this)) : this.stopLM();
        }, 500);
      }, likeDelay);
    }
  }

  startLM() {
    if (!this.play) {
      this.play = true;
      this.onStartLM();
      this.ignoreKeyboard();
      this.model.playPhoto = false;
    }
  }

  pauseLM() {
    this.play = false;
    clearTimeout(this.likePhotoTimerID);
    this.addListKeyboard();
  }

  stopLM() {
    this.play = false;
    clearTimeout(this.likePhotoTimerID);
    this.model.resetLikeNowCounter();
    this.addListKeyboard();
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
      elementData(this.currentNodes.element).rightChevron.click();
    } catch (e) {
      // console.log('no right chevron');
    }
  }

  onClickDown(e) {
    try {
      elementData(this.currentNodes.element).leftChevron.click();
    } catch (e) {
      // console.log('no left chevron');
    }
  }

  onClickEnter(e) {
    e.preventDefault();
    try {
      elementData(this.currentNodes.element).playElement.click();
    } catch (e) {
      // console.log('no play element');
    }
  }

  onDblclickSpace(e) {
    this.clickCurrentElement();
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
    this.model.resetLikeNowCounter();
    this.removeListKeyboard();
    this.element && this.removeListElement(this.element)
  }

}
