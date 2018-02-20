export const initialState = {
  counter: {
    likeTotal: 0,
    likeToday: 0
  },
  settings: {
    maxLikes: 50,
    viewElementSwitch: false,
    scrollSpeed: 700,
    scrollType: 'out-expo',
    likeDelay: 500,
    dblclickInterval: 300,
    currentPhotoColor: 'rgba(0,128,128,0.3)',
    viewElementColor: 'rgba(0,128,128,0.3)',
    viewElementPosition: 'left:20px;bottom:80px;',
    pageZoom: 1,
    language: 'english'
  },
  favorites: {
    locations: {},
    tags: {},
    accounts: {},
    photos: {}
  },
  elementsData: {},
  elementsNodes: {},
  currentHaveyElementNum: 0,
  likeNowCounter: 0,
  currentElement: null,
  playPhoto: false,
  error403: false,
  LMOn: false,
  currentTag: {
    type: '',
    name: '',
    link: ''
  }
};

export const setInitFavoritesData = (data, dataDB) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof dataDB !== 'object') throw new Error('Invalid data type. Arguments: "dataDB"');
  const favorites = {
    locations: {},
    tags: {},
    accounts: {},
    photos: {}
  };
  Object.keys(favorites).forEach((item, i) => {
    dataDB[item] && Object.keys(dataDB[item]).forEach((item2, i2) => {
      favorites[item] = Object.assign({}, favorites[item], { [item2]: dataDB[item][item2] });
    })
  })
  return Object.assign({}, data, { favorites });
}

export const setInitSettingsData = (data, dataDB) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof dataDB !== 'object') throw new Error('Invalid data type. Arguments: "dataDB"');
  const settings = {};
  Object.keys(data.settings).forEach((item, i) => {
    settings[item] = dataDB[item] || data.settings[item];
  })
  return Object.assign({}, data, { settings });
}

export const setInitCounterData = (data, dataDB) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof dataDB !== 'object') throw new Error('Invalid data type. Arguments: "dataDB"');
  const counter = {
    likeTotal: dataDB.likeTotal,
    likeToday: dataDB.likeToday
  };
  return Object.assign({}, data, { counter });
}

export const setCounterData = (data, counter) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof counter !== 'object') throw new Error('Invalid data type. Arguments: "counter"');
  return Object.assign({}, data, { counter });
};

export const setSettingsData = (data, settings) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof settings !== 'object') throw new Error('Invalid data type. Arguments: "settings"');
  return Object.assign({}, data, { settings });
};

export const setFavoritesData = (data, favorites) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof favorites !== 'object') throw new Error('Invalid data type. Arguments: "favorites"');
  return Object.assign({}, data, { favorites });
};

export const setItemCounter = (data, item, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof item !== 'string') throw new Error('Invalid data type. Arguments: "item"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  data.counter[item] = num;
  return Object.assign({}, data);
};

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
  data.elementsNodes[num] = nodes;
  return Object.assign({}, data);
};

export const delElementNodes = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  const del = delete data.elementsNodes[num];
  return Object.assign({}, data);
};

export const setCurrentHaveyElementNum = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  return Object.assign({}, data, { currentHaveyElementNum: num });
};

export const setCurrentElement = (data, currentElement) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof currentElement !== 'object') throw new Error('Invalid data type. Arguments: "currentElement"');
  return Object.assign({}, data, { currentElement });
};

export const setPlayPhoto = (data, playPhoto) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof playPhoto !== 'boolean') throw new Error('Invalid data type. Arguments: "playPhoto"');
  return Object.assign({}, data, { playPhoto });
};

export const setError403 = (data, error403) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof error403 !== 'boolean') throw new Error('Invalid data type. Arguments: "error403"');
  return Object.assign({}, data, { error403 });
};

export const setOnOffLm = (data, LMOn) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof LMOn !== 'boolean') throw new Error('Invalid data type. Arguments: "LMOn"');
  return Object.assign({}, data, { LMOn });
};

export const setLikeNowCounter = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  return Object.assign({}, data, { likeNowCounter: num });
};

export const setFavorites = (data, type, tag) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof type !== 'string') throw new Error('Invalid data type. Arguments: "type"');
  if (typeof tag !== 'object') throw new Error('Invalid data type. Arguments: "tag"');
  const favoritesType = Object.assign({}, data.favorites[type], tag );
  const favorites = Object.assign({}, data.favorites, {[type]: favoritesType});
  return Object.assign({}, data, { favorites });
}

export const setCurrentTag = (data, currentTag) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof currentTag !== 'object') throw new Error('Invalid data type. Arguments: "currentTag"');
  return Object.assign({}, data, { currentTag });
};
