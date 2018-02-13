export const initialState = {
  profileData: {
    counter: {
      likeTotal: 0,
      likeToday: 0
    },
    maxLikes: 0,
    viewElementSwitch: false,
    version: 'free',
    scrollSpeed: 800,
    scrollType: 'out-expo',
    likeDelay: 500,
    scrollToUnlike: true,
    dblclickInterval: 300,
    currentPhotoColor: 'rgba(100, 100, 100, 0.3)',
    viewElementColor: 'rgba(100, 100, 100, 0.5)',
    viewElementPosition: 'top-right',
    zoomPage: 0
  },
  elementsData: {},
  elementsNodes: {},
  currentHaveyElementNum: 0,
  likeNowCounter: 0,
};

export const setProfileData = (data, profileData) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof profileData !== 'object') throw new Error('Invalid data type. Arguments: "profileData"');
  return Object.assign({}, data, { profileData });
};

export const setItemCounter = (data, item, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof item !== 'string') throw new Error('Invalid data type. Arguments: "item"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  data.profileData.counter[item] = num;
  return Object.assign({}, data);
};

export const setCounter = (data, counter) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof counter !== 'object') throw new Error('Invalid data type. Arguments: "counter"');
  return Object.assign({}, data, { profileData: { counter }});
};

export const setMaxLikes = (data, maxLikes) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof maxLikes !== 'number') throw new Error('Invalid data type. Arguments: "maxLikes"');
  if (maxLikes < 0) throw new Error('Element number can not be less than zero. Number: ' + maxLikes);
  return Object.assign({}, data, { profileData: { maxLikes }});
}

export const setViewElementSwitch = (data, viewElementSwitch) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof viewElementSwitch !== 'boolean') throw new Error('Invalid data type. Arguments: "viewElementSwitch"');
  return Object.assign({}, data, { profileData: { viewElementSwitch }});
}

export const setScrollSpeed = (data, scrollSpeed) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof scrollSpeed !== 'number') throw new Error('Invalid data type. Arguments: "scrollSpeed"');
  if (scrollSpeed < 0) throw new Error('Element number can not be less than zero. Number: ' + scrollSpeed);
  return Object.assign({}, data, { profileData: { scrollSpeed }});
}

export const setScrollType = (data, scrollType) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof scrollType !== 'string') throw new Error('Invalid data type. Arguments: "scrollType"');
  return Object.assign({}, data, { profileData: { scrollType }});
}

export const setLikeDelay = (data, likeDelay) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof likeDelay !== 'number') throw new Error('Invalid data type. Arguments: "likeDelay"');
  if (likeDelay < 0) throw new Error('Element number can not be less than zero. Number: ' + likeDelay);
  return Object.assign({}, data, { profileData: { likeDelay }});
}

export const setScrollToUnlike = (data, scrollToUnlike) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof scrollToUnlike !== 'boolean') throw new Error('Invalid data type. Arguments: "scrollToUnlike"');
  return Object.assign({}, data, { profileData: { scrollToUnlike }});
}

export const setDblclickInterval = (data, dblclickInterval) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof dblclickInterval !== 'number') throw new Error('Invalid data type. Arguments: "dblclickInterval"');
  if (dblclickInterval < 0) throw new Error('Element number can not be less than zero. Number: ' + dblclickInterval);
  return Object.assign({}, data, { profileData: { dblclickInterval }});
}

export const setCurrentPhotoColor = (data, currentPhotoColor) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof currentPhotoColor !== 'string') throw new Error('Invalid data type. Arguments: "currentPhotoColor"');
  return Object.assign({}, data, { profileData: { currentPhotoColor }});
}

export const setViewElementColor = (data, viewElementColor) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof viewElementColor !== 'string') throw new Error('Invalid data type. Arguments: "viewElementColor"');
  return Object.assign({}, data, { profileData: { viewElementColor }});
}

export const setViewElementPosition = (data, viewElementPosition) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof viewElementPosition !== 'string') throw new Error('Invalid data type. Arguments: "viewElementPosition"');
  return Object.assign({}, data, { profileData: { viewElementPosition }});
}

export const setZoomPage = (data, zoomPage) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof zoomPage !== 'string') throw new Error('Invalid data type. Arguments: "zoomPage"');
  return Object.assign({}, data, { profileData: { zoomPage }});
}



export const addElementData = (data, element) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof element !== 'object') throw new Error('Invalid data type. Arguments: "element"');
  if (!element) throw new Error('Element data lost');
  data.elementsData[element.postLink] = element;
  return Object.assign({}, data);
};

export const delElementData = (data, elementName) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof elementName !== 'string') throw new Error('Invalid data type. Arguments: "elementName"');
  const newData = delete data.elementsData[elementName];
  return Object.assign({}, data);
}

export const setElementItemData = (data, element, item, value) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof item !== 'string') throw new Error('Invalid data type. Arguments: "item"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  if (!item) throw new Error('Element item lost');
  data.elementsData[element.postLink][item] = value;
  return Object.assign({}, data);
}

export const addElementNodes = (data, nodes, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof nodes !== 'object') throw new Error('Invalid data type. Arguments: "nodes"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  if (!nodes) throw new Error('Element nodes lost');
  // if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  data.elementsNodes[num] = nodes;
  return Object.assign({}, data);
};

export const delElementNodes = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  // if (!data.elementsNodes[num]) throw new Error('Element to delete does not exist. Number ' + num);
  // if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  const del = delete data.elementsNodes[num];
  if (!del) console.log('Error delete');
  return Object.assign({}, data);
};

export const setCurrentHaveyElementNum = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  // if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  return Object.assign({}, data, { currentHaveyElementNum: num });
};

export const setLikeNowCounter = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  // if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  return Object.assign({}, data, { likeNowCounter: num });
}
