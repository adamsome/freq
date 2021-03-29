/*! From ghosh/uiGradients | MIT License | https://github.com/ghosh/uiGradients/blob/master/gradients.json */
import { Dict } from '../types/object.types'
import { objectKeys } from '../util/object'
import { randomItem } from '../util/random'

export function randomGradient() {
  return randomItem(objectKeys(gradientDict))
}

export const gradientLightTextDict: Dict<boolean[]> = {
  Omolon: [true],
  Argon: [true],
  'Love and Liberty': [true, true],
  Frost: [true, true],
  Combi: [true],
  Bupe: [true],
  'Royal Blue': [true, true],
  'Royal Blue + Petrol': [false, true],
  Afternoon: [true],
  Horizon: [true],
  Frozen: [true],
  'Aqua Marine': [true],
  'Purple Paradise': [true],
  Mirage: [true],
  'Steel Gray': [true],
  'Midnight City': [true, true],
  Influenza: [false, true],
  'Pinot Noir': [false, true],
  Vasily: [false, true],
  'The Strain': [true, true],
  Starfall: [false, true],
  'Red Mist': [true, true],
  Behongo: [true, true],
  Hersheys: [true],
  'Talking To Mice Elf': [false, true],
  'Purple Bliss': [true, true],
  Predawn: [false, true],
  Twitch: [true, true],
  Flickr: [true, true],
  Vine: [true, true],
  'Between Night and Day': [true],
  'Dark Skies': [true, true],
  'Deep Space': [true, true],
  Royal: [true, true],
  Mauve: [true, true],
  'Cosmic Fusion': [true, true],
  'What lies Beyond': [false, true],
  'The Blue Lagoon': [false, true],
  'Very Blue': [true, true],
  Orca: [true, true],
  'Pacific Dream': [false, true],
  Celestial: [true, true],
  Purplepine: [true],
  Coal: [true, true],
  'Visions of Grandeur': [true],
  Meridian: [true, true],
  Relay: [true],
  Alive: [true, true],
  'King Yna': [true, true],
  Lawrencium: [true, true],
  'Taran Tado': [true, true],
  Bighead: [true, true],
  'Sand to Blue': [true],
  'Slight Ocean View': [false, true],
  eXpresso: [true, true],
  'Witching Hour': [true, true],
  'Dark Ocean': [true, true],
  'Evening Sunshine': [true, true],
  'Moonlit Asteroid': [true, true],
  'Under Blue Green': [true],
  'Blue Slate': [false, true],
  'Winter Woods': [true, true],
  Ameena: [true, true],
  'Emerald Sea': [true, true],
  Moonwalker: [true, true],
  Whinehouse: [false, true],
  'Hyper Blue': [true, true],
  Racker: [true, true],
  'Visual Blue': [true, true],
}

/**
 * Also @see https://colorfulgradients.tumblr.com for more
 */
