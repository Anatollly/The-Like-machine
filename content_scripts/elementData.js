import parse from 'url-parse';

class ElementData {
  constructor(element) {
    this.element = element;
    this._wrapImgElement = null;
    this._imageElement = null;
    this._userElement = null;
    this._locationElement = null;
    this._timeElement = null;
  }

  get heartElement() {
    return (
      this.element.querySelector('.coreSpriteHeartOpen')
      || this.element.querySelector('.coreSpriteHeartFull')
      || null
    );
  }

  get heartFull() {
    return this.element.querySelector('.coreSpriteHeartFull') ? true : false;
  }

  get commentElement() {
    return this.element.querySelector('.coreSpriteComment') || null;
  }

  get saveElement() {
    return (
      this.element.querySelector('.coreSpriteSaveOpen')
      || this.element.querySelector('.coreSpriteSaveFull')
      || null
    );
  }

  get saveFull() {
    return this.element.querySelector('.coreSpriteSaveFull') ? true : false;
  }

  get textareaElement() {
    return this.element.querySelector('._b6i0l textarea') || null;
  }

  get userElement() {
    if (!this._userElement) this._userElement = this.element.querySelector('._2g7d5') || null;
    return this._userElement;
  }

  get userName() {
    try {
      return this.userElement.innerHTML;
    } catch (e) {
      // console.log('No name');
    }
  }

  get userLink() {
    return this.userElement.href || null;
  }

  get locationElement() {
    if (!this._locationElement) this._locationElement = this.element.querySelector('._q8ysx') || null;
    return this._locationElement;
  }

  get locationName() {
    try {
      return this.locationElement.innerHTML;
    } catch (e) {
      // console.log('No location');
    }
  }

  get locationLink() {
    try {
      return this.locationElement.href;
    } catch (e) {
      // console.log('No location link');
    }
  }

  get wrapImgElement() {
    if (!this._wrapImgElement) {
      this._wrapImgElement = this.element.querySelector('._4rbun')
      || this.element.querySelector('._qzesf')
      || null;
    }
    return this._wrapImgElement;
  }

  get imageElement() {
    if (!this._imageElement) {
      this._imageElement = this.wrapImgElement.querySelector('img')
      || this.wrapImgElement.querySelector('video')
      || null;
    }
    return this._imageElement;
  }

  get description() {
    return this.imageElement.alt || '';
  }

  get dblclickImageElement() {
    return this.element.querySelector('._si7dy') || null;
  }

  get timeElement() {
    if (!this._timeElement) this._timeElement = this.element.querySelector('._djdmk');
    return this._timeElement;
  }

  get postLink() {
    const timeElement = this.timeElement;
    return timeElement && parse(this.timeElement.href, true).pathname || null;
  }

  get dateCreate() {
    return this.timeElement.querySelector('time').dateTime || 0;
  }

  get dateView() {
    return Date.now();
  }

  get rightArrow() {
    return document.querySelector('._pfyik .coreSpriteRightPaginationArrow');
  }

  get leftArrow() {
    return document.querySelector('._pfyik .coreSpriteLeftPaginationArrow');
  }

  get elementData() {
    const {
      userName,
      userLink,
      locationName,
      locationLink,
      description,
      heartFull,
      saveFull,
      postLink,
      dateCreate,
      dateView
    } = this;

    return {
      userName,
      userLink,
      locationName,
      locationLink,
      description,
      heartFull,
      saveFull,
      postLink,
      dateCreate,
      dateView
    };
  }

  get elementNodes() {
    const {
      element,
      heartElement,
      commentElement,
      saveElement,
      textareaElement,
      imageElement,
      wrapImgElement,
      dblclickImageElement
    } = this;

    return {
      element,
      heartElement,
      commentElement,
      saveElement,
      textareaElement,
      imageElement,
      wrapImgElement,
      dblclickImageElement
    };
  }

}

export default (element) => new ElementData(element);
