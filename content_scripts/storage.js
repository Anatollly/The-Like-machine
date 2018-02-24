const initStorage = {
  playFavorites: false,
  favoriteLinks: [],
  currentFavoriteLinkNum: 0,
  currentLink: ''
}

class BrowserStorage {
  constructor(storage = initStorage) {
    this._storage = storage;
  }

  get initStorage() {
    return initStorage;
  }

  set state(storage) {
    try {
      Object.keys(storage).forEach((item, i) => {
        this[item] = storage[item];
      })
    } catch (e) {
    }
  }

  get state() {
    const store = {};
    Object.keys(initStorage).forEach((item, i) => {
      store[item] = this[item];
    })
    return store;
  }

  set playFavorites(playFavorites) {
    localStorage.setItem('lm-playFavorites', playFavorites);
  }

  get playFavorites() {
    return localStorage.getItem('lm-playFavorites') === 'true';
  }

  set favoriteLinks(favoriteLinks) {
    localStorage.setItem('lm-favoriteLinks', favoriteLinks);
  }

  get favoriteLinks() {
    const favoriteLinks = localStorage.getItem('lm-favoriteLinks');
    return favoriteLinks ? favoriteLinks.split(',') : initStorage.favoriteLinks;
  }

  set currentFavoriteLinkNum(currentFavoriteLinkNum) {
    localStorage.setItem('lm-currentFavoriteLinkNum', currentFavoriteLinkNum);
  }

  get currentFavoriteLinkNum() {
    return localStorage.getItem('lm-currentFavoriteLinkNum') * 1;
  }

  set currentLink(currentLink) {
    localStorage.setItem('lm-currentLink', currentLink);
  }

  get currentLink() {
    return localStorage.getItem('lm-currentLink');
  }

  resetStorage() {
    Object.keys(initStorage).forEach((item, i) => {
      localStorage.setItem(`lm-${item}`, initStorage[item]);
    });
  }
}

export default (() => new BrowserStorage())();
