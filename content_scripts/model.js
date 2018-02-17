import elementData from './elementData';
import moment from 'moment';

import {
  initialState,
  setProfileData,
  setFavoritesData,
  setItemCounter,
  setCounter,
  setMaxLikes,
  setViewElementSwitch,
  setScrollSpeed,
  setScrollType,
  setLikeDelay,
  setScrollToUnlike,
  setDblclickInterval,
  setCurrentPhotoColor,
  setViewElementColor,
  setViewElementPosition,
  setPageZoom,
  addElementData,
  delElementData,
  setElementItemData,
  addElementNodes,
  delElementNodes,
  setCurrentHaveyElementNum,
  setCurrentElement,
  setLikeNowCounter,
  setFavoritesLocations,
  setFavoritesTags,
  setFavoritesPhotos,
  setFavoritesAccounts,
  setFavorites,
  setCurrentTag
} from './data';

import {
  handleCurrentElement,
  handlePrevElement
} from './haveyCurrentElementView.js';

export default class Model {
  constructor(data, state = initialState) {
    this.data = data;
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

  set profileData(profileData) {
    this._state = setProfileData(this._state, profileData);
  }

  set favorites(favorites) {
    this._state = setFavoritesData(this._state, favorites);
  }

  set maxLikes(num) {
    this._state = setMaxLikes(this._state, num);
  }

  set viewElementSwitch(bool) {
    this._state = setViewElementSwitch(this._state, bool);
    this._onViewElementSwitch(bool);
  }

  set scrollSpeed(scrollSpeed) {
    this._state = setScrollSpeed(this._state, scrollSpeed);
  }

  set scrollType(scrollType) {
    this._state = setScrollType(this._state, scrollType);
  }

  set likeDelay(likeDelay) {
    this._state = setLikeDelay(this._state, likeDelay);
  }

  set scrollToUnlike(scrollToUnlike) {
    this._state = setScrollToUnlike(this._state, scrollToUnlike);
  }

  set dblclickInterval(dblclickInterval) {
    this._state = setDblclickInterval(this._state, dblclickInterval);
  }

  set currentPhotoColor(currentPhotoColor) {
    this._state = setCurrentPhotoColor(this._state, currentPhotoColor);
  }

  set viewElementColor(viewElementColor) {
    this._state = setViewElementColor(this._state, viewElementColor);
  }

  set viewElementPosition(viewElementPosition) {
    this._state = setViewElementPosition(this._state, viewElementPosition);
  }

  set pageZoom(pageZoom) {
    this._state = setPageZoom(this._state, pageZoom);
  }

  set currentHaveyElementNum(num) {
    this.setCurrentHaveyElNum(num);
  }

  set currentElement(element) {
    this.setCurrentEl(element);
  }

  set currentTag(currentTag) {
    console.log('currentTag: ', currentTag);
    this._state = setCurrentTag(this._state, currentTag);
  }


  set counter(data) {
    this._state = setCounter(this._state, data);
    this._onLikeTotal(data.likeTotal);
    this._onLikeToday(data.likeToday);
  }

  setInitState() {
    const {
      viewElementSwitch,
      viewElementColor,
      viewElementPosition,
      pageZoom,
      counter: {
        likeTotal,
        likeToday
      }
    } = this.data.profileData;
    this.profileData = this.data.profileData;
    this.favorites = this.data.favorites;
    this._onViewElementSwitch(viewElementSwitch);
    this._onLikeTotal(likeTotal);
    this._onLikeToday(likeToday);
    this._onLikeNow(0);
    this._onStyleViewElement(viewElementColor, viewElementPosition);
    chrome.runtime.sendMessage({ pageZoom });
  }

  setInitPopupState() {
    this.profileData = this._state.profileData;
    console.log('initState: ', this._state.profileData);
    chrome.runtime.sendMessage({ profileState: this._state.profileData, favoritesState: this._state.favorites });
    // handleCurrentElement(elementsNodes[num].element, this._state.profileData.currentPhotoColor);
  }

  setPopupState(popupData) {
    const { elementsNodes, currentHaveyElementNum, profileData } = this._state;
    const { currentPhotoColor, viewElementColor, viewElementSwitch, viewElementPosition, pageZoom } = popupData;
    console.log('pageZoom: ', pageZoom);
    this.profileData = popupData;
    chrome.runtime.sendMessage({ profileState: this._state.profileData });
    handleCurrentElement(elementsNodes[currentHaveyElementNum].element, currentPhotoColor);
    this._onStyleViewElement(viewElementColor, viewElementPosition);
    this._onViewElementSwitch(viewElementSwitch);
    if (profileData.pageZoom !== pageZoom) chrome.runtime.sendMessage({ pageZoom });
  }

  resetSettings() {
    const { counter } = this._state.profileData;
    this.profileData = initialState.profileData
    this.counter = counter;
    chrome.runtime.sendMessage({ profileState: this._state.profileData });
  }

  setCurrentHaveyElNum(num) {
    const { elementsNodes, currentHaveyElementNum } = this._state;
    const prevElementNodes = elementsNodes[currentHaveyElementNum];
    prevElementNodes && handlePrevElement(prevElementNodes.element);
    this._state = setCurrentHaveyElementNum(this._state, num);
    this.setCurrentEl(elementsNodes[num].element);
    handleCurrentElement(elementsNodes[num].element, this._state.profileData.currentPhotoColor);
  }

  setCurrentEl(element) {
    this._state = setCurrentElement(this._state, element);
  }

  // addFavoriteLocation(locationName, locationLink) {
  //   const locations = Object.assign({}, this._state.favorites.locations, { [locationName]: locationLink });
  //   console.log('locations: ', locations);
  //   this._state = setFavoritesLocations(this._state, locations);
  // }
  //
  // delFavoriteLocation(loactionName) {
  //   const locations = this._state.favorites.locations;
  //   delete locations[loactionName];
  //   this._state = setFavoritesLocations(this._state, locations);
  // }
  //
  // addFavoriteTag(tagName, tagLink) {
  //   const tags = Object.assign({}, this._state.favorites.tags, { [tagName]: tagLink });
  //   this._state = setFavoritesTags(this._state, tags);
  // }

  // delFavoriteTag(tagName) {
  //   const tags = this._state.favorites.tags;
  //   delete tags[tagName];
  //   this._state = setFavoritesLocations(this._state, tags);
  // }
  //
  // addFavoritePhoto(photoName, photoLink) {
  //   const photos = Object.assign({}, this._state.favorites.photos, { [photoName]: photoLink });
  //   console.log('photos: ', photos);
  //   this._state = setFavoritesPhotos(this._state, photos);
  // }
  //
  // delFavoritePhoto(photoName) {
  //   const photos = this._state.favorites.photos;
  //   delete photos[photoName];
  //   this._state = setFavoritesLocations(this._state, photos);
  // }
  //
  // addFavoriteAccount(accountName, accountLink) {
  //   const accounts = Object.assign({}, this._state.favorites.accounts, { [accountName]: accountLink });
  //   console.log('accounts: ', accounts);
  //   this._state = setFavoritesAccounts(this._state, accounts);
  // }

  saveFavorites() {
    try {
      let { type, name, link } = this._state.currentTag;
      if (type === 'photos') {
        const date = moment(elementData(this._state.currentElement).dateCreate).format("DD-MM-YYYY_HH:mm");
        name = `${elementData(this._state.currentElement).userName}_${date}`;
        if (!link) link = elementData(this._state.currentElement).postLink;
      }
      this._state = setFavorites(this._state, type, { [name]: link});
      console.log(' favorites: ', this._state.favorites);
      chrome.runtime.sendMessage({ favoritesState: this._state.favorites });
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

  // delFavoriteAccount(accountName) {
  //   const accounts = this._state.favorites.accounts;
  //   delete accounts[accountName];
  //   this._state = setFavoritesLocations(this._state, accounts);
  // }

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
    this._state = setCounter(this._state, {
      likeTotal: 0,
      likeToday: 0
    });
  }

  resetCounterToday() {
    this._state = setItemCounter(this._state, 'likeToday', 0);
  }

  onClick(element) {
    elementData(element).heartFull ? this.unlikeHeart(element) : this.likeHeart(element);
  }

  onDblclick(element) {
    const postLink = elementData(element).postLink;
    !this._state.elementsData.hasOwnProperty(postLink) && this.likeHeart(element);
  }

  likeHeart(element) {
    console.log('likeHeart');
    const { likeNowCounter, profileData: { counter: { likeTotal, likeToday } } } = this._state;
    this._state = setItemCounter(this._state, 'likeTotal', likeTotal + 1);
    this._state = setItemCounter(this._state, 'likeToday',likeToday + 1);
    this._state = setLikeNowCounter(this._state, likeNowCounter + 1);
    this._onLikeTotal(likeTotal + 1);
    this._onLikeToday(likeToday + 1);
    this._onLikeNow(likeNowCounter + 1);
    const elData = elementData(element).elementData;
    this._state = addElementData(this._state, elData);
  }

  unlikeHeart(element) {
    console.log('unlikeHeart');
    const { likeTotal, likeToday } = this._state.profileData.counter;
    this._state = setItemCounter(this._state, 'likeTotal', likeTotal - 1);
    this._state = setItemCounter(this._state, 'likeToday', likeToday - 1);
    this._onLikeTotal(likeTotal - 1);
    this._onLikeToday(likeToday - 1);
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
}
