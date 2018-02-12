import elementData from './elementData';

export default class ExplorerController {
  constructor(model) {
    this.model = model;
  }

  get wrapElement() {
    this._wrapElement = document.querySelector('div div._pfyik');
    return this._wrapElement;
  }

  get articleElement() {
    return this._wrapElement && this._wrapElement.querySelector('article');
  }

  get elementNodes() {
    return elementData(this.articleElement).elementNodes;
  }

  openPost(postName) {
    this.openPostTimerID = setInterval(() => {
      console.log('interval');
      if (this.wrapElement && elementData(this.articleElement).postLink === postName) {
        clearInterval(this.openPostTimerID);
        this.currentNodes = this.elementNodes;
        this.rightArrow = elementData(this.currentNodes.element).rightArrow;
        this.leftArrow = elementData(this.currentNodes.element).leftArrow;
        this.onOpenPost && this.onOpenPost(postName);
      }
    }, 100);
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

  likeNextElement() {

  }

  goToPrevElement(callback) {
    this.onOpenPost = () => {
      this.onOpenPost = null;
      callback && callback();
    };
    this.leftArrow.click();
  }



  onStartLM() {
    this.likePhotoTimerID = setTimeout(() => {
      this.likeCurrentElement();
      this.likePhotoTimerID = setTimeout(() => {
        const { profileData: { maxLikes }, likeNowCounter } = this.model.state;
        likeNowCounter < maxLikes ? this.goToNextElement(this.onStartLM.bind(this)) : this.stopLM();
      }, 500);
    }, 500);
  }

  startLM() {
    if (!this.play) {
      this.onStartLM();
    }
  }

  pauseLM() {
    this.play = false;
    clearTimeout(this.likePhotoTimerID);
  }

  stopLM() {
    this.play = false;
    clearTimeout(this.likePhotoTimerID);
    this.model.resetLikeNowCounter();
  }

}
