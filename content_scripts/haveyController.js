import elementData from './elementData';

import scrollToEl from 'scroll-to-element';
import ScrollEvents from 'scroll-events';


const scrollEvents = new ScrollEvents()
const onScrollStop = () => {};
// scrollEvents.on('scroll:stop', () => {
//   console.log('scrollEvents ---------- stop');
//   callback && callback();
// })

export default class HaveyController {
  constructor(model) {
    this.height = window.pageYOffset;
    this.windowHeight = window.innerHeight;
    this.delta = this.windowHeight / 3;
    this.top = 0;
    this.bottom = this.delta;
    this.serviceWindowHeight = 180;
    this.firstElementCount = 0;
    this.lastElementCount = 3;
    this.model = model;
  }

  get haveyElement() {
    return document.querySelector('._havey');
  }

  get currentNodes() {
    const { currentHaveyElementNum, elementsNodes } = this.model.state;
    return elementsNodes[currentHaveyElementNum];
  }

  get prevNodes() {
    const { currentHaveyElementNum, elementsNodes } = this.model.state;
    return elementsNodes[currentHaveyElementNum - 1];
  }

  get nextNodes() {
    const { currentHaveyElementNum, elementsNodes } = this.model.state;
    return elementsNodes[currentHaveyElementNum + 1];
  }

  get scrollSettings() {
    const { scrollSpeed, scrollType } = this.model.state.profileData;
    return {
      offset: -52,
      ease: scrollType,
      duration: scrollSpeed
    }
  }

  setNumElement(element, num) {
    element.dataset.numberElement = num;
  }

  numberingElements(callback) {
    const { haveyElement } = this;
    const elements = haveyElement.querySelectorAll('article');
    let currentElement = false;
    elements.forEach((item, i) => {
      this.setNumElement(item, i);
      this.lastElementCount = i;
      this.model.addElNodes(item, i);
      this.addListElement(item);
      const top = item.getBoundingClientRect().top;
      if (top > -300 && !currentElement) {
        this.model.currentHaveyElementNum = i;
        currentElement = true;
      }
      if (elements.length - 1 === i) callback();
    })
  }

  addListInsertElement() {
    const haveyElement = this.haveyElement;
    haveyElement && haveyElement.addEventListener('DOMNodeInserted', this.onInsertElement.bind(this));
  };

  removeListInsertElement() {
    const haveyElement = this.haveyElement;
    haveyElement && haveyElement.removeEventListener('DOMNodeInserted', this.onInsertElement.bind(this));
  }

  addListRemoveElement() {
    const haveyElement = this.haveyElement;
    haveyElement && haveyElement.addEventListener('DOMNodeRemoved', this.onRemoveElement.bind(this));
  }

  removeListRemoveElement() {
    const haveyElement = this.haveyElement;
    haveyElement && haveyElement.removeEventListener('DOMNodeRemoved', this.onRemoveElement.bind(this));
  }

  onInsertElement(e) {
    try {
      const { target, relatedNode } = e;
      if (target.tagName === 'ARTICLE') {
        const childNodes = e.relatedNode.childNodes;
        const lastChildNumberElement = childNodes[childNodes.length - 2].dataset.numberElement * 1;
        const firstChildNumberElement = childNodes[1].dataset.numberElement * 1;
        if (relatedNode.lastChild === target) this.addLastElement(target, lastChildNumberElement);
        if (relatedNode.firstChild === target) this.addFirstElement(target, firstChildNumberElement);
      }
    } catch (e) {
      this.restartController();
    }
  }

  onRemoveElement(e) {
    try {
      const { target, relatedNode } = e;
      if (target.tagName === 'ARTICLE') {
        const numberElement = target.dataset.numberElement * 1;
        const lastChildNumberElement = relatedNode.lastChild.dataset.numberElement * 1;
        const firstChildNumberElement = relatedNode.firstChild.dataset.numberElement * 1;
        if (lastChildNumberElement === numberElement) this.removeLastElement(target, lastChildNumberElement);
        if (firstChildNumberElement === numberElement) this.removeFirstElement(target, firstChildNumberElement);
      }
    } catch (e) {
      this.restartController();
    }
  }

  addLastElement(element, num) {
    const lastElementCount = num + 1;
    this.setNumElement(element, lastElementCount);
    this.model.addElNodes(element, lastElementCount);
    this.addListElement(element);
    this.lastElementCount = lastElementCount;
  }

  addFirstElement(element, num) {
    const firstElementCount = num - 1;
    this.setNumElement(element, firstElementCount);
    this.model.addElNodes(element, firstElementCount);
    this.addListElement(element);
    this.firstElementCount = firstElementCount;
  }

  removeLastElement(element, num) {
    this.removeListElement(element);
    this.model.delElNodes(num);
    this.lastElementCount = num - 1;
  }

  removeFirstElement(element, num) {
    this.removeListElement(element);
    this.model.delElNodes(num);
    this.firstElementCount = num + 1;
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
    const numElement = e.currentTarget.dataset.numberElement * 1;
    const elementNodes = this.model.state.elementsNodes[numElement];
    if (e.target === elementNodes.heartElement) this.model.onClick(elementNodes.element);
  }


