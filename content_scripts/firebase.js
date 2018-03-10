import * as firebase from 'firebase/app';

import 'firebase/database';

const config = {
    apiKey: "AIzaSyBIUHNsOVc_y3SjERdiEd2L0IKZmQE-j2M",
    authDomain: "the-like-machine-d269b.firebaseapp.com",
    databaseURL: "https://the-like-machine-d269b.firebaseio.com",
    projectId: "the-like-machine-d269b",
    storageBucket: "the-like-machine-d269b.appspot.com",
    messagingSenderId: "458103066042"
  };

firebase.initializeApp(config);

export function checkAccounts(account, callback) {
  let accountData = {};
  firebase.database().ref('accounts').child(account).once('value')
  .then((e) => {
    accountData = e.val();
    return firebase.database().ref('global').once('value');
  })
  .then((e) => {
    callback(accountData, e.val(), account);
  })
  .catch((error) => {
    console.log('fetch data error: ', error);
  });
};

export function setUnlimitedDB(account, bool) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/unlimited/').set(bool);
  } catch (e) {
  }
}

export function setLMOnDB(account, bool) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/LMOn/').set(bool);
  } catch (e) {
  }
}

export function setDateLikeTodayDB(account, date) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/dateLikeToday/').set(date);
  } catch (e) {
  }
}

export function setCounterDB(account, data) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/counter/').set(data);
  } catch (e) {
  }
}

export function setFavoritesDB(account, data) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/favorites/').set(data);
  } catch (e) {
  }
}

export function setSettingsDB(account, data) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/settings/').set(data);
  } catch (e) {
  }
}


export function setVersionDB(account, version) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/version/').set(version);
  } catch (e) {
  }
}

export function setInitDataDB(account, initData) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/').set(initData);
  } catch (e) {
  }
}
