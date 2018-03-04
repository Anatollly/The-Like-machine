import elementData from './elementData';
import moment from 'moment';
import storage from './storage';
import parse from 'url-parse';

import {
  initialState,
  setCounterData,
  setSettingsData,
  setFavoritesData,
  setItemCounter,
  addElementData,
  delElementData,
  setElementItemData,
  addElementNodes,
  delElementNodes,
  setCurrentHaveyElementNum,
  setCurrentElement,
  setRemotePhoto,
  setError,
  setError400,
  setOnOffLm,
  setLikeNowCounter,
  setFullHearts,
  setFavorites,
  setCurrentTag,
  setUnlimitedData,
  setInitFavoritesData,
  setInitSettingsData,
  setInitCounterData,
  setDateLikeTodayData,
  setTodayMaxLikesData,
  setMaxFavoritesData,
  setInfoMessage
} from './data';

import {
  setCounterDB,
  setFavoritesDB,
  setSettingsDB,
  setUnlimitedDB,
  setDateLikeTodayDB,
  setInitSuperDB,
  setVersionDB,
  setInitDataDB
} from './firebase';

import {
  handleCurrentElement,
  handlePrevElement
} from './haveyCurrentElementView.js';

export default class Model {
  constructor(data, globalData, account, state = initialState) {
    this.data = data;
    this.globalData = globalData;
    this.account = account;
    this._state = state;
  }

  get state() {
    return this._state;
  }

  set onLikeTotal(handler) {
    this._onLikeTotal = handler;
  }

  set onLikeToday(handler) {
    this._onLikeToday = handler;
  }

  set onLikeNow(handler) {
    this._onLikeNow = handler;
  }

  set onViewElementSwitch(handler) {
    this._onViewElementSwitch = handler;
  }

  set onStyleViewElement(handler) {
    this._onStyleViewElement = handler;
  }

  set settings(settings) {
    this._state = setSettingsData(this._state, settings);
    setSettingsDB(this.account, this._state.settings);
  }

  set favorites(favorites) {
    this._state = setFavoritesData(this._state, favorites);
    setFavoritesDB(this.account, this._state.favorites);
  }

  set unlimited(unlimited) {
    this._state = setUnlimitedData(this._state, unlimited);
  }

  set fullHearts(fullHearts) {
    this._state = setFullHearts(this._state, fullHearts);
  }

  set dateLikeToday(dateLikeToday) {
    this._state = setDateLikeTodayData(this._state, dateLikeToday);
    setDateLikeTodayDB(this.account, this._state.dateLikeToday);
  }

  set todayMaxLikes(todayMaxLikes) {
    this._state = setTodayMaxLikesData(this._state, todayMaxLikes);
  }

  set maxFavorites(maxFavorites) {
    this._state = setMaxFavoritesData(this._state, maxFavorites);
  }

  set counter(data) {
    this._state = setCounterData(this._state, data);
    this._onLikeTotal(data.likeTotal);
    this._onLikeToday(data.likeToday);
    setCounterDB(this.account, this._state.counter);
  }

  set currentHaveyElementNum(num) {
    this.setCurrentHaveyElNum(num);
  }

  set currentElement(element) {
    this._state = setCurrentElement(this._state, element);
  }

  set remotePhoto(remotePhoto) {
    this._state = setRemotePhoto(this._state, remotePhoto);
  }

  set error(error) {
    this._state = setError(this._state, error);
  }

  set error400(error400) {
    this._state = setError400(this._state, error400);
  }

  set LMOn(LMOn) {
    this._state = setOnOffLm(this._state, LMOn);
  }

  set currentTag(currentTag) {
    this._state = setCurrentTag(this._state, currentTag);
  }

  set infoMessage(infoMessage) {
    this._state = setInfoMessage(this._state, infoMessage);
    chrome.runtime.sendMessage({ infoMessage });
  }

