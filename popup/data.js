export const initProfileData = {
  counter: {
    likeTotal: 2500,
    likeToday: 303
  },
  maxLikes: 88,
  viewElementSwitch: true,
  version: 'free',
  scrollSpeed: 850,
  scrollType: 'out-expo',
  likeDelay: 800,
  scrollToUnlike: 'true',
  dblclickInterval: 300,
  currentPhotoColor: 'rgba(0,255,255,0.3)',
  viewElementColor: 'rgba(0,0,128,0.3)',
  viewElementPosition: 'right:50px;top:50px;',
  pageZoom: 0.75,
  language: 'russian'
};

export const languageMap = {
  english: 0,
  russian: 1
};

export const translator = {
  settings: ['Settings', 'Настройки'],
  manual: ['Instruction', 'Инструкции'],
  additionally: ['Additionally', 'Дополнительно'],
  favorites: ['Favorites', 'Избранное'],
  save: ['Save', 'Сохранить'],
  cancel: ['Cancel', 'Отменить'],
  reset: ['Reset', 'Сбросить'],
  start: ['Start', 'Старт'],
  pause: ['Pause', 'Пауза'],
  stop: ['Stop', 'Стоп'],
  showCounter: ['Show counter?', 'Показывать счетчик?'],
  no: ['No', 'Нет'],
  yes: ['Yes', 'Да'],
  likesNumber: ['Number of likes:', 'Количество лайков:'],
  range100: ['0 - 100', 'От 0 до 100'],
  pageSize: ['Page size', 'Размер страницы:'],
  scrollingSpeed: ['Scrolling speed:', 'Скорость прокрутки:'],
  verySlow: ['Very slow', 'Очень медленная'],
  slow: ['Slow', 'Медленная'],
  average: ['Average', 'Средняя'],
  fast: ['Fast', 'Быстрая'],
  veryFast: ['Very fast','Очень быстрая'],
  scrollingType: ['Scrolling type:', 'Тип прокрутки:'],
  delay: ['Delay:', 'Задержка:'],
  petite: ['Petite', 'Маленькая'],
  large: ['Large', 'Большая'],
  intervalBetweenClicks: ['Interval between clicks:', 'Интервал м/у нажатиями:'],
  veryShort: ['Very short', 'Очень короткий'],
  short: ['Short', 'Короткий'],
  middle: ['Middle', 'Средний'],
  photoBackgroundColor: ['Photo background color:', 'Цвет текущего поста:'],
  black: ['Black', 'Чёрный'],
  lime: ['Lime', 'Лимонный'],
  aqua: ['Aqua', 'Морской'],
  fuchsia: ['Fuchsia', 'Фуксия'],
  silver: ['Silver', 'Серебряный'],
  maroon: ['Maroon', 'Каштановый'],
  olive: ['Olive', 'Оливковый'],
  teal: ['Teal', 'Морская волна'],
  navy: ['Navy', 'Тёмно-синий'],
  red: ['Red', 'Красный'],
  orange: ['Orange', 'Оранжевый'],
  yellow: ['Yellow', 'Жёлтый'],
  green: ['Green', 'Зелёный'],
  blue: ['Blue', 'Синий'],
  purple: ['Purple', 'Фиолетовый'],
  gray: ['Gray', 'Серый'],
  counterColor: ['Counter color:', 'Цвет счетчика:'],
  counterPosition: ['Counter position:', 'Расположение счетчика:'],
  topRight: ['Top-right', 'Вверху-справа'],
  bottomRight: ['Bottom-right', 'Внизу-справа'],
  bottomLeft: ['Bottom-left', 'Ввнизу-слева'],
  topLeft: ['Top-left', 'Вверху-слева'],
  pageLanguage: ['Language:', 'Язык:']
};

