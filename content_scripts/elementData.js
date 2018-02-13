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

  get profile() {
    try {
      return document.querySelector('.coreSpriteDesktopNavProfile').href;
    } catch (e) {
      console.log('no profile');
    }
  }

  get heartElement() {
    return this.element.querySelector('.coreSpriteHeartOpen') || this.element.querySelector('.coreSpriteHeartFull');
  }

  get heartFull() {
    return this.element.querySelector('.coreSpriteHeartFull') ? true : false;
  }

  get commentElement() {
    return this.element.querySelector('.coreSpriteComment');
  }

  get saveElement() {
    return this.element.querySelector('.coreSpriteSaveOpen') || this.element.querySelector('.coreSpriteSaveFull');
  }

  get saveFull() {
    return this.element.querySelector('.coreSpriteSaveFull') ? true : false;
  }

  get textareaElement() {
    return this.element.querySelector('._b6i0l textarea');
  }

  get userElement() {
    if (!this._userElement) this._userElement = this.element.querySelector('._2g7d5');
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
    try {
      return this.userElement.href;
    } catch (e) {
      console.log('no userLink');
    }
  }

  get locationElement() {
    if (!this._locationElement) this._locationElement = this.element.querySelector('._q8ysx');
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
      this._wrapImgElement = this.element.querySelector('._4rbun') || this.element.querySelector('._qzesf');
    }
    return this._wrapImgElement;
  }

  get imageElement() {
    if (!this._imageElement) {
      this._imageElement = this.wrapImgElement.querySelector('img') || this.wrapImgElement.querySelector('video');
    }
    return this._imageElement;
  }

  get description() {
    try {
      return this.imageElement.alt;
    } catch (e) {
      console.log('no description');
    }
  }

  get imageSrc() {
    try {
      return this.imageElement.src;
    } catch (e) {
      console.log('no image src');
    }
  }

  get dblclickImageElement() {
    return this.element.querySelector('._si7dy');
  }

  get timeElement() {
    if (!this._timeElement) this._timeElement = this.element.querySelector('._djdmk');
    return this._timeElement;
  }

  get postLink() {
    try {
      return parse(this.timeElement.href, true).pathname;
    } catch (e) {
      console.log('no post link');
    }
  }

  get dateCreate() {
    try {
      return this.timeElement.querySelector('time').dateTime || 0;
    } catch (e) {
      console.log('no date create');
    }
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

  get rightChevron() {
    return this.element.querySelector('a.coreSpriteRightChevron');
  }

  get leftChevron() {
    return this.element.querySelector('a.coreSpriteLeftChevron');
  }

  get playElement() {
    return this.element.querySelector('a.videoSpritePlayButton');
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
      dateView,
      imageSrc
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
      dateView,
      imageSrc
    };
  }

  get elementNodes() {
    const {
      element,
      heartElement,
      commentElement,
      textareaElement,
      imageElement,
      wrapImgElement,
      dblclickImageElement,
      imageSrc
    } = this;

    return {
      element,
      heartElement,
      commentElement,
      textareaElement,
      imageElement,
      wrapImgElement,
      dblclickImageElement,
      imageSrc
    };
  }

}

export default (element) => new ElementData(element);