  onElementDblclick(e) {
    const numElement = e.currentTarget.dataset.numberElement * 1;
    const elementNodes = this.model.state.elementsNodes[numElement];
    if (e.target === elementNodes.dblclickImageElement || e.target.classList[0] === '_rcw2i') {
      this.model.onDblclick(elementNodes.element);
    }
  }

  setCurrentElement() {
    try {
      const { currentHaveyElementNum, elementsNodes } = this.model.state;
      const heightLine = this.windowHeight / 2;
      const nextElement = this.nextNodes && this.nextNodes.element;
      const topHeightNextElement = nextElement && nextElement.getBoundingClientRect().top
      const topHeightCurrentElement = this.currentNodes.element.getBoundingClientRect().top;
      if (heightLine > topHeightNextElement) this.model.currentHaveyElementNum = currentHaveyElementNum + 1;
      if (heightLine < topHeightCurrentElement) this.model.currentHaveyElementNum = currentHaveyElementNum  - 1;
    } catch (e) {
      this.restartController();
    }
  }

  scrollToElement(element, callback) {
    scrollToEl(element, this.scrollSettings);
    let height = -1;
    this.scrollID = setInterval(() => {
      if (height === this.height) {
        clearInterval(this.scrollID);
        callback && callback();
      } else {
        height = this.height;
      }
    }, 50)
  }

  likeElement(elementNodes) {
    const image = elementData(elementNodes.element).dblclickImageElement;
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
    const { nextNodes } = this;
    if (nextNodes) {
      this.scrollToElement(nextNodes.element, callback);
    } else {
      this.stopLM();
    }
  }

  onStartLM() {
    const likeDelay = this.model.state.profileData.likeDelay;
    if (this.play) {
      this.likeCurrentElement();
      this.likePhotoTimerID = setTimeout(() => {
        const { profileData: { maxLikes }, likeNowCounter } = this.model.state;
        likeNowCounter < maxLikes ? this.goToNextElement(this.onStartLM.bind(this)) : this.stopLM();
      }, likeDelay);
    }
  }

  startLM() {
    if (!this.play) {
      this.play = true;
      this.ignoreKeyboard();
      this.onStartLM();
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
    this.addListKeyboard();
    this.model.resetLikeNowCounter();
  }

  onClickSpace(e) {
    const { currentNodes, nextNodes } = this;
    const topCurrentElement = currentNodes.element.getBoundingClientRect().top;
    if (topCurrentElement < 50 || topCurrentElement > 100) {
      scrollToEl(currentNodes.element, this.scrollSettings);
    } else {
      nextNodes && scrollToEl(nextNodes.element, this.scrollSettings);
    }
  }

  onClickUp(e) {
    const { currentNodes, prevNodes } = this;
    const topCurrentElement = currentNodes.element.getBoundingClientRect().top;
    prevNodes && scrollToEl(prevNodes.element, this.scrollSettings);
  }

  onClickDown(e) {
    const { currentNodes, nextNodes } = this;
    const topCurrentElement = currentNodes.element.getBoundingClientRect().top;
    nextNodes && scrollToEl(nextNodes.element, this.scrollSettings);
  }

  onClickRight(e) {
    try {
      elementData(this.currentNodes.element).rightChevron.click();
    } catch (e) {
      console.log('no right chevron');
    }
  }

  onClickLeft(e) {
    try {
      elementData(this.currentNodes.element).leftChevron.click();
    } catch (e) {
      console.log('no left chevron');
    }
  }

  onClickEnter(e) {
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
    const { dblclickInterval } = this.model.state.profileData;
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
      case 39:
        this.onClickRight(e);
        break;
      case 37:
        this.onClickLeft(e);
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

  setHeightScroll() {
    const { delta, height } = this;
    this.top = height - delta;
    this.bottom = height + delta;
  }

  startController() {
    try {
      this.haveyTimerID = setInterval(() => {
        if (this.haveyElement.querySelectorAll('article').length > 3) {
          clearInterval(this.haveyTimerID);
          this.numberingElements(() => {
            this.addListInsertElement();
            this.addListRemoveElement();
          });
          window.onscroll = () => {
            this.height = window.pageYOffset;
            if (this.height > this.bottom || this.height < this.top) {
              this.setHeightScroll();
              this.setCurrentElement();
            }
          }
          this.addListKeyboard();
        }
      }, 300);
    } catch (e) {
      this.stopController();
    }
  }

  stopController() {
    window.onscroll = () => {};
    this.removeListInsertElement();
    this.removeListRemoveElement();
    const elementsNodes = this.model.elementsNodes;
    if (elementsNodes) {
      Object.keys(elementsNodes).foreEach((item) => {
        this.removeListElement(elementsNodes[item].element);
      })
    }
    this.removeListKeyboard();
    clearTimeout(this.likePhotoTimerID);
    clearInterval(this.scrollID);
    clearTimeout(this.timerSpaceID);
    clearInterval(this.haveyTimerID);
  }

  restartController() {
    this.stopController();
      let height = this.height;
      this.scrollID = setInterval(() => {
        if (height === this.height) {
          clearInterval(this.scrollID);
          this.startController();
        } else {
          height = this.height;
        }
      }, 50)
  }

}
