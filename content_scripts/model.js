import elementData from './elementData';

import {
  initialState,
  setProfileData,
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
  setZoomPage,
  addElementData,
  delElementData,
  setElementItemData,
  addElementNodes,
  delElementNodes,
  setCurrentHaveyElementNum,
  setLikeNowCounter,
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
    console.log('state: ', this._state);
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

  set profileData(profileData) {
    this._state = setProfileData(this._state, profileData);
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

  set zoomPage(zoomPage) {
    this._state = setZoomPage(this._state, zoomPage);
  }

  set currentHaveyElementNum(num) {
    this.setCurrentHaveyElNum(num);
  }

  set counter(data) {
    this._state = setCounter(this._state, data);
    this._onLikeTotal(data.likeTotal);
    this._onLikeToday(data.likeToday);
  }

  setInitState() {
    const { viewElementSwitch, counter: { likeTotal, likeToday } } = this.data;
    this.profileData = this.data;
    this._onViewElementSwitch(viewElementSwitch);
    this._onLikeTotal(likeTotal);
    this._onLikeToday(likeToday);
    this._onLikeNow(0);
  }

  setInitPopupState() {
    this.profileData = this._state.profileData;
    chrome.runtime.sendMessage({ profileState: this._state.profileData });
  }

  setPopupState(popupData) {
    this.profileData = popupData;
    chrome.runtime.sendMessage({ profileState: this._state.profileData });
  }

  setCurrentHaveyElNum(num) {
    const { elementsNodes, currentHaveyElementNum } = this._state;
    handlePrevElement(elementsNodes[currentHaveyElementNum].element);
    this._state = setCurrentHaveyElementNum(this._state, num);
    handleCurrentElement(elementsNodes[num].element);
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
    this._state = setCounter(this._state, {
      likeTotal: 0,
      likeToday: 0
    });
  }

  resetCounterToday() {
    this._state = setItemCounter(this._state, 'likeToday', 0);
  }

  onClick(element) {
    const postLink = elementData(element).postLink;
    this._state.elementsData.hasOwnProperty(postLink) ? this.unlikeHeart(element) : this.likeHeart(element);
  }

  onClick(element) {
    const postLink = elementData(element).postLink;
    this._state.elementsData.hasOwnProperty(postLink) ? this.unlikeHeart(element) : this.likeHeart(element);
  }

  onDblclick(element) {
    const postLink = elementData(element).postLink;
    !this._state.elementsData.hasOwnProperty(postLink) && this.likeHeart(element);
  }

  likeHeart(element) {
    console.log('state: ', this._state);
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
    const { likeTotal, likeToday } = this._state.profileData.counter;
    this._state = setItemCounter(this._state, 'likeTotal', likeTotal - 1);
    this._state = setItemCounter(this._state, 'likeToday', likeToday - 1);
    this._onLikeTotal(likeTotal - 1);
    this._onLikeToday(likeToday - 1);
    const elementName = elementData(element).postLink;
    this._state = delElementData(this._state, elementName);
  }
}
