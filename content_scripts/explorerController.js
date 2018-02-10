import elementData from './elementData';

export default class ExplorerController {
  constructor(model) {
    this.model = model;
    this.countElement = 0;
    this.bodyElement = document.body;
  }

  get element() {
    return document.querySelector('._pfyik article');
  }

  get elementNodes() {
    return elementData(this.element).elementNodes;
  }

  get rightArrow() {
    return elementData(this.element).rightArrow;
  }

  get leftArrow() {
    return elementData(this.element).leftArrow;
  }

  addListInsertElement() {
    console.log('addListInsertElement body: ', this.bodyElement);
    this.bodyElement.addEventListener('DOMNodeInserted', this.onInsertElement.bind(this));
  };

  removeListInsertElement() {
    console.log('removeListInsertElement body: ', this.bodyElement);
    this.bodyElement.removeEventListener('DOMNodeInserted', this.onInsertElement.bind(this));
  }

  onInsertElement(e) {
    console.log('DOMNodeInserted');
    try {
      if (e.target.childNodes[0].classList[0] === '_pfyik') {
        console.log('open post');
        // this.removeListInsertElement();
      }
    } catch (e) {
      console.log('error');
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


}
