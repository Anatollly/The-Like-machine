import { languageMap } from './data';

export default class SelectElementView {
  constructor(data) {
    this.data = data;
  }

  getElement(lang, selectedValue) {
    if (!this._element) {
      this._element = this.getElementFromTemplate(this.getMarkup(lang, selectedValue));
    }
    return this._element;
  }

  get value() {
    try {
      const select = this._element.querySelector('select');
      return select.options[select.selectedIndex].value;
    } catch (e) {
      return 'value error';
    }
  }

  getOptions(lang, selectedValue) {
    const { options } = this.data;
    const numLang = languageMap[lang];
    let content = '';
    for (var [key, value] of options) {
      content += `
        <option value="${key}" ${key === selectedValue && "selected"}>
          ${value instanceof Array ? value[numLang] : value}
        </option>`;
    }
    return content;
  }

  getMarkup(lang, selectedValue) {
    const numLang = languageMap[lang];
    return `
      <div class="input-group input-group-sm mb-3">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputGroupSelect01">
            ${this.data.label[numLang]}
          </label>
        </div>
        <select class="custom-select" id="inputGroupSelect01" style="margin-right: 20px">
          ${this.getOptions(lang, selectedValue)}
        </select>
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
