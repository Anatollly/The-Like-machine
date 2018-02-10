import elementData from './elementData';

import scrollToEl from 'scroll-to-element';

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
    this.scrollSettings = {
      offset: -52,
      ease: 'out-expo',
      duration: 700
    };
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

  setNumElement(element, num) {
    element.dataset.numberElement = num;
  }

  numberingElements(callback) {
    const { haveyElement } = this;
    const elements = haveyElement.querySelectorAll('article');
    elements.forEach((item, i) => {
      this.setNumElement(item, i);
      this.lastElementCount = i;
      this.model.addElNodes(item, i);
      this.addListElement(item);
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
    const { target, relatedNode } = e;
    if (target.tagName === 'ARTICLE') {
      const childNodes = e.relatedNode.childNodes;
      const lastChildNumberElement = childNodes[childNodes.length - 2].dataset.numberElement * 1;
      const firstChildNumberElement = childNodes[1].dataset.numberElement * 1;
      if (relatedNode.lastChild === target) this.addLastElement(target, lastChildNumberElement);
      if (relatedNode.firstChild === target) this.addFirstElement(target, firstChildNumberElement);
    }
  }

  onRemoveElement(e) {
    const { target, relatedNode } = e;
    if (target.tagName === 'ARTICLE') {
      const numberElement = target.dataset.numberElement * 1;
      const lastChildNumberElement = relatedNode.lastChild.dataset.numberElement * 1;
      const firstChildNumberElement = relatedNode.firstChild.dataset.numberElement * 1;
      if (lastChildNumberElement === numberElement) this.removeLastElement(target, lastChildNumberElement);
      if (firstChildNumberElement === numberElement) this.removeFirstElement(target, firstChildNumberElement);
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
    const { currentHaveyElementNum, elementsNodes } = this.model.state;
    const heightLine = this.windowHeight / 2;
    const nextElement = this.nextNodes && this.nextNodes.element;
    const topHeightNextElement = nextElement && nextElement.getBoundingClientRect().top
    const topHeightCurrentElement = this.currentNodes.element.getBoundingClientRect().top;
    if (heightLine > topHeightNextElement) this.model.currentHaveyElementNum = currentHaveyElementNum + 1;
    if (heightLine < topHeightCurrentElement) this.model.currentHaveyElementNum = currentHaveyElementNum  - 1;
  }

  scrollToElement(element, callback) {
    scrollToEl(element, this.scrollSettings);
    let height = -1;
    const scrollID = setInterval(() => {
      if (height === this.height) {
        clearInterval(scrollID);
        callback && callback();
      } else {
        height = this.height;
      }
    }, 50)
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

  likeNextElement() {
    const { nextNodes } = this;
    nextNodes && this.scrollToElement(nextNodes.element, this.likeCurrentElement.bind(this));
  }

  onStartLM() {
    this.likeCurrentElement();
    this.scrollTimerID = setInterval(() => {
      const { maxLikes, likeNowCounter } = this.model.state;
      likeNowCounter < maxLikes ? this.likeNextElement() : this.stopLM();
    }, 1000);
  }

  startLM() {
    if (!this.play) {
      this.play = true;
      this.removeListSpace();
      this.onStartLM();
    }
  }

  pauseLM() {
    this.play = false;
    clearTimeout(this.scrollTimerID);
    this.addListSpace();
  }

  stopLM() {
    this.play = false;
    clearTimeout(this.scrollTimerID);
    this.addListSpace();
    this.model.resetLikeNowCounter();
  }

  onClickSpace(e) {
    const { currentNodes, nextNodes } = this;
    const topCurrentElement = currentNodes.element.getBoundingClientRect().top;
    if (topCurrentElement < 50 || topCurrentElement > 100) {
      this.scrollToElement(currentNodes.element, () => {console.log('stop current')});
    } else {
      nextNodes && this.scrollToElement(nextNodes.element, () => {console.log('stop next')});
    }
  }

  onClickUp(e) {
    const { currentNodes, prevNodes } = this;
    const topCurrentElement = currentNodes.element.getBoundingClientRect().top;
    prevNodes && this.scrollToElement(prevNodes.element, () => {console.log('stop prev')});
  }

  onClickDown(e) {
    const { currentNodes, nextNodes } = this;
    const topCurrentElement = currentNodes.element.getBoundingClientRect().top;
    nextNodes && this.scrollToElement(nextNodes.element, () => {console.log('stop prev')});
  }

  onDblclickSpace(e) {
    this.clickCurrentElement();
  }

  onSpace(e) {
    if (e.keyCode === 32 && e.target == document.body) {
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
  }

  onArrows(e) {
    if (e.keyCode === 40 && e.target == document.body) {
      e.preventDefault();
      this.onClickDown(e);
    }
    if (e.keyCode === 38 && e.target == document.body) {
      e.preventDefault();
      this.onClickUp(e);
    }
  }

  addListSpace() {
    window.onkeypress = this.onSpace.bind(this);
    window.onkeydown = this.onArrows.bind(this);
  }

  removeListSpace() {
    window.onkeypress = (e) => {
      if (e.keyCode == 32 && e.target == document.body) e.preventDefault();
    }
  }

  setHeightScroll() {
    const { delta, height } = this;
    this.top = height - delta;
    this.bottom = height + delta;
  }

  collectDataStart() {
    this.model.setInitState();
    this.numberingElements(() => {
      this.addListInsertElement();
      this.addListRemoveElement();
      this.model.currentHaveyElementNum = 0;
    });

    window.onscroll = () => {
      this.height = window.pageYOffset;
      if (this.height > this.bottom || this.height < this.top) {
        this.setHeightScroll();
        this.setCurrentElement();
      }
    }
  }

  collectDataStop() {
    window.onscroll = () => {};
    this.removeListInsertElement();
    this.removeListRemoveElement();
    const elementsNodes = this.model.elementsNodes;
    if (elementsNodes) {
      Object.keys(elementsNodes).foreEach((item) => {
        this.removeListElement(elementsNodes[item].element);
      })
    }
  }
}
