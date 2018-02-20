import elementData from './elementData';

export default class ExploreController {
  constructor(model) {
    this.model = model;
  }

  get haveyElement() {
    this._haveyElement = document.querySelector('._havey');
    return this._haveyElement;
  }

  get firstPhoto() {
    this._firstPhoto = this.haveyElement.querySelector('a div');
    return this._firstPhoto;
  }

  startLM() {
    this.model.playPhoto = true;
    this.firstPhoto.click();
  }

  pauseLM() {

  }

  stopLM() {

  }

}
