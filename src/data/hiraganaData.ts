import { HiraganaCharacter, HiraganaRow } from '../types/index';

export const HIRAGANA_DATA: HiraganaCharacter[] = [
  // --- GOJŪON (BASIC SETS) ---

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

  // N Solo
  { id: 'n', character: 'ん', romanization: 'n', row: 'N_SOLO', rowName: 'N', exampleWord: '本 (hon)', exampleMeaning: 'Book' },


  // --- DAKUON (DAKUTEN ゛) ---

  // G row (Dakuon)
  { id: 'ga', character: 'が', romanization: 'ga', row: 'G', rowName: 'G row (Gō)', exampleWord: '頑固 (ganko)', exampleMeaning: 'Stubborn' },
  { id: 'gi', character: 'ぎ', romanization: 'gi', row: 'G', rowName: 'G row (Gō)', exampleWord: '銀行 (ginkou)', exampleMeaning: 'Bank' },
  { id: 'gu', character: 'ぐ', romanization: 'gu', row: 'G', rowName: 'G row (Gō)', exampleWord: '軍手 (gunte)', exampleMeaning: 'Work gloves' },
  { id: 'ge', character: 'げ', romanization: 'ge', row: 'G', rowName: 'G row (Gō)', exampleWord: '芸術 (geijutsu)', exampleMeaning: 'Art' },
  { id: 'go', character: 'ご', romanization: 'go', row: 'G', rowName: 'G row (Gō)', exampleWord: 'ご飯 (gohan)', exampleMeaning: 'Rice / Meal' },

  // Z row (Dakuon)
  { id: 'za', character: 'ざ', romanization: 'za', row: 'Z', rowName: 'Z row (Za)', exampleWord: '雑誌 (zasshi)', exampleMeaning: 'Magazine' },
  { id: 'ji', character: 'じ', romanization: 'ji', row: 'Z', rowName: 'Z row (Za)', exampleWord: '時間 (jikan)', exampleMeaning: 'Time' },
  { id: 'zu', character: 'ず', romanization: 'zu', row: 'Z', rowName: 'Z row (Za)', exampleWord: 'ずっと (zutto)', exampleMeaning: 'Always / Much' },
  { id: 'ze', character: 'ぜ', romanization: 'ze', row: 'Z', rowName: 'Z row (Za)', exampleWord: 'ゼロ (zero)', exampleMeaning: 'Zero' },
  { id: 'zo', character: 'ぞ', romanization: 'ぞ', row: 'Z', rowName: 'Z row (Za)', exampleWord: '象 (zou)', exampleMeaning: 'Elephant' },

  // D row (Dakuon)
  { id: 'da', character: 'だ', romanization: 'da', row: 'D', rowName: 'D row (Da)', exampleWord: '大学 (daigaku)', exampleMeaning: 'University' },
  { id: 'dji', character: 'ぢ', romanization: 'dji', row: 'D', rowName: 'D row (Da)', exampleWord: '鼻血 (hanaji)', exampleMeaning: 'Nosebleed' },
  { id: 'dzu', character: 'づ', romanization: 'dzu', row: 'D', rowName: 'D row (Da)', exampleWord: '続く (tsuzuku)', exampleMeaning: 'Continue' },
  { id: 'de', character: 'で', romanization: 'de', row: 'D', rowName: 'D row (Da)', exampleWord: '電気 (denki)', exampleMeaning: 'Electricity' },
  { id: 'do', character: 'ど', romanization: 'do', row: 'D', rowName: 'D row (Da)', exampleWord: '友達 (tomodachi)', exampleMeaning: 'Friend' },

  // B row (Dakuon)
  { id: 'ba', character: 'ば', romanization: 'ba', row: 'B', rowName: 'B row (Ba)', exampleWord: 'バス (basu)', exampleMeaning: 'Bus' },
  { id: 'bi', character: 'び', romanization: 'bi', row: 'B', rowName: 'B row (Ba)', exampleWord: '病院 (byouin)', exampleMeaning: 'Hospital' },
  { id: 'bu', character: 'ぶ', romanization: 'bu', row: 'B', rowName: 'B row (Ba)', exampleWord: '豚肉 (butaniku)', exampleMeaning: 'Pork' },
  { id: 'be', character: 'べ', romanization: 'be', row: 'B', rowName: 'B row (Ba)', exampleWord: '勉強 (benkyou)', exampleMeaning: 'Study' },
  { id: 'bo', character: 'ぼ', romanization: 'bo', row: 'B', rowName: 'B row (Ba)', exampleWord: '帽子 (boushi)', exampleMeaning: 'Hat' },


  // --- HANDAKUTEN (HANDAKUTEN ゜) ---

  // P row (Handakuten)
  { id: 'pa', character: 'ぱ', romanization: 'pa', row: 'P', rowName: 'P row (Pa)', exampleWord: 'パン (pan)', exampleMeaning: 'Bread' },
  { id: 'pi', character: 'ぴ', romanization: 'pi', row: 'P', rowName: 'P row (Pa)', exampleWord: 'ピアノ (piano)', exampleMeaning: 'Piano' },
  { id: 'pu', character: 'ぷ', romanization: 'pu', row: 'P', rowName: 'P row (Pa)', exampleWord: 'プール (puuru)', exampleMeaning: 'Swimming pool' },
  { id: 'pe', character: 'ぺ', romanization: 'pe', row: 'P', rowName: 'P row (Pa)', exampleWord: 'ペン (pen)', exampleMeaning: 'Pen' },
  { id: 'po', character: 'ぽ', romanization: 'po', row: 'P', rowName: 'P row (Pa)', exampleWord: 'ポケット (poketto)', exampleMeaning: 'Pocket' },
];

export const HIRAGANA_ROWS: HiraganaRow[] = [
  // Basic Gojūon
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

  // Dakuon (゛)
  { id: 'G', name: 'G (゛)', label: 'が ぎ ぐ げ ご', characters: HIRAGANA_DATA.filter(c => c.row === 'G') },
  { id: 'Z', name: 'Z (゛)', label: 'ざ じ ず ぜ ぞ', characters: HIRAGANA_DATA.filter(c => c.row === 'Z') },
  { id: 'D', name: 'D (゛)', label: 'だ ぢ づ で ど', characters: HIRAGANA_DATA.filter(c => c.row === 'D') },
  { id: 'B', name: 'B (゛)', label: 'ば び ぶ べ ぼ', characters: HIRAGANA_DATA.filter(c => c.row === 'B') },

  // Handakuten (゜)
  { id: 'P', name: 'P (゜)', label: 'ぱ ぴ ぷ ぺ ぽ', characters: HIRAGANA_DATA.filter(c => c.row === 'P') },
];

export const getCharacterByRomanization = (rom: string): HiraganaCharacter | undefined => {
  return HIRAGANA_DATA.find(c => c.romanization.toLowerCase() === rom.toLowerCase());
};

export const getCharacterByChar = (char: string): HiraganaCharacter | undefined => {
  return HIRAGANA_DATA.find(c => c.character === char);
};
