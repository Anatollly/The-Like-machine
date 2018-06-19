export default class LmControllerView {
  constructor(controller) {
    this.head = document.querySelector('head');
    this.style = document.createElement('style');
    this.body = document.querySelector('body');
    this.model = controller.model;
  }

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
    return (`
      <div class="lm--count">
        <div class="lm--count-item lm--count-total">
          <p class="lm--count-name">Total:</p>
          <div class="lm--count-numHeart">
            <div class="lm--count-num"></div>
            <div class="lm--count-heart"></div>
          </div>
        </div>
        <div class="lm--count-item lm--count-today">
          <p class="lm--count-name">Today:</p>
          <div class="lm--count-numHeart">
            <div class="lm--count-num"></div>
            <div class="lm--count-heart"></div>
          </div>
        </div>
        <div class="lm--count-item lm--count-now">
          <p class="lm--count-name">Now:</p>
          <div class="lm--count-numHeart">
            <div class="lm--count-num"></div>
            <div class="lm--count-heart"></div>
          </div>
        </div>
      </div>
      `);
  }

  getStyle() {
    return `
      .lm--element {
        font-size: 20px;
        line-height: 24px;
        position: fixed;
        width: 180px;
        height: 130px;
        z-index: 1000000;
        padding: 10px;
        border: 1px solid rgba(0,0,0,0.5);
        border-radius: 10px;
      }
      .lm--count-name {
        height: 24px;
        margin: 0;
      }
      .lm--count-item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 10px 0;
        height: 24px;
      }
      .lm--count-heart {
        background-position: -225px -352px;
        background-size: 429px 401px;
        height: 24px;
        width: 24px;
        margin: 0 0 0 5px;
      }
      .lm--count-numHeart {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
      }
    `;
  }

  bindHandlers() {
    const { element } = this;
    this._totalElement = element.querySelector('.lm--count-total');
    this._todayElement = element.querySelector('.lm--count-today');
    this._nowElement = element.querySelector('.lm--count-now');
    this._totalCounter = element.querySelector('.lm--count-total .lm--count-num');
    this._todayCounter = element.querySelector('.lm--count-today .lm--count-num');
    this._nowCounter = element.querySelector('.lm--count-now .lm--count-num');
    this.model.onLikeTotal = this.setTotalLikes.bind(this);
    this.model.onLikeToday = this.setTodayLikes.bind(this);
    this.model.onLikeNow = this.setNowLikes.bind(this);
    this.model.onViewElementSwitch = this.setViewElementSwitch.bind(this);
    this.model.onStyleViewElement = this.setStyleViewElement.bind(this);
  }

  setTotalLikes(num) {
    this._totalCounter.innerHTML = num;
  }

  setTodayLikes(num) {
    this._todayCounter.innerHTML = num;
  }

  setNowLikes(num) {
    this._nowCounter.innerHTML = num;
  }

  setViewElementSwitch(bool) {
    bool ? this.showElement() : this.hiddenElement();
  }

  setStyleViewElement(color, position) {
    this._element.style = `background-color: ${color}; ${position} `;
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
