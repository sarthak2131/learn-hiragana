import { HiraganaCharacter, HiraganaRow } from '../types/index';

export const HIRAGANA_DATA: HiraganaCharacter[] = [
  // A row
  { id: 'a', character: 'あ', romanization: 'a', row: 'A', rowName: 'A row', exampleWord: '朝 (asa)', exampleMeaning: 'Morning' },
  { id: 'i', character: 'い', romanization: 'i', row: 'A', rowName: 'A row', exampleWord: '犬 (inu)', exampleMeaning: 'Dog' },
  { id: 'u', character: 'う', romanization: 'u', row: 'A', rowName: 'A row', exampleWord: '海 (umi)', exampleMeaning: 'Sea / Ocean' },
  { id: 'e', character: 'え', romanization: 'e', row: 'A', rowName: 'A row', exampleWord: '駅 (eki)', exampleMeaning: 'Train station' },
  { id: 'o', character: 'お', romanization: 'o', row: 'A', rowName: 'A row', exampleWord: '茶 (ocha)', exampleMeaning: 'Green tea' },

  // K row
  { id: 'ka', character: 'か', romanization: 'ka', row: 'K', rowName: 'K row', exampleWord: '川 (kawa)', exampleMeaning: 'River' },
  { id: 'ki', character: 'き', romanization: 'ki', row: 'K', rowName: 'K row', exampleWord: '木 (ki)', exampleMeaning: 'Tree / Wood' },
  { id: 'ku', character: 'く', romanization: 'ku', row: 'K', rowName: 'K row', exampleWord: '車 (kuruma)', exampleMeaning: 'Car' },
  { id: 'ke', character: 'け', romanization: 'ke', row: 'K', rowName: 'K row', exampleWord: '毛 (ke)', exampleMeaning: 'Hair' },
  { id: 'ko', character: 'こ', romanization: 'ko', row: 'K', rowName: 'K row', exampleWord: '心 (kokoro)', exampleMeaning: 'Heart / Mind' },

  // S row
  { id: 'sa', character: 'さ', romanization: 'sa', row: 'S', rowName: 'S row', exampleWord: '魚 (sakana)', exampleMeaning: 'Fish' },
  { id: 'shi', character: 'し', romanization: 'shi', row: 'S', rowName: 'S row', exampleWord: '白 (shiro)', exampleMeaning: 'White' },
  { id: 'su', character: 'す', romanization: 'su', row: 'S', rowName: 'S row', exampleWord: '寿司 (sushi)', exampleMeaning: 'Sushi' },
  { id: 'se', character: 'せ', romanization: 'se', row: 'S', rowName: 'S row', exampleWord: '世界 (sekai)', exampleMeaning: 'World' },
  { id: 'so', character: 'そ', romanization: 'so', row: 'S', rowName: 'S row', exampleWord: '空 (sora)', exampleMeaning: 'Sky' },

  // T row
  { id: 'ta', character: 'た', romanization: 'ta', row: 'T', rowName: 'T row', exampleWord: '卵 (tamago)', exampleMeaning: 'Egg' },
  { id: 'chi', character: 'ち', romanization: 'chi', row: 'T', rowName: 'T row', exampleWord: '父 (chichi)', exampleMeaning: 'Father' },
  { id: 'tsu', character: 'つ', romanization: 'tsu', row: 'T', rowName: 'T row', exampleWord: '月 (tsuki)', exampleMeaning: 'Moon / Month' },
  { id: 'te', character: 'て', romanization: 'te', row: 'T', rowName: 'T row', exampleWord: '手 (te)', exampleMeaning: 'Hand' },
  { id: 'to', character: 'と', romanization: 'to', row: 'T', rowName: 'T row', exampleWord: '友 (tomo)', exampleMeaning: 'Friend' },

  // N row
  { id: 'na', character: 'な', romanization: 'na', row: 'N', rowName: 'N row', exampleWord: '夏 (natsu)', exampleMeaning: 'Summer' },
  { id: 'ni', character: 'に', romanization: 'ni', row: 'N', rowName: 'N row', exampleWord: '肉 (niku)', exampleMeaning: 'Meat' },
  { id: 'nu', character: 'ぬ', romanization: 'nu', row: 'N', rowName: 'N row', exampleWord: '犬 (inu)', exampleMeaning: 'Dog' },
  { id: 'ne', character: 'ね', romanization: 'ne', row: 'N', rowName: 'N row', exampleWord: '猫 (neko)', exampleMeaning: 'Cat' },
  { id: 'no', character: 'の', romanization: 'no', row: 'N', rowName: 'N row', exampleWord: '海苔 (nori)', exampleMeaning: 'Seaweed' },

  // H row
  { id: 'ha', character: 'は', romanization: 'ha', row: 'H', rowName: 'H row', exampleWord: '花 (hana)', exampleMeaning: 'Flower' },
  { id: 'hi', character: 'ひ', romanization: 'hi', row: 'H', rowName: 'H row', exampleWord: '光 (hikari)', exampleMeaning: 'Light' },
  { id: 'fu', character: 'ふ', romanization: 'fu', row: 'H', rowName: 'H row', exampleWord: '船 (fune)', exampleMeaning: 'Ship / Boat' },
  { id: 'he', character: 'へ', romanization: 'he', row: 'H', rowName: 'H row', exampleWord: '部屋 (heya)', exampleMeaning: 'Room' },
  { id: 'ho', character: 'ほ', romanization: 'ho', row: 'H', rowName: 'H row', exampleWord: '星 (hoshi)', exampleMeaning: 'Star' },

  // M row
  { id: 'ma', character: 'ま', romanization: 'ma', row: 'M', rowName: 'M row', exampleWord: '町 (machi)', exampleMeaning: 'Town' },
  { id: 'mi', character: 'み', romanization: 'mi', row: 'M', rowName: 'M row', exampleWord: '水 (mizu)', exampleMeaning: 'Water' },
  { id: 'mu', character: 'む', romanization: 'mu', row: 'M', rowName: 'M row', exampleWord: '虫 (mushi)', exampleMeaning: 'Insect' },
  { id: 'me', character: 'め', romanization: 'me', row: 'M', rowName: 'M row', exampleWord: '目 (me)', exampleMeaning: 'Eye' },
  { id: 'mo', character: 'も', romanization: 'mo', row: 'M', rowName: 'M row', exampleWord: '森 (mori)', exampleMeaning: 'Forest' },

  // Y row
  { id: 'ya', character: 'や', romanization: 'ya', row: 'Y', rowName: 'Y row', exampleWord: '山 (yama)', exampleMeaning: 'Mountain' },
  { id: 'yu', character: 'ゆ', romanization: 'yu', row: 'Y', rowName: 'Y row', exampleWord: '雪 (yuki)', exampleMeaning: 'Snow' },
  { id: 'yo', character: 'よ', romanization: 'yo', row: 'Y', rowName: 'Y row', exampleWord: '夜 (yoru)', exampleMeaning: 'Night' },

  // R row
  { id: 'ra', character: 'ら', romanization: 'ra', row: 'R', rowName: 'R row', exampleWord: '桜 (sakura)', exampleMeaning: 'Cherry blossom' },
  { id: 'ri', character: 'り', romanization: 'ri', row: 'R', rowName: 'R row', exampleWord: '林檎 (ringo)', exampleMeaning: 'Apple' },
  { id: 'ru', character: 'る', romanization: 'ru', row: 'R', rowName: 'R row', exampleWord: '留守 (rusu)', exampleMeaning: 'Absence / Away' },
  { id: 're', character: 'れ', romanization: 're', row: 'R', rowName: 'R row', exampleWord: '歴史 (rekishi)', exampleMeaning: 'History' },
  { id: 'ro', character: 'ろ', romanization: 'ro', row: 'R', rowName: 'R row', exampleWord: '六 (roku)', exampleMeaning: 'Six' },

  // W row
  { id: 'wa', character: 'わ', romanization: 'wa', row: 'W', rowName: 'W row', exampleWord: '私 (watashi)', exampleMeaning: 'I / Myself' },
  { id: 'wo', character: 'を', romanization: 'wo', row: 'W', rowName: 'W row', exampleWord: '〜を (wo particle)', exampleMeaning: 'Object particle' },

  // N
  { id: 'n', character: 'ん', romanization: 'n', row: 'N_SOLO', rowName: 'N', exampleWord: '本 (hon)', exampleMeaning: 'Book' },
];

