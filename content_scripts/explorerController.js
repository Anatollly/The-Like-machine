import elementData from './elementData';

export default class ExplorerController {
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
            this.rightArrow = elementData(this.currentNodes.element).rightArrow;
            this.leftArrow = elementData(this.currentNodes.element).leftArrow;
            this.onOpenPost && this.onOpenPost(postName);
            this.openingPost = false;
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
    const elementNodes = this.elementsNodes;
    if (e.target === elementNodes.heartElement) this.model.onClick(elementNodes.element);
  }

  onElementDblclick(e) {
    const elementNodes = this.elementsNodes;
    if (e.target === elementNodes.dblclickImageElement || e.target.classList[0] === '_rcw2i') {
      this.model.onDblclick(elementNodes.element);
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
    if (this.play) {
      this.likePhotoTimerID = setTimeout(() => {
        this.likeCurrentElement();
        this.likePhotoTimerID = setTimeout(() => {
          const { profileData: { maxLikes }, likeNowCounter } = this.model.state;
          likeNowCounter < maxLikes ? this.goToNextElement(this.onStartLM.bind(this)) : this.stopLM();
        }, 500);
      }, 500);
    }
  }

  startLM() {
    if (!this.play) {
      this.play = true;
      this.onStartLM();
      this.ignoreKeyboard();
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
      console.log('no right arrow');
    }
  }

  onClickUp(e) {
    try {
      elementData(this.currentNodes.element).rightChevron.click();
    } catch (e) {
      console.log('no right chevron');
    }
  }

  onClickDown(e) {
    try {
      elementData(this.currentNodes.element).leftChevron.click();
    } catch (e) {
      console.log('no left chevron');
    }
  }

  onClickEnter(e) {
    e.preventDefault();
    try {
      elementData(this.currentNodes.element).playElement.click();
    } catch (e) {
      console.log('no play element');
    }
  }

  onDblclickSpace(e) {
    this.clickCurrentElement();
  }

  onSpace(e) {
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
      }, 300);
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
    window.onkeydown = e => e.preventDefault();
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
    clearInterval(this.openPostTimerID);
    clearTimeout(this.likePhotoTimerID);
    this.model.resetLikeNowCounter();
    this.removeListKeyboard();
  }

}