const gradientDict: Dict<string[]> = {
  games: ['#feac5e', '#c779d0', '#4bc0c8'],
  freq: ['#c02425', '#f0cb35', '#38ef7d'],
  cwd: ['#eb0000', '#95008a', '#3300fc'],
  Omolon: ['#091e3a', '#2f80ed', '#2d9ee0'],
  Farhan: ['#9400d3', '#4b0082'],
  Purple: ['#c84e89', '#f15f79'],
  Ibtesam: ['#00f5a0', '#00d9f5'],
  'Radioactive Heat': ['#f7941e', '#72c6ef', '#00a651'],
  'The Sky And The Sea': ['#f7941e', '#004e8f'],
  'From Ice To Fire': ['#72c6ef', '#004e8f'],
  'Blue & Orange': ['#fd8112', '#0085ca'],
  'Purple Dream': ['#bf5ae0', '#a811da'],
  Blu: ['#00416a', '#e4e5e6'],
  'Summer Breeze': ['#fbed96', '#abecd6'],
  Ver: ['#ffe000', '#799f0c'],
  'Ver Black': ['#f7f8f8', '#acbb78'],
  Combi: ['#00416a', '#799f0c', '#ffe000'],
  Anwar: ['#334d50', '#cbcaa5'],
  Bluelagoo: ['#0052d4', '#4364f7', '#6fb1fc'],
  Lunada: ['#5433ff', '#20bdff', '#a5fecb'],
  Reaqua: ['#799f0c', '#acbb78'],
  Mango: ['#ffe259', '#ffa751'],
  Bupe: ['#00416a', '#e4e5e6'],
  Rea: ['#ffe000', '#799f0c'],
  Windy: ['#acb6e5', '#86fde8'],
  'Royal Blue': ['#536976', '#292e49'],
  'Royal Blue + Petrol': ['#bbd2c5', '#536976', '#292e49'],
  Copper: ['#b79891', '#94716b'],
  Anamnisar: ['#9796f0', '#fbc7d4'],
  Petrol: ['#bbd2c5', '#536976'],
  Sky: ['#076585', '#fff'],
  Sel: ['#00467f', '#a5cc82'],
  Afternoon: ['#000c40', '#607d8b'],
  Skyline: ['#1488cc', '#2b32b2'],
  DIMIGO: ['#ec008c', '#fc6767'],
  'Purple Love': ['#cc2b5e', '#753a88'],
  'Sexy Blue': ['#2193b0', '#6dd5ed'],
  Blooker20: ['#e65c00', '#f9d423'],
  'Sea Blue': ['#2b5876', '#4e4376'],
  Nimvelo: ['#314755', '#26a0da'],
  Hazel: ['#77a1d3', '#79cbca', '#e684ae'],
  'Noon to Dusk': ['#ff6e7f', '#bfe9ff'],
  YouTube: ['#e52d27', '#b31217'],
  'Cool Brown': ['#603813', '#b29f94'],
  'Harmonic Energy': ['#16a085', '#f4d03f'],
  'Playing with Reds': ['#d31027', '#ea384d'],
  'Sunny Days': ['#ede574', '#e1f5c4'],
  'Green Beach': ['#02aab0', '#00cdac'],
  'Intuitive Purple': ['#da22ff', '#9733ee'],
  'Emerald Water': ['#348f50', '#56b4d3'],
  'Lemon Twist': ['#3ca55c', '#b5ac49'],
  'Monte Carlo': ['#cc95c0', '#dbd4b4', '#7aa1d2'],
  Horizon: ['#003973', '#e5e5be'],
  'Rose Water': ['#e55d87', '#5fc3e4'],
  Frozen: ['#403b4a', '#e7e9bb'],
  'Mango Pulp': ['#f09819', '#edde5d'],
  'Bloody Mary': ['#ff512f', '#dd2476'],
  Aubergine: ['#aa076b', '#61045f'],
  'Aqua Marine': ['#1a2980', '#26d0ce'],
  Sunrise: ['#ff512f', '#f09819'],
  'Purple Paradise': ['#1d2b64', '#f8cdda'],
  Stripe: ['#1fa2ff', '#12d8fa', '#a6ffcb'],
  'Sea Weed': ['#4cb8c4', '#3cd3ad'],
  Pinky: ['#dd5e89', '#f7bb97'],
  Cherry: ['#eb3349', '#f45c43'],
  Mojito: ['#1d976c', '#93f9b9'],
  'Juicy Orange': ['#ff8008', '#ffc837'],
  Mirage: ['#16222a', '#3a6073'],
  'Steel Gray': ['#1f1c2c', '#928dab'],
  Kashmir: ['#614385', '#516395'],
  'Electric Violet': ['#4776e6', '#8e54e9'],
  'Venice Blue': ['#085078', '#85d8ce'],
  'Bora Bora': ['#2bc0e4', '#eaecc6'],
  Moss: ['#134e5e', '#71b280'],
  'Shroom Haze': ['#5c258d', '#4389a2'],
  'Midnight City': ['#232526', '#414345'],
  'Sea Blizz': ['#1cd8d2', '#93edc7'],
  Opa: ['#3d7eaa', '#ffe47a'],
  Titanium: ['#283048', '#859398'],
  Mantle: ['#24c6dc', '#514a9d'],
  Dracula: ['#dc2424', '#4a569d'],
  Peach: ['#ed4264', '#ffedbc'],
  Moonrise: ['#dae2f8', '#d6a4a4'],
  Stellar: ['#7474bf', '#348ac7'],
  Bourbon: ['#ec6f66', '#f3a183'],
  'Calm Darya': ['#5f2c82', '#49a09d'],
  Influenza: ['#c04848', '#480048'],
  Army: ['#414d0b', '#727a17'],
  Miaka: ['#fc354c', '#0abfbc'],
  'Pinot Noir': ['#4b6cb7', '#182848'],
  'Day Tripper': ['#f857a6', '#ff5858'],
  'Blurry Beach': ['#d53369', '#cbad6d'],
  Vasily: ['#e9d362', '#333333'],
  'A Lost Memory': ['#de6262', '#ffb88c'],
  Kyoto: ['#c21500', '#ffc500'],
  'Misty Meadow': ['#215f00', '#e4e4d9'],
  Aqualicious: ['#50c9c3', '#96deda'],
  Moor: ['#616161', '#9bc5c3'],
  Almost: ['#ddd6f3', '#faaca8'],
  'Forever Lost': ['#5d4157', '#a8caba'],
  Winter: ['#e6dada', '#274046'],
  Nelson: ['#f2709c', '#ff9472'],
  Autumn: ['#dad299', '#b0dab9'],
  Candy: ['#d3959b', '#bfe6ba'],
  Reef: ['#00d2ff', '#3a7bd5'],
  'The Strain': ['#870000', '#190a05'],
  'Dirty Fog': ['#b993d6', '#8ca6db'],
  Earthly: ['#649173', '#dbd5a4'],
  Virgin: ['#c9ffbf', '#ffafbd'],
  Ash: ['#606c88', '#3f4c6b'],
  Cherryblossoms: ['#fbd3e9', '#bb377d'],
  Parklife: ['#add100', '#7b920a'],
  'Dance To Forget': ['#ff4e50', '#f9d423'],
  Starfall: ['#f0c27b', '#4b1248'],
  'Red Mist': ['#000000', '#e74c3c'],
  'Teal Love': ['#aaffa9', '#11ffbd'],
  'Neon Life': ['#b3ffab', '#12fff7'],
  Amethyst: ['#9d50bb', '#6e48aa'],
  'Cheer Up Emo Kid': ['#556270', '#ff6b6b'],
  Shore: ['#70e1f5', '#ffd194'],
  'Facebook Messenger': ['#00c6ff', '#0072ff'],
  SoundCloud: ['#fe8c00', '#f83600'],
  Behongo: ['#52c234', '#061700'],
  ServQuick: ['#485563', '#29323c'],
  Friday: ['#83a4d4', '#b6fbff'],
  Martini: ['#fdfc47', '#24fe41'],
  'Metallic Toad': ['#abbaab', '#ffffff'],
  'Between The Clouds': ['#73c8a9', '#373b44'],
  'Crazy Orange I': ['#d38312', '#a83279'],
  Hersheys: ['#1e130c', '#9a8478'],
  'Talking To Mice Elf': ['#948e99', '#2e1437'],
  'Purple Bliss': ['#360033', '#0b8793'],
  Predawn: ['#ffa17f', '#00223e'],
  'Endless River': ['#43cea2', '#185a9d'],
  'Pastel Orange at the Sun': ['#ffb347', '#ffcc33'],
  Twitch: ['#6441a5', '#2a0845'],
  Instagram: ['#833ab4', '#fd1d1d', '#fcb045'],
  Flickr: ['#ff0084', '#33001b'],
  Vine: ['#00bf8f', '#001510'],
  'Turquoise flow': ['#136a8a', '#267871'],
  Portrait: ['#8e9eab', '#eef2f3'],
  'Virgin America': ['#7b4397', '#dc2430'],
  'Koko Caramel': ['#d1913c', '#ffd194'],
  'Fresh Turboscent': ['#f1f2b5', '#135058'],
  Ukraine: ['#004ff9', '#fff94c'],
  'Curiosity blue': ['#525252', '#3d72b4'],
  Piglet: ['#ee9ca7', '#ffdde1'],
  Lizard: ['#304352', '#d7d2cc'],
  'Sage Persuasion': ['#ccccb2', '#757519'],
  'Between Night and Day': ['#2c3e50', '#3498db'],
  Timber: ['#fc00ff', '#00dbde'],
  Passion: ['#e53935', '#e35d5b'],
  'Clear Sky': ['#005c97', '#363795'],
  'Master Card': ['#f46b45', '#eea849'],
  'Back To Earth': ['#00c9ff', '#92fe9d'],
  'Deep Purple': ['#673ab7', '#512da8'],
  'Little Leaf': ['#76b852', '#8dc26f'],
  'Light Orange': ['#ffb75e', '#ed8f03'],
  'Green and Blue': ['#c2e59c', '#64b3f4'],
  Poncho: ['#403a3e', '#be5869'],
  'Back to the Future': ['#c02425', '#f0cb35'],
  Blush: ['#b24592', '#f15f79'],
  Inbox: ['#457fca', '#5691c8'],
  Purplin: ['#6a3093', '#a044ff'],
  'Pale Wood': ['#eacda3', '#d6ae7b'],
  Haikus: ['#fd746c', '#ff9068'],
  Pizelex: ['#114357', '#f29492'],
  Joomla: ['#1e3c72', '#2a5298'],
  Christmas: ['#2f7336', '#aa3a38'],
  'Minnesota Vikings': ['#5614b0', '#dbd65c'],
  'Miami Dolphins': ['#4da0b0', '#d39d38'],
  Forest: ['#5a3f37', '#2c7744'],
  Nighthawk: ['#2980b9', '#2c3e50'],
  Superman: ['#0099f7', '#f11712'],
  Suzy: ['#834d9b', '#d04ed6'],
  'Dark Skies': ['#4b79a1', '#283e51'],
  Decent: ['#4ca1af', '#c4e0e5'],
  'Purple White': ['#ba5370', '#f4e2d8'],
  Ali: ['#ff4b1f', '#1fddff'],
  Alihossein: ['#f7ff00', '#db36a4'],
  Shahabi: ['#a80077', '#66ff00'],
  'Red Ocean': ['#1d4350', '#a43931'],
  Tranquil: ['#eecda3', '#ef629f'],
  Transfile: ['#16bffd', '#cb3066'],
  Sylvia: ['#ff4b1f', '#ff9068'],
  'Sweet Morning': ['#ff5f6d', '#ffc371'],
  Politics: ['#2196f3', '#f44336'],
  'Bright Vault': ['#00d2ff', '#928dab'],
  'Solid Vault': ['#3a7bd5', '#3a6073'],
  Sunset: ['#0b486b', '#f56217'],
  'Grapefruit Sunset': ['#e96443', '#904e95'],
  'Deep Sea Space': ['#2c3e50', '#4ca1af'],
  Dusk: ['#2c3e50', '#fd746c'],
  'Minimal Red': ['#f00000', '#dc281e'],
  Royal: ['#141e30', '#243b55'],
  Mauve: ['#42275a', '#734b6d'],
  Frost: ['#000428', '#004e92'],
  Lush: ['#56ab2f', '#a8e063'],
  Firewatch: ['#cb2d3e', '#ef473a'],
  Sherbert: ['#f79d00', '#64f38c'],
  'Blood Red': ['#f85032', '#e73827'],
  'Sun on the Horizon': ['#fceabb', '#f8b500'],
  'IIIT Delhi': ['#808080', '#3fada8'],
  Jupiter: ['#ffd89b', '#19547b'],
  '50 Shades of Grey': ['#bdc3c7', '#2c3e50'],
  Dania: ['#be93c5', '#7bc6cc'],
  Limeade: ['#a1ffce', '#faffd1'],
  Disco: ['#4ecdc4', '#556270'],
  'Love Couple': ['#3a6186', '#89253e'],
  'Azure Pop': ['#ef32d9', '#89fffd'],
  Nepal: ['#de6161', '#2657eb'],
  'Cosmic Fusion': ['#ff00cc', '#333399'],
  "Ed's Sunset Gradient": ['#ff7e5f', '#feb47b'],
  'Brady Brady Fun Fun': ['#00c3ff', '#ffff1c'],
  'Black Rosé': ['#f4c4f3', '#fc67fa'],
  Radar: ['#a770ef', '#cf8bf3', '#fdb99b'],
  'Ibiza Sunset': ['#ee0979', '#ff6a00'],
  Dawn: ['#f3904f', '#3b4371'],
  Mild: ['#67b26f', '#4ca2cd'],
  'Vice City': ['#3494e6', '#ec6ead'],
  Jaipur: ['#dbe6f6', '#c5796d'],
  Jodhpur: ['#9cecfb', '#65c7f7', '#0052d4'],
  'Cocoaa Ice': ['#c0c0aa', '#1cefff'],
  EasyMed: ['#dce35b', '#45b649'],
  'Rose Colored Lenses': ['#e8cbc0', '#636fa4'],
  'What lies Beyond': ['#f0f2f0', '#000c40'],
  Roseanna: ['#ffafbd', '#ffc3a0'],
  'Honey Dew': ['#43c6ac', '#f8ffae'],
  'Under the Lake': ['#093028', '#237a57'],
  'The Blue Lagoon': ['#43c6ac', '#191654'],
  'Can You Feel The Love Tonight': ['#4568dc', '#b06ab3'],
  'Very Blue': ['#0575e6', '#021b79'],
  'Love and Liberty': ['#200122', '#6f0000'],
  Orca: ['#44a08d', '#093637'],
  Venice: ['#6190e8', '#a7bfe8'],
  'Pacific Dream': ['#34e89e', '#0f3443'],
  'Learning and Leading': ['#f7971e', '#ffd200'],
  Celestial: ['#c33764', '#1d2671'],
  Purplepine: ['#20002c', '#cbb4d4'],
  'Sha la la': ['#d66d75', '#e29587'],
  Mini: ['#30e8bf', '#ff8235'],
  Maldives: ['#b2fefa', '#0ed2f7'],
  Cinnamint: ['#4ac29a', '#bdfff3'],
  Html: ['#e44d26', '#f16529'],
  Coal: ['#eb5757', '#000000'],
  Sunkist: ['#f2994a', '#f2c94c'],
  'Blue Skies': ['#56ccf2', '#2f80ed'],
  'Chitty Chitty Bang Bang': ['#007991', '#78ffd6'],
  'Visions of Grandeur': ['#000046', '#1cb5e0'],
  'Crystal Clear': ['#159957', '#155799'],
  Mello: ['#c0392b', '#8e44ad'],
  Meridian: ['#283c86', '#45a247'],
  Relay: ['#3a1c71', '#d76d77', '#ffaf7b'],
  Alive: ['#cb356b', '#bd3f32'],
  Scooter: ['#36d1dc', '#5b86e5'],
  Telegram: ['#1c92d2', '#f2fcfe'],
  'Crimson Tide': ['#642b73', '#c6426e'],
  Socialive: ['#06beb6', '#48b1bf'],
  Subu: ['#0cebeb', '#20e3b2', '#29ffc6'],
  'Broken Hearts': ['#d9a7c7', '#fffcdc'],
  'Kimoby Is The New Blue': ['#396afc', '#2948ff'],
  Dull: ['#c9d6ff', '#e2e2e2'],
  Purpink: ['#7f00ff', '#e100ff'],
  'Orange Coral': ['#ff9966', '#ff5e62'],
  Summer: ['#22c1c3', '#fdbb2d'],
  'King Yna': ['#1a2a6c', '#b21f1f', '#fdbb2d'],
  'Velvet Sun': ['#e1eec3', '#f05053'],
  Hydrogen: ['#667db6', '#0082c8', '#0082c8', '#667db6'],
  Argon: ['#03001e', '#7303c0', '#ec38bc', '#fdeff9'],
  Lithium: ['#6d6027', '#d3cbb8'],
  'Digital Water': ['#74ebd5', '#acb6e5'],
  'Orange Fun': ['#fc4a1a', '#f7b733'],
  'Rainbow Blue': ['#00f260', '#0575e6'],
  'Pink Flavour': ['#800080', '#ffc0cb'],
  Sulphur: ['#cac531', '#f3f9a7'],
  Selenium: ['#3c3b3f', '#605c3c'],
  Ohhappiness: ['#00b09b', '#96c93d'],
  Lawrencium: ['#0f0c29', '#302b63', '#24243e'],
  'Relaxing red': ['#fffbd5', '#b20a2c'],
  'Taran Tado': ['#23074d', '#cc5333'],
  Bighead: ['#c94b4b', '#4b134f'],
  'Sublime Vivid': ['#fc466b', '#3f5efb'],
  'Sublime Light': ['#fc5c7d', '#6a82fb'],
  'Pun Yeta': ['#108dc7', '#ef8e38'],
  Quepal: ['#11998e', '#38ef7d'],
  'Sand to Blue': ['#3e5151', '#decba4'],
  'Wedding Day Blues': ['#40e0d0', '#ff8c00', '#ff0080'],
  Shifter: ['#bc4e9c', '#f80759'],
  'Red Sunset': ['#355c7d', '#6c5b7b', '#c06c84'],
  'Moon Purple': ['#4e54c8', '#8f94fb'],
  'Slight Ocean View': ['#a8c0ff', '#3f2b96'],
  eXpresso: ['#ad5389', '#3c1053'],
  Shifty: ['#636363', '#a2ab58'],
  Vanusa: ['#da4453', '#89216b'],
  'Evening Night': ['#005aa7', '#fffde4'],
  Magic: ['#59c173', '#a17fe0', '#5d26c1'],
  'Blue Raspberry': ['#00b4db', '#0083b0'],
  'Citrus Peel': ['#fdc830', '#f37335'],
  Rastafari: ['#1e9600', '#fff200', '#ff0000'],
  'Summer Dog': ['#a8ff78', '#78ffd6'],
  Wiretap: ['#8a2387', '#e94057', '#f27121'],
  'Burning Orange': ['#ff416c', '#ff4b2b'],
  'Ultra Voilet': ['#654ea3', '#eaafc8'],
  'By Design': ['#009fff', '#ec2f4b'],
  'Kyoo Tah': ['#544a7d', '#ffd452'],
  'Kye Meh': ['#8360c3', '#2ebf91'],
  'Kyoo Pal': ['#dd3e54', '#6be585'],
  Metapolis: ['#659999', '#f4791f'],
  Flare: ['#f12711', '#f5af19'],
  'Witching Hour': ['#c31432', '#240b36'],
  'Azur Lane': ['#7f7fd5', '#86a8e7', '#91eae4'],
  Neuromancer: ['#f953c6', '#b91d73'],
  Harvey: ['#1f4037', '#99f2c8'],
  Amin: ['#8e2de2', '#4a00e0'],
  Memariani: ['#aa4b6b', '#6b6b83', '#3b8d99'],
  'Cool Sky': ['#2980b9', '#6dd5fa', '#ffffff'],
  'Dark Ocean': ['#373b44', '#4286f4'],
  'Evening Sunshine': ['#b92b27', '#1565c0'],
  JShine: ['#12c2e9', '#c471ed', '#f64f59'],
  'Moonlit Asteroid': ['#0f2027', '#203a43', '#2c5364'],
  MegaTron: ['#c6ffdd', '#fbd786', '#f7797d'],
  'Cool Blues': ['#2193b0', '#6dd5ed'],
  'Piggy Pink': ['#ee9ca7', '#ffdde1'],
  'Grade Grey': ['#bdc3c7', '#2c3e50'],
  Telko: ['#f36222', '#5cb644', '#007fc3'],
  Zenta: ['#2a2d3e', '#fecb6e'],
  'Electric Peacock': ['#8a2be2', '#0000cd', '#228b22', '#ccff00'],
  'Under Blue Green': ['#051937', '#004d7a', '#008793', '#00bf72', '#a8eb12'],
  Lensod: ['#6025f5', '#ff5555'],
  Newspaper: ['#8a2be2', '#ffa500', '#f8f8ff'],
  'Dark Blue Gradient': ['#2774ae', '#002e5d', '#002e5d'],
  'Dark Blu Two': ['#004680', '#4484ba'],
  'Lemon Lime': ['#7ec6bc', '#ebe717'],
  Beleko: ['#ff1e56', '#f9c942', '#1e90ff'],
  'Mango Papaya': ['#de8a41', '#2ada53'],
  'Unicorn Rainbow': ['#f7f0ac', '#acf7f0', '#f0acf7'],
  Flame: ['#ff0000', '#fdcf58'],
  'Blue Red': ['#36b1c7', '#960b33'],
  Twitter: ['#1da1f2', '#009ffc'],
  Blooze: ['#6da6be', '#4b859e', '#6da6be'],
  'Blue Slate': ['#b5b9ff', '#2b2c49'],
  'Space Light Green': ['#9fa0a8', '#5c7852'],
  Flower: ['#dcffbd', '#cc86d1'],
  'Elate The Euge': ['#8bdeda', '#43add0', '#998ee0', '#e17dc2', '#ef9393'],
  'Peach Sea': ['#e6ae8c', '#a8cecf'],
  Abbas: ['#00fff0', '#0083fe'],
  'Winter Woods': ['#333333', '#a2ab58', '#a43931'],
  Ameena: ['#0c0c6d', '#de512b', '#98d0c1', '#5bb226', '#023c0d'],
  'Emerald Sea': ['#05386b', '#5cdb95'],
  Bleem: ['#4284db', '#29eac4'],
  'Coffee Gold': ['#554023', '#c99846'],
  Compass: ['#516b8b', '#056b3b'],
  "Andreuzza's": ['#d70652', '#ff025e'],
  Moonwalker: ['#152331', '#000000'],
  Whinehouse: ['#f7f7f7', '#b9a0a0', '#794747', '#4e2020', '#111111'],
  'Hyper Blue': ['#59cde9', '#0a2a88'],
  'After the Rain': [
    '#ff75c3',
    '#ffa647',
    '#ffe83f',
    '#9fff5b',
    '#70e2ff',
    '#cd93ff',
  ],
  'Neon Green': ['#81ff8a', '#64965e'],
  'Dusty Grass': ['#d4fc79', '#96e6a1'],
  'Visual Blue': ['#003d4d', '#00c996'],
}

export default gradientDict
