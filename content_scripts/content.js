let machineData = {
  maxClick: 60,
  initOffset: 0
};

window.onload = () => {
  const head = document.querySelector('head');
  const style = document.createElement('style');
  const root = document.querySelector('#react-root');
  const lmElement = document.createElement('span');
  const controlElement = `
    <form class="lm--form">
      <label for="lm--maxLikes">Maximum likes</label>
      <input type="text" id="lm--maxLikes">
      </br>
      <label for="lm--start">Start</label>
      <input type="button" id="lm--start">
      </br>
      <label for="lm--pause">Pause</label>
      <input type="button" id="lm--pause">
      </br>
      <label for="lm--stop">Stop</label>
      <input type="button" id="lm--stop">
    </form>
  `;
  const controlElementCSS = `
    .lm--element {
      position: fixed;
      width: 100px;
      height: 166px;
      right: 50px;
      bottom: 50px;
      z-index: 1000000;
      background-color: rgba(100, 100, 100, 0.3);
    }
  `;
  style.type = 'text/css';
  style.innerHTML = controlElementCSS;
  head.appendChild(style);
  lmElement.classList.add('lm--element');
  lmElement.innerHTML = controlElement;
  root.appendChild(lmElement);

};



class LikeFunc {
  get heart() {
    return document.querySelector('.coreSpriteHeartOpen');
  }
}

class LikeFuncLine extends LikeFunc {
  constructor(data) {
    super(data);
    this.maxClick = data.maxClick;
    this.deltaOffset = 5;
    this.initOffset = machineData.initOffset;
    this.count = 0;
  }

  get heartYOffset() {
    return this.heart.getBoundingClientRect().top;
  }

  clickHeart() {
    this.heart.click();
  }

  clickNextHeart() {
    if (this.heartYOffset <= 500) {
      this.clickHeart();
      this.count += 1;
      console.log('like: ', this.count);
      if (this.count >= this.maxClick) {
        this.scrollPageStop();
        this.count = 0;
      }
    }
  }

  scrollPage() {
    window.scrollTo(0, this.initOffset += this.deltaOffset);
    this.clickNextHeart();
  }

  scrollPageStart() {
    clearInterval(this.timerID);
    this._timerID = setInterval(() => {this.scrollPage()}, 12);
  }

  scrollPagePause() {
    clearInterval(this._timerID);
    machineData.initOffset = window.pageYOffset;
  }

  scrollPageStop() {
    clearInterval(this._timerID);
    this.count = 0;
  }
}

let likeFuncLine = new LikeFuncLine(machineData);

// class LikeFuncRow extends LikeFunc {
//   constructor(data) {
//     super(data);
//   }
//
//   getRowElement() {
//     return document.querySelector('._70iju');
//   }
//
//   scrollToRow() {
//
//   }
// }

const likeFuncRow = () => {
  MAX_CLICK = 60;
  let photos = document.querySelectorAll('._f2mse a');
  let count = 0;
  const openPhoto = () => {
    setTimeout(() => {
      photos[count].click();
      const timerID = setInterval(() => {
        let cross = document.querySelector('._dcj9f');
        let heart = document.querySelector('.coreSpriteHeartOpen');
        if(cross) {
          clearInterval(timerID);
          if(heart) {
            heart.click();
            console.log('like: ', count);
          } else {
            console.log('heart already has been liked');
          }
          setTimeout(() => {
            cross.click();
            count += 1;
            if(count <= MAX_CLICK) {
              openPhoto();
            } else {
              console.log('THE END');
            }
          }, 2000);
        }
      }, 2000);
    }, 2000);
  };
  openPhoto();
  return 'like-machine start';
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('message: ', message);
  console.log('sender: ', sender);

  const {click, url} = message;

  if (click === 'start') {
    machineData.maxClick = message.maxLikes;
    likeFuncLine = new LikeFuncLine(machineData);
    if (url === 'https://www.instagram.com/') {
      likeFuncLine.scrollPageStart();
    } else {
      likeFuncRow();
    }
  }

  if (click === 'pause') {
    if (url === 'https://www.instagram.com/') {
      likeFuncLine.scrollPagePause();
    } else {
      likeFuncRow();
    }
  }

  if (click === 'stop') {
    if (url === 'https://www.instagram.com/') {
      likeFuncLine.scrollPageStop();
    } else {
      likeFuncRow();
    }
  }

  if (click === 'icon') {
    console.log('click icon');
  }
});
