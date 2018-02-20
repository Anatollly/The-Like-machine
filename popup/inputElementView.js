import { languageMap } from './data';

export default class InputElementView {
  constructor(data) {
    this.data = data;
  }

  getElement(lang, value) {
    if (!this._element) {
      this._element = this.getElementFromTemplate(this.getMarkup(lang, value));
      this.bindHandlers();
    }
    return this._element;
  }

  get inputElement() {
    return this._element.querySelector('input');
  }

  get value() {
    try {
      return this.inputElement.value;
    } catch (e) {
      return 'value error';
    }
  }

  bindHandlers() {
    this.inputElement.addEventListener('input', this.onInput.bind(this));
  }

  removeHandlers() {
    this.inputElement.removeEventListener('input', this.onInput.bind(this));
  }

  onInput(e) {
    const label = this._element.querySelector('span');
    const re = new RegExp(this.data.regex);
    if (re.test(e.target.value)) {
      label.classList.remove('wrong');
    } else {
      label.classList.add('wrong');
    }
  }

  getMarkup(lang, value) {
    const numLang = languageMap[lang];
    return `
    <div class="input-group input-group-sm mb-3">
      <div class="input-group-prepend">
        <span class="input-group-text" id="basic-addon1" style="padding: 8px">
          ${this.data.label[numLang]}
        </span>
      </div>
      <input type="text" class="form-control" placeholder="${this.data.placeHolder[numLang]}" aria-label=${this.data.label[numLang]} aria-describedby="basic-addon1" style="margin-right: 20px" value=${value}>
    </div>
    `;
  }

  getElementFromTemplate(nodeElement) {
    const node = document.createElement('span');
    const trimElement = nodeElement.trim();
    node.innerHTML = trimElement;
    return node;
  }
}
