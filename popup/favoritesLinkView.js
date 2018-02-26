import { languageMap } from './data';

class FavoritesLinkView {
  constructor(data, index, dataCheckBoxes) {
    this.data = data;
    this.index = index;
    this.dataCheckBoxes = dataCheckBoxes;
  }

  get element() {
    if (!this._element) {
      this._element = this.getElementFromTemplate(this.getMarkup());
      this.bindHandlers()
    }
    return this._element;
  }

  getMarkup() {
    // const numLang = languageMap[lang];
    let tabContent = '';
    Object.keys(this.data).forEach((itemTab, iTab) => {
      let btnContent = '';
      Object.keys(this.data[itemTab]).forEach((itemBtn, iBtn) => {
        const link = `${this.data[itemTab][itemBtn]}`;
        const checked = this.dataCheckBoxes && this.dataCheckBoxes.indexOf(link) !== -1;
        btnContent += `
          ${
            (itemTab === 'locations' || itemTab === 'tags')
              ? `<div class="form-check form-check-inline lm--favorites-checkbox">
                  <input class="form-check-input" ${checked ? 'checked' : ''} type="checkbox" value="${link}" style="margin-right: 0">
                </div>`
              : '<div class="form-check form-check-inline lm--favorites-checkbox" style="width: 3"></div>'
          }
          <a class="btn btn-info btn-sm active lm--favorites-link" style="text-align: left" role="button" aria-pressed="true" data-type="link" data-link="${link}">${itemTab === 'tags' ? "#" : ""}${decodeURI(itemBtn)}</a>
          <a href="#" class="btn btn-danger btn-sm active lm--favorites-delete" role="button" aria-pressed="true" data-type="delete" data-tab="${itemTab}" data-item="${itemBtn}">Delete</a>
        `
      })
      tabContent += `<div class="tab-pane fade ${this.index === iTab ? "active show" : ""}" id="pills-${itemTab}" role="tabpanel" aria-labelledby="pills-${itemTab}-tab">${btnContent}</div>`
    })
    return tabContent;
  }

  bindHandlers() {

  }

  getElementFromTemplate(nodeElement) {
    const node = document.createElement('span');
    const trimElement = nodeElement.trim();
    node.innerHTML = trimElement;
    return node;
  }
}

export default (data, index, dataCheckBoxes) => new FavoritesLinkView(data, index, dataCheckBoxes).element;
