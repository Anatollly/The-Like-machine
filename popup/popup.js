let maxLikes = 60;

chrome.browserAction.onClicked.addListener((tab) => {
  console.log('click icon');
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {click: "icon", url: tabs[0].url}, () => {
      console.log('click icon');
    });
  });
});

// window.onload = () => {
//
//   const maxLikesInput = document.querySelector('#max-likes');
//   const start = document.querySelector('#start');
//   const pause = document.querySelector('#pause');
//   const stop = document.querySelector('#stop');
//
//   maxLikesInput.value = maxLikes;
//
//   maxLikesInput.addEventListener('input', () => {
//     maxLikes = maxLikesInput.value;
//   });
//
//   start.addEventListener('click', () => {
//     chrome.tabs.query({active: true, currentWindow: true}, tabs => {
//       chrome.tabs.sendMessage(
//         tabs[0].id,
//         {
//           click: "start",
//           url: tabs[0].url,
//           maxLikes: maxLikesInput.value
//         },
//         () => {
//         console.log('like start');
//       });
//     });
//   });
//
//   pause.addEventListener('click', () => {
//     chrome.tabs.query({active: true, currentWindow: true}, tabs => {
//       chrome.tabs.sendMessage(tabs[0].id, {click: "pause", url: tabs[0].url}, () => {
//         console.log('like pause');
//       });
//     });
//   });
//
//   stop.addEventListener('click', () => {
//     chrome.tabs.query({active: true, currentWindow: true}, tabs => {
//       chrome.tabs.sendMessage(tabs[0].id, {click: "stop", url: tabs[0].url}, () => {
//         console.log('like stop');
//       });
//     });
//   });
//
// };
