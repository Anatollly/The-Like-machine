export default class LmControllerView {
  constructor(controller) {
    this.head = document.querySelector('head');
    this.style = document.createElement('style');
    this.body = document.querySelector('body');
    // this.switchController = controller;
    this.model = controller.model;
  }

  // get controller() {
  //   return this.switchController.controller;
  // }

  get element() {
    if (!this._element) {
      this._element = this.getElementFromTemplate(this.getMarkup());
      this.bindHandlers();
    }
    return this._element;
  }

  getElementFromTemplate(nodeElement) {
    const node = document.createElement('span');
    const trimElement = nodeElement.trim();
    node.innerHTML = trimElement;
    return node;
  }



  getMarkup() {
    return `
      <div class="lm--count">
        <div class="lm--count-item lm--count-total">
          <p class="lm--count-name">Total:</p>
          <div class="lm--count-num"></div>
          <div class="lm--count-heart"></div>
        </div>
        <div class="lm--count-item lm--count-today">
          <p class="lm--count-name">Today:</p>
          <div class="lm--count-num"></div>
          <div class="lm--count-heart"></div>
        </div>
        <div class="lm--count-item lm--count-now">
          <p class="lm--count-name">Now:</p>
          <div class="lm--count-num"></div>
          <div class="lm--count-heart"></div>
        </div>
      </div>
      `;
  }

  getStyle() {
    return `
      .lm--element {
        position: fixed;
        width: 100px;
        height: 166px;
        right: 50px;
        bottom: 50px;
        z-index: 1000000;
        background-color: rgba(100, 100, 100, 0.2);
    }
    `;
  }

  bindHandlers() {
    const { element } = this;
    this._totalElement = element.querySelector('.lm--count-total .lm--count-num');
    this._todayElement = element.querySelector('.lm--count-today .lm--count-num');
    this._nowElement = element.querySelector('.lm--count-now .lm--count-num');
    this.model.onLikeTotal = this.setTotalLikes.bind(this);
    this.model.onLikeToday = this.setTodayLikes.bind(this);
    this.model.onLikeNow = this.setNowLikes.bind(this);
    this.model.onViewElementSwitch = this.setViewElementSwitch.bind(this);
    this.model.onStyleViewElement = this.setStyleViewElement.bind(this);
  }

  setTotalLikes(num) {
    this._totalElement.innerHTML = num;
  }

  setTodayLikes(num) {
    this._todayElement.innerHTML = num;
  }

  setNowLikes(num) {
    this._nowElement.innerHTML = num;
  }

  setViewElementSwitch(bool) {
    bool ? this.showElement() : this.hiddenElement();
  }

  setStyleViewElement(color, position) {
    this.element.style = `background-color: ${color}; ${position} `;
  }

  addElement() {
    const { head, style, body, element } = this;
    style.type = 'text/css';
    style.innerHTML = this.getStyle();
    head.appendChild(style);
    element.classList.add('lm--element');
    body.appendChild(element);
  }

  showElement() {
    this.element.removeAttribute('hidden');
  }

  hiddenElement() {
    this.element.setAttribute('hidden', true);
  }
}