export const HIRAGANA_ROWS: HiraganaRow[] = [
  { id: 'A', name: 'A', label: 'あ い う え お', characters: HIRAGANA_DATA.filter(c => c.row === 'A') },
  { id: 'K', name: 'K', label: 'か き く け こ', characters: HIRAGANA_DATA.filter(c => c.row === 'K') },
  { id: 'S', name: 'S', label: 'さ し す せ そ', characters: HIRAGANA_DATA.filter(c => c.row === 'S') },
  { id: 'T', name: 'T', label: 'た ち つ て と', characters: HIRAGANA_DATA.filter(c => c.row === 'T') },
  { id: 'N', name: 'N', label: 'な に ぬ ね の', characters: HIRAGANA_DATA.filter(c => c.row === 'N') },
  { id: 'H', name: 'H', label: 'は ひ ふ へ ほ', characters: HIRAGANA_DATA.filter(c => c.row === 'H') },
  { id: 'M', name: 'M', label: 'ま み む め も', characters: HIRAGANA_DATA.filter(c => c.row === 'M') },
  { id: 'Y', name: 'Y', label: 'や ゆ よ', characters: HIRAGANA_DATA.filter(c => c.row === 'Y') },
  { id: 'R', name: 'R', label: 'ら り る れ ろ', characters: HIRAGANA_DATA.filter(c => c.row === 'R') },
  { id: 'W', name: 'W', label: 'わ を', characters: HIRAGANA_DATA.filter(c => c.row === 'W') },
  { id: 'N_SOLO', name: 'ん', label: 'ん', characters: HIRAGANA_DATA.filter(c => c.row === 'N_SOLO') },
];

export const getCharacterByRomanization = (rom: string): HiraganaCharacter | undefined => {
  return HIRAGANA_DATA.find(c => c.romanization.toLowerCase() === rom.toLowerCase());
};

export const getCharacterByChar = (char: string): HiraganaCharacter | undefined => {
  return HIRAGANA_DATA.find(c => c.character === char);
};