  setLimit() {
    if (this._state.version.unlimited) {
      this.todayMaxLikes = 5000;
      this.maxFavorites = 100;
      chrome.runtime.sendMessage({ unlimited: 'P' });
    } else {
      this.todayMaxLikes = 100;
      this.maxFavorites = 3;
      chrome.runtime.sendMessage({ unlimited: 'f' });
    }
  }

  setInitState() {
    if (this.data) {
      const { settings, counter , favorites, forceUnlimited, dateLikeToday } = this.data;
      const today = moment().format("DD-MM-YY");
      if (settings) this._state = setInitSettingsData(this._state, settings);
      if (counter) this._state = setInitCounterData(this._state, counter);
      if (favorites) this._state = setInitFavoritesData(this._state, favorites);
      if (forceUnlimited) this.unlimited = true;
      this.setLimit();
      if (dateLikeToday !== today) {
        this.dateLikeToday = today;
        this.resetTodayCounter();
      }
      setVersionDB(this.account, this._state.version);
    } else {
      const { settings, counter , favorites, version } = this._state;
      const initDataDB = {
        counter,
        favorites,
        settings,
        version,
        dateLikeToday: moment().format("DD-MM-YY"),
        forceUnlimited: false,
        createAccount: moment().format("DD-MM-YY_HH:mm:ss")
      };
      setInitDataDB(this.account, initDataDB);
    }
    localStorage.getItem('LMOn') === 'true' ? this.switchOnLM() : this.switchOffLM();
    this._onLikeNow(0);
  }

  setInitPopupState() {
    const { settings, favorites, LMOn, infoMessage } = this._state;
    chrome.runtime.sendMessage({ settingsState: settings, favoritesState: favorites, LMOn, infoMessage });
  }

  setPopupSettings(popupData) {
    const { elementsNodes, currentHaveyElementNum, settings } = this._state;
    const { currentPhotoColor, viewElementColor, viewElementSwitch, viewElementPosition, pageZoom } = popupData;
    this.settings = popupData;
    chrome.runtime.sendMessage({ settingsState: this._state.settings });
    const currentNodes = elementsNodes[currentHaveyElementNum];
    currentNodes && handleCurrentElement(currentNodes.element, currentPhotoColor);
    this._onStyleViewElement(viewElementColor, viewElementPosition);
    this._onViewElementSwitch(viewElementSwitch);
    if (settings.pageZoom !== pageZoom) chrome.runtime.sendMessage({ pageZoom });
  }

  resetPopupSettings() {
    this.settings = initialState.settings
    const {
      elementsNodes,
      currentHaveyElementNum,
      settings: {
        currentPhotoColor,
        viewElementColor,
        viewElementSwitch,
        viewElementPosition,
        pageZoom
      }
    } = this._state;
    chrome.runtime.sendMessage({ settingsState: this._state.settings });
    this._onStyleViewElement(viewElementColor, viewElementPosition);
    this._onViewElementSwitch(viewElementSwitch);
    chrome.runtime.sendMessage({ pageZoom });
    const currentNodes = elementsNodes[currentHaveyElementNum];
    currentNodes && handleCurrentElement(currentNodes.element, currentPhotoColor);
    this.infoMessage = 'Reset settings';
  }

  setCurrentHaveyElNum(num) {
    const { elementsNodes, currentHaveyElementNum, settings, LMOn } = this._state;
    const prevElementNodes = elementsNodes[currentHaveyElementNum];
    LMOn && prevElementNodes && handlePrevElement(prevElementNodes.element);
    this._state = setCurrentHaveyElementNum(this._state, num);
    this.currentElement = elementsNodes[num].element;
    LMOn && handleCurrentElement(elementsNodes[num].element, settings.currentPhotoColor);
  }

