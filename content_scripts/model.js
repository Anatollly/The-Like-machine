import elementData from './elementData';
import moment from 'moment';
import storage from './storage';

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
  setCurrentFavoriteLinkNum,
  setCurrentElement,
  // setPlayPhoto,
  setRemotePhoto,
  setPlayFavorites,
  setError403,
  setOnOffLm,
  setLikeNowCounter,
  setFavorites,
  setCurrentTag,
  setUnlimitedData,
  setInitFavoritesData,
  setInitSettingsData,
  setInitCounterData,
  setDateLikeTodayData,
  setTodayMaxLikesData,
  setMaxFavoritesData,
  setFavoriteLinks
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
    this.setCurrentEl(element);
  }

  set remotePhoto(remotePhoto) {
    this._state = setRemotePhoto(this._state, remotePhoto);
  }

  // set playFavorites(playFavorites) {
  //   this._state = setPlayFavorites(this._state, playFavorites);
  // }

  // set favoriteLinks(favoriteLinks) {
  //   this._state = setFavoriteLinks(this._state, favoriteLinks);
  // }

  // set currentFavoriteLinkNum(currentFavoriteLinkNum) {
  //   this._state = setCurrentFavoriteLinkNum(this._state, currentFavoriteLinkNum);
  // }

  set error403(error403) {
    this._state = setError403(this._state, error403);
  }

  set LMOn(LMOn) {
    this._state = setOnOffLm(this._state, LMOn);
  }

  set currentTag(currentTag) {
    this._state = setCurrentTag(this._state, currentTag);
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
    const { settings, favorites, error403, LMOn } = this._state;
    chrome.runtime.sendMessage({ settingsState: settings, favoritesState: favorites, error403, LMOn });
  }

  setPopupSettings(popupData) {
    const { elementsNodes, currentHaveyElementNum, settings, error403 } = this._state;
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
  }

  setCurrentHaveyElNum(num) {
    const { elementsNodes, currentHaveyElementNum, settings, LMOn } = this._state;
    const prevElementNodes = elementsNodes[currentHaveyElementNum];
    LMOn && prevElementNodes && handlePrevElement(prevElementNodes.element);
    this._state = setCurrentHaveyElementNum(this._state, num);
    this.setCurrentEl(elementsNodes[num].element);
    LMOn && handleCurrentElement(elementsNodes[num].element, settings.currentPhotoColor);
  }

  setCurrentEl(element) {
    this._state = setCurrentElement(this._state, element);
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
      }
    } catch (e) {
      console.log('save favorites fail');
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

  onClick(element) {
    if (this._state.LMOn) {
      elementData(element).heartFull ? this.unlikeHeart(element) : this.likeHeart(element);
    }
  }

  onDblclick(element) {
    if (this._state.LMOn) {
      const postLink = elementData(element).postLink;
      !this._state.elementsData.hasOwnProperty(postLink) && this.likeHeart(element);
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
    const link = document.createElement("a");
    link.setAttribute("href", src);
    link.setAttribute("download", "new-image-name.jpg");
    link.click();
  }

  error403On() {
    const { viewElementPosition } = this._state.settings;
    this._onStyleViewElement('rgba(255,0,0,0.75)', viewElementPosition);
    this.error403 = true;
    chrome.runtime.sendMessage({ error403: true });
  }

  error403Off() {
    const { viewElementColor, viewElementPosition } = this._state.settings;
    this._onStyleViewElement(viewElementColor, viewElementPosition);
    this.error403 = false;
    chrome.runtime.sendMessage({ error403: false });
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
      const { favoriteLinks, currentFavoriteLinkNum, playFavorites, currentLink } = storage;
      console.log('startNextItemFavorites: ', favoriteLinks, currentFavoriteLinkNum, playFavorites, currentLink);
      this.timerStartNextItemFavoritesID = setTimeout(() => {
        if (currentFavoriteLinkNum < favoriteLinks.length - 1) {
          storage.currentFavoriteLinkNum = currentFavoriteLinkNum + 1;
          storage.currentLink = favoriteLinks[currentFavoriteLinkNum + 1];
          this.clickInstagramLink(favoriteLinks[currentFavoriteLinkNum + 1]);
        } else {
          storage.resetStorage();
        }
      }, this._state.settings.tagDelay * 60 * 1000)
    } catch (e) {
      console.log('catch startNextItemFavorites');
      clearTimeout(this.timerStartNextItemFavoritesID);
      storage.resetStorage();
    }
  }

  startFavorites(links) {
    console.log('startFavorites: ', links);
    storage.state = {
      playFavorites: true,
      favoriteLinks: links,
      currentFavoriteLinkNum: 0,
      currentLink: links[0]
    }
    this.clickInstagramLink(links[0]);
  }
}
