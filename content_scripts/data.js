export const initialState = {
  profileData: {
    counter: {
      likeTotal: 2500,
      likeToday: 303
    },
    maxLikes: 50,
    viewElementSwitch: true,
    version: 'free',
    scrollSpeed: 700,
    scrollType: 'out-expo',
    likeDelay: 500,
    scrollToUnlike: 'true',
    dblclickInterval: 300,
    currentPhotoColor: 'rgba(0,128,128,0.3)',
    viewElementColor: 'rgba(0,128,128,0.3)',
    viewElementPosition: 'right:50px;top:50px;',
    pageZoom: 0.75,
    language: 'english'
  },
  elementsData: {},
  elementsNodes: {},
  currentHaveyElementNum: 0,
  likeNowCounter: 0,
  currentElement: null,
  favorites: {
    locations: {},
    tags: {},
    accounts: {},
    photos: {}
  },
  currentTag: {
    type: '',
    name: '',
    link: ''
  }
};

export const setProfileData = (data, profileData) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof profileData !== 'object') throw new Error('Invalid data type. Arguments: "profileData"');
  return Object.assign({}, data, { profileData });
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
  data.profileData.counter[item] = num;
  return Object.assign({}, data);
};

export const setCounter = (data, counter) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof counter !== 'object') throw new Error('Invalid data type. Arguments: "counter"');
  const profileData = Object.assign({}, data.profileData, { counter});
  return Object.assign({}, data, { profileData });
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

export const setPageZoom = (data, pageZoom) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof pageZoom !== 'string') throw new Error('Invalid data type. Arguments: "pageZoom"');
  return Object.assign({}, data, { profileData: { pageZoom }});
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

export const setCurrentElement = (data, element) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof element !== 'object') throw new Error('Invalid data type. Arguments: "element"');
  return Object.assign({}, data, { currentElement: element });
};

export const setLikeNowCounter = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  // if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  return Object.assign({}, data, { likeNowCounter: num });
};

export const setFavoritesLocations = (data, locations) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof locations !== 'string') throw new Error('Invalid data type. Arguments: "locations"');
  const favorites = Object.assign({}, data.favorites, { locations });
  return Object.assign({}, data, { favorites });
};

export const setFavoritesTags = (data, tags) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof tags !== 'string') throw new Error('Invalid data type. Arguments: "tags"');
  const favorites = Object.assign({}, data.favorites, { tags });
  return Object.assign({}, data, { favorites });
};

export const setFavoritesPhotos = (data, photos) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof photos !== 'string') throw new Error('Invalid data type. Arguments: "photos"');
  const favorites = Object.assign({}, data.favorites, { photos });
  return Object.assign({}, data, { favorites });
};

export const setFavoritesAccounts = (data, accounts) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof accounts !== 'string') throw new Error('Invalid data type. Arguments: "accounts"');
  const favorites = Object.assign({}, data.favorites, { accounts });
  return Object.assign({}, data, { favorites });
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
