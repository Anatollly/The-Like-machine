import elementData from './elementData';

import {
  addElementData,
  delElementData,
  setElementItemData,
  pushElementCoordinates,
  addElementNodes,
  delElementNodes,
  setCurrentHaveyElementNum,
  setMaxLikes,
  setLikeNowCounter,
  setItemCounter,
  setCounter,
  initialState,
  setLargestElementNumber
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

  set currentHaveyElementNum(num) {
    this.setCurrentHaveyElNum(num);
  }

  set maxLikes(num) {
    this._state = setMaxLikes(this._state, num);
  }

  set largestElementNumber(num) {
    this._state = setLargestElementNumber(this._state, num);
  }

  setInitState() {
    this._state = setCounter(this._state, this.data.counter);
    this._state = setMaxLikes(this._state, this.data.maxLikes);
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
      likeToday: 0,
      saveAll: 0,
      saveToday: 0
    });
  }

  resetCounterToday() {
    this._state = setItemCounter(this._state, 'likeToday', 0);
    this._state = setItemCounter(this._state, 'saveToday', 0);
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
    // console.log('likeHeart: ', element);
    const { likeNowCounter, counter: { likeTotal, likeToday } } = this._state;
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
    // console.log('unlikeHeart: ', element);
    const { likeTotal, likeToday } = this._state.counter;
    this._state = setItemCounter(this._state, 'likeTotal', likeTotal - 1);
    this._state = setItemCounter(this._state, 'likeToday', likeToday - 1);
    this._onLikeTotal(likeTotal - 1);
    this._onLikeToday(likeToday - 1);
    const elementName = elementData(element).postLink;
    this._state = delElementData(this._state, elementName);
  }
}
