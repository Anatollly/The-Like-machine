import elementData from './elementData';

export function checkTodayLikes(likeToday, todayMaxLikes) {
  return new Promise((resolve, reject) => {
    if (likeToday <= todayMaxLikes) {
      resolve();
    } else {
      reject('limitLikes');
    }
  })
}

export function checkFullHearts(fullHearts, numFullHearts) {
  return new Promise((resolve, reject) => {
    if (fullHearts + 1 <= numFullHearts) {
      resolve();
    } else {
      reject('fullHearts');
    }
  })
}

export function checkLikes(likeNowCounter, maxLikes) {
  return new Promise((resolve, reject) => {
    if (likeNowCounter % 50 === 0 && likeNowCounter !== 0) {
      reject('50likes');
    } else if (likeNowCounter < maxLikes) {
      resolve();
    } else {
      reject('maxLikes');
    }
  })
}

export function checkError(error400, error) {
  return new Promise((resolve, reject) => {
    if (error400) {
      reject('error400');
    } else if (error) {
      reject('error');
    } else {
      resolve();
    }
  })
}
