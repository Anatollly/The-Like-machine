export const initialState = {
  elementsData: {},
  elementsNodes: {},
  currentHaveyElementNum: 0,
  maxLikes: 0,
  likeNowCounter: 0,
  counter: {
    likeTotal: 0,
    likeToday: 0,
    likeNow: 0,
    saveAll: 0,
    saveToday: 0
  }
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
  if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  data.elementsNodes[num] = nodes;
  return Object.assign({}, data);
};

export const delElementNodes = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  if (!data.elementsNodes[num]) throw new Error('Element to delete does not exist. Number ' + num);
  if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  const del = delete data.elementsNodes[num];
  if (!del) console.log('Error delete');
  return Object.assign({}, data);
};

export const setCurrentHaveyElementNum = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  return Object.assign({}, data, { currentHaveyElementNum: num });
};

export const setMaxLikes = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  return Object.assign({}, data, { maxLikes: num });
}

export const setLikeNowCounter = (data, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  if (num < 0) throw new Error('Element number can not be less than zero. Number: ' + num);
  return Object.assign({}, data, { likeNowCounter: num });
}

export const setItemCounter = (data, item, num) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof item !== 'string') throw new Error('Invalid data type. Arguments: "item"');
  if (typeof num !== 'number') throw new Error('Invalid data type. Arguments: "num"');
  data.counter[item] = num;
  return Object.assign({}, data);
};

export const setCounter = (data, counter) => {
  if (typeof data !== 'object') throw new Error('Invalid data type. Arguments: "data"');
  if (typeof counter !== 'object') throw new Error('Invalid data type. Arguments: "counter"');
  return Object.assign({}, data, { counter });
};