  saveFavorites() {
    try {
      let { type, name, link } = this._state.currentTag;
      if (Object.keys(this._state.favorites[type]).length < this._state.version.maxFavorites) {
        if (type === 'photos') {
          const userName = elementData(this._state.currentElement).userName.replace(/[.,#$\/\[\]]/g, '_');
          const date = moment(elementData(this._state.currentElement).dateCreate).format("DD-MM-YYYY_HH:mm");
          name = `${userName}_${date}`;
          if (!link) link = elementData(this._state.currentElement).postLink;
        }
        this._state = setFavorites(this._state, type, { [name]: link});
        this.favorites = this._state.favorites;
        chrome.runtime.sendMessage({ favoritesState: this._state.favorites });
        this.infoMessage = `\"${decodeURI(name)}\" added to ${type}`;
      }
    } catch (e) {
    }
  }

  delFavoriteTag(type, name) {
    const { favorites } = this._state;
    delete favorites[type][name];
    this.favorites = favorites;
    chrome.runtime.sendMessage({ favoritesState: this._state.favorites });
  }

  addElNodes(element, num) {
    const nodes = elementData(element).elementNodes;
    this._state = addElementNodes(this._state, nodes, num);
  }

  delElNodes(num) {
    this._state = delElementNodes(this._state, num);
  }

  resetLikeNowCounter() {
    this._state = setLikeNowCounter(this._state, 0);
    this._onLikeNow(0);
  }

  resetCounter() {
    this.counter = { likeTotal: 0, likeToday: 0 };
  }

  resetTodayCounter() {
    this.counter = { likeTotal: this._state.counter.likeTotal, likeToday: 0 };
  }

  likeCurrentElement() {
    const currentElement = this._state.currentElement;
    const heartFull = elementData(currentElement).heartFull;
    if (!heartFull) {
      this.likeElement(currentElement);
      this.fullHearts = 0;
    } else {
      this.fullHearts = this.state.fullHearts + 1;
    }
  }

  likeElement(currentElement) {
    try {
      const image = elementData(currentElement).dblclickImageElement;
      const heart = elementData(currentElement).heartElement;
      image ? image.dispatchEvent(new MouseEvent('dblclick', {'bubbles': true})) : heart.click();
    } catch (e) {
    }
  }

  unlikeElement(currentElement) {
    try {
      elementData(currentElement).heartElement.click();
    } catch (e) {
    }
  }

  clickCurrentElement() {
    try {
      const currentElement = this._state.currentElement;
      const heartFull = elementData(currentElement).heartFull;
      heartFull ? this.unlikeElement(currentElement) : this.likeElement(currentElement);
    } catch (e) {
    }
  }


  onClick(element) {
    if (this._state.LMOn) {
      elementData(element).heartFull ? this.unlikeHeart(element) : this.likeHeart(element);
    }
  }

  onDblclick(element) {
    if (this._state.LMOn) {
      const postLink = elementData(element).postLink;
      // !this._state.elementsData.hasOwnProperty(postLink) && this.likeHeart(element);
      this.likeHeart(element);
    }
  }

  plusCounter() {
    const { likeNowCounter, counter: { likeTotal, likeToday } } = this._state;
    this.counter = {
      likeTotal: likeTotal + 1,
      likeToday: likeToday + 1
    }
    this._state = setLikeNowCounter(this._state, likeNowCounter + 1);
    this._onLikeTotal(likeTotal + 1);
    this._onLikeToday(likeToday + 1);
    this._onLikeNow(likeNowCounter + 1);
  }

  likeHeart(element) {
    this.plusCounter();
    const elData = elementData(element).elementData;
    this._state = addElementData(this._state, elData);
  }

  minusCounter() {
    const { likeNowCounter, counter: { likeTotal, likeToday } } = this._state;
    this.counter = {
      likeTotal: likeTotal - 1,
      likeToday: likeToday - 1
    }
    this._onLikeTotal(likeTotal - 1);
    this._onLikeToday(likeToday - 1);
  }

  unlikeHeart(element) {
    const elementName = elementData(element).postLink;
    this._state = delElementData(this._state, elementName);
  }

  saveImage() {
    const src = elementData(this._state.currentElement).imageSrc;
    if (src) {
      const link = document.createElement("a");
      link.setAttribute("href", src);
      link.setAttribute("download", "new-image-name.jpg");
      link.click();
      this.infoMessage = 'Photo downloaded';
    } else {
      this.infoMessage = 'No photo';
    }
  }

  errorOn() {
    const { viewElementPosition } = this._state.settings;
    this._onStyleViewElement('rgba(255,0,0,0.75)', viewElementPosition);
    this.error = true;
  }

  errorOff() {
    const { viewElementColor, viewElementPosition } = this._state.settings;
    this._onStyleViewElement(viewElementColor, viewElementPosition);
    this.error = false;
    this.infoMessage = ``;
  }

  error400On() {
    const { viewElementPosition } = this._state.settings;
    this._onStyleViewElement('rgba(255,0,0,0.9)', viewElementPosition);
    this.error400 = true;
  }

  error400Off() {
    const { viewElementColor, viewElementPosition } = this._state.settings;
    this._onStyleViewElement(viewElementColor, viewElementPosition);
    this.error400 = false;
    this.infoMessage = ``;
  }

  switchOnLM() {
    const {
      settings: {
        viewElementSwitch,
        viewElementColor,
        viewElementPosition,
        pageZoom
      },
      counter: {
        likeTotal,
        likeToday
      }
    } = this._state;
    this.LMOn = true;
    this._onViewElementSwitch(viewElementSwitch);
    this._onLikeTotal(likeTotal);
    this._onLikeToday(likeToday);
    this._onStyleViewElement(viewElementColor, viewElementPosition);
    chrome.runtime.sendMessage({ pageZoom });
    chrome.runtime.sendMessage({ LMOn: true });
    localStorage.setItem('LMOn', true);
  }

  switchOffLM() {
    const { elementsNodes, currentHaveyElementNum } = this._state;
    this.LMOn = false;
    this._onViewElementSwitch(false);
    chrome.runtime.sendMessage({ pageZoom: 1 });
    const prevElementNodes = elementsNodes[currentHaveyElementNum];
    prevElementNodes && handlePrevElement(prevElementNodes.element);
    chrome.runtime.sendMessage({ LMOn: false });
    localStorage.setItem('LMOn', false);
  }

  clickInstagramLink(link) {
    const a = document.createElement("a");
    a.setAttribute("href", `https://www.instagram.com${link}`);
    a.click();
  };

  startNextItemFavorites() {
    try {
      const { favoriteLinks, currentFavoriteLinkNum } = storage;
      if (currentFavoriteLinkNum < favoriteLinks.length - 1) {
        storage.currentFavoriteLinkNum = currentFavoriteLinkNum + 1;
        const currentLink = favoriteLinks[currentFavoriteLinkNum + 1];
        storage.currentLink = currentLink;
        this.infoMessage = `Waiting for next tag: ${this.state.settings.tagDelay} min`;
        this.timerStartNextItemFavoritesID = setTimeout(() => {
          this.clickInstagramLink(currentLink);
        }, this._state.settings.tagDelay * 60 * 1000);
      } else {
        storage.resetStorage();
        this.infoMessage = 'Stop: Favorites link';
      }
    } catch (e) {
      this.infoMessage = 'Error: Favorites link';
      clearTimeout(this.timerStartNextItemFavoritesID);
      storage.resetStorage();
    }
  }

  startFavorites(links) {
    storage.state = {
      playFavorites: true,
      favoriteLinks: links,
      currentFavoriteLinkNum: 0,
      currentLink: links[0]
    }
    this.infoMessage = 'Start: Favorites link';
    this.clickInstagramLink(links[0]);
  }

  openFullVersion() {
    const a = document.createElement("a");
    a.setAttribute("href", 'https://chrome.google.com/webstore/detail/like-machine/ncgclagijkcjkfbicolgamphegapbmba');
    a.setAttribute("target", '_blank');
    a.click();
  }
}
