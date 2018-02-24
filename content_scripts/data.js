export const initialState = {
  counter: {
    likeTotal: 0,
    likeToday: 0
  },
  settings: {
    maxLikes: 10,
    photoDelay: 2,
    tagDelay: 3,
    fiftyDelay: 2,
    errorDelay: 10,
    numFullHearts: 3,
    skipTheBest: false,
    viewElementSwitch: false,
    scrollSpeed: 1000,
    scrollType: 'out-expo',
    dblclickInterval: 300,
    currentPhotoColor: 'rgba(0,128,128,0.3)',
    viewElementColor: 'rgba(0,128,128,0.3)',
    viewElementPosition: 'left:20px;bottom:80px;',
    pageZoom: 1,
    language: 'russian'
  },
  favorites: {
    locations: {},
    tags: {},
    accounts: {},
    photos: {}
  },
  version: {
    versionNum: '1.0.4',
    versionType: 'pro',
    unlimited: true,
    todayMaxLikes: 5000,
    maxFavorites: 100
  },
  dateLikeToday: '',
  elementsData: {},
  elementsNodes: {},
  favoriteLinks: [],
  currentHaveyElementNum: 0,
  currentFavoriteLinkNum: 0,
  likeNowCounter: 0,
  currentElement: null,
  remotePhoto: {
    start: false,
    pause: false,
    stop: false
  },
  playFavorites: false,
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

export const setFavoriteLinks= (data, favoriteLinks) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  // if (!favoriteLinks.isArray()) throw new Error('Invalid data type. Arguments: "favoriteLinks"');
  return Object.assign({}, data, { favoriteLinks });
};

export const setCurrentHaveyElementNum = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  return Object.assign({}, data, { currentHaveyElementNum: num });
};

export const setCurrentFavoriteLinkNum = (data, currentFavoriteLinkNum) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof currentFavoriteLinkNum !== 'number') throw new Error('Invalid data type. Arguments: "currentFavoriteLinkNum"');
  return Object.assign({}, data, { currentFavoriteLinkNum });
};

export const setCurrentElement = (data, currentElement) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof currentElement !== 'object') throw new Error('Invalid data type. Arguments: "currentElement"');
  return Object.assign({}, data, { currentElement });
};

export const setRemotePhoto = (data, remotePhoto) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof remotePhoto !== 'object') throw new Error('Invalid data type. Arguments: "remotePhoto"');
  return Object.assign({}, data, { remotePhoto });
};

export const setPlayFavorites = (data, playFavorites) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof playFavorites !== 'boolean') throw new Error('Invalid data type. Arguments: "playFavorites"');
  return Object.assign({}, data, { playFavorites });
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

export const setDateLikeTodayData = (data, dateLikeToday) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof dateLikeToday !== 'string') throw new Error('Invalid data type. Arguments: "dateLikeToday"');
  return Object.assign({}, data, { dateLikeToday });
};

export const setUnlimitedData = (data, unlimited) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof unlimited !== 'boolean') throw new Error('Invalid data type. Arguments: "unlimited"');
  const version = Object.assign({}, data.version , { unlimited });
  return Object.assign({}, data, { version });
};

export const setTodayMaxLikesData = (data, todayMaxLikes) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof todayMaxLikes !== 'number') throw new Error('Invalid data type. Arguments: "todayMaxLikes"');
  const version = Object.assign({}, data.version , { todayMaxLikes });
  return Object.assign({}, data, { version });
};

export const setMaxFavoritesData = (data, maxFavorites) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof maxFavorites !== 'number') throw new Error('Invalid data type. Arguments: "maxFavorites"');
  const version = Object.assign({}, data.version , { maxFavorites });
  return Object.assign({}, data, { version });
};