export const settigsDataSelect = (() => {
  const {
    start,
    pause,
    stop,
    showCounter,
    no,
    yes,
    likesNumber,
    pageSize,
    scrollingSpeed,
    verySlow,
    slow,
    average,
    fast,
    veryFast,
    scrollingType,
    delay,
    petite,
    large,
    intervalBetweenClicks,
    veryShort,
    short,
    middle,
    photoBackgroundColor,
    black,
    lime,
    aqua,
    fuchsia,
    silver,
    maroon,
    olive,
    teal,
    navy,
    red,
    orange,
    yellow,
    green,
    blue,
    purple,
    gray,
    counterColor,
    counterPosition,
    topRight,
    bottomRight,
    bottomLeft,
    topLeft,
    pageLanguage
  } = translator;

  const settigsData = {

    viewElementSwitch: {
      label: showCounter,
      options: new Map([
        [false, no],
        [true, yes]
      ])
    },
    pageZoom: {
      label: pageSize,
      options: new Map([
        [0.5, '50%'],
        [0.67, '67%'],
        [0.75, '75%'],
        [0.8, '80%'],
        [0.9, '90%'],
        [1, '100%']
      ])
    },
    scrollSpeed: {
      label: scrollingSpeed,
      options: new Map([
        [2000, verySlow],
        [1400, slow],
        [1000, average],
        [750, fast],
        [600, veryFast]
      ])
    },
    scrollType: {
      label: scrollingType,
      options: new Map([
        ['in-quad', 'in-quad'],
        ['out-quad', 'out-quad'],
        ['in-out-quad', 'in-out-quad'],
        ['in-cube', 'in-cube'],
        ['out-cube', 'out-cube'],
        ['in-out-cube', 'in-out-cube'],
        ['in-quart', 'in-quart'],
        ['out-quart', 'out-quart'],
        ['in-out-quart', 'in-out-quart'],
        ['in-quint', 'in-quint'],
        ['out-quint', 'out-quint'],
        ['in-out-quint', 'in-out-quint'],
        ['in-sine', 'in-sine'],
        ['out-sine', 'out-sine'],
        ['in-out-sine', 'in-out-sine'],
        ['in-expo', 'in-expo'],
        ['out-expo', 'out-expo'],
        ['in-out-expo', 'in-out-expo'],
        ['in-circ', 'in-circ'],
        ['out-circ', 'out-circ'],
        ['in-out-circ', 'in-out-circ'],
        ['in-back', 'in-back'],
        ['out-back', 'out-back'],
        ['in-out-back', 'in-out-back'],
        ['in-bounce', 'in-bounce'],
        ['out-bounce', 'out-bounce'],
        ['in-out-bounce', 'in-out-bounce'],
      ])
    },
    likeDelay: {
      label: delay,
      options: new Map([
        [500, petite],
        [800, average],
        [1200, large]
      ])
    },
    dblclickInterval: {
      label: intervalBetweenClicks,
      options: new Map([
        [200, veryShort],
        [250, short],
        [300, middle],
        [400, large]
      ])
    },
    currentPhotoColor: {
      label: photoBackgroundColor,
      options: new Map([
        ['rgba(0,0,0,0.3)', black],
        ['rgba(255,0,0,0.3)', red],
        ['rgba(0,255,0,0.3)', lime],
        ['rgba(0,0,255,0.3)', blue],
        ['rgba(255,255,0,0.3)', yellow],
        ['rgba(0,255,255,0.3)', aqua],
        ['rgba(255,0,255,0.3)', fuchsia],
        ['rgba(192,192,192,0.3)', silver],
        ['rgba(128,128,128,0.3)', gray],
        ['rgba(128,0,0,0.3)', maroon],
        ['rgba(128,128,0,0.3)', olive],
        ['rgba(0,128,0,0.3)', green],
        ['rgba(128,0,128,0.3)', purple],
        ['rgba(0,128,128,0.3)', teal],
        ['rgba(0,0,128,0.3)', navy]
      ])
    },
    viewElementColor: {
      label: counterColor,
      options: new Map([
        ['rgba(0,0,0,0.3)', black],
        ['rgba(255,0,0,0.3)', red],
        ['rgba(0,255,0,0.3)', lime],
        ['rgba(0,0,255,0.3)', blue],
        ['rgba(255,255,0,0.3)', yellow],
        ['rgba(0,255,255,0.3)', aqua],
        ['rgba(255,0,255,0.3)', fuchsia],
        ['rgba(192,192,192,0.3)', silver],
        ['rgba(128,128,128,0.3)', gray],
        ['rgba(128,0,0,0.3)', maroon],
        ['rgba(128,128,0,0.3)', olive],
        ['rgba(0,128,0,0.3)', green],
        ['rgba(128,0,128,0.3)', purple],
        ['rgba(0,128,128,0.3)', teal],
        ['rgba(0,0,128,0.3)', navy]
      ])
    },
    viewElementPosition: {
      label: counterPosition,
      options: new Map([
        ['right:20px;top:80px;', topRight],
        ['right:20px;bottom:80px;', bottomRight],
        ['left:20px;bottom:80px;', bottomLeft],
        ['left:20px;top:80px;', topLeft]
      ])
    },
    language: {
      label: pageLanguage,
      options: new Map([
        ['english', 'English'],
        ['russian', 'Русский']
      ])
    }
  }

  return settigsData;
})();

export const settigsDataInput = (() => {
  const { likesNumber, range100 } = translator;
  const settigsData = {
    maxLikes: {
      label: likesNumber,
      placeHolder: range100,
      regex: '^0*(?:[1-9][0-9]?|100)$'
    }
  }
  return settigsData;
})();
