export default class LmControllerView {
  constructor(controller) {
    this.head = document.querySelector('head');
    this.style = document.createElement('style');
    this.body = document.querySelector('body');
    this.switchController = controller;
  }

  get controller() {
    return this.switchController.controller;
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
    const { likeNowCounter, counter: { likeTotal, likeToday } } = this.controller.model.state;
    return `
      <div class="lm--count">
        <div class="lm--count-item lm--count-total">
          <p class="lm--count-name">Total:</p>
          <div class="lm--count-num">${likeTotal}</div>
          <div class="lm--count-heart"></div>
        </div>
        <div class="lm--count-item lm--count-today">
          <p class="lm--count-name">Today:</p>
          <div class="lm--count-num">${likeToday}</div>
          <div class="lm--count-heart"></div>
        </div>
        <div class="lm--count-item lm--count-now">
          <p class="lm--count-name">Now:</p>
          <div class="lm--count-num">${likeNowCounter}</div>
          <div class="lm--count-heart"></div>
        </div>
      </div>
      <form class="lm--form">
        <label for="lm--maxLikes">Maximum likes</label>
        <input type="text" id="lm--maxLikes">
        </br>
        <label for="lm--start">Start</label>
        <input type="button" id="lm--start">
        </br>
        <label for="lm--pause">Pause</label>
        <input type="button" id="lm--pause">
        </br>
        <label for="lm--stop">Stop</label>
        <input type="button" id="lm--stop">
      </form>
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
        background-color: rgba(100, 100, 100, 0.3);
    }
    `;
  }

  bindHandlers() {
    const { element, haveyLikeFunc } = this;
    console.log('element: ', element);
    const maxLikes = element.querySelector('#lm--maxLikes');
    maxLikes.value = this.controller.model.state.maxLikes;
    maxLikes.addEventListener('input', () => {
      this.controller.model.maxLikes = maxLikes.value * 1;
    });
    element.querySelector('#lm--start').addEventListener('click', () => {
      console.log('this.controller: ', this.controller);
      this.controller.startLM();
    });
    element.querySelector('#lm--pause').addEventListener('click', () => {
      this.controller.pauseLM();
    });
    element.querySelector('#lm--stop').addEventListener('click', () => {
      this.controller.stopLM();
    });
    this._totalElement = element.querySelector('.lm--count-total .lm--count-num');
    this._todayElement = element.querySelector('.lm--count-today .lm--count-num');
    this._nowElement = element.querySelector('.lm--count-now .lm--count-num');
    this.controller.model.onLikeTotal = this.setTotalLikes.bind(this);
    this.controller.model.onLikeToday = this.setTodayLikes.bind(this);
    this.controller.model.onLikeNow = this.setNowLikes.bind(this);
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

  addElement() {
    const { machineSwitch, head, style, body, element, haveyLikeFunc } = this;
    style.type = 'text/css';
    style.innerHTML = this.getStyle();
    head.appendChild(style);
    element.classList.add('lm--element');
    machineSwitch ? this.showElement() : this.hiddenElement();
    body.appendChild(element);
  }

  showElement() {
    this.element.removeAttribute('hidden');
  }

  hiddenElement() {
    this.element.setAttribute('hidden', true);
  }
}
