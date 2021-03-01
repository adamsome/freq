/*! diracdeltas/niceware v2.0.1 | MIT License | https://github.com/diracdeltas/niceware/blob/master/lib/main.js */
import * as crypto from 'crypto'
import wordList from './word-list'

export default function generateWords(entropy = 4): string[] {
  const bytes = crypto.randomBytes(entropy * 2)
  const words = []
  for (const [i, byte] of bytes.entries() as any) {
    const nextByte = bytes[i + 1]
    if (i % 2 === 0) {
      // Word list has 2^11 words, so the byte (256 possible values)
      // times 8 = 2^11 (plus the nextByte 256-option offset)
      const wordIndex = byte * 8 + nextByte
      const word = wordList[wordIndex % wordList.length]
      if (!word) {
        throw new Error('Invalid byte encountered')
      } else {
        words.push(word)
      }
    }
  }
  return words
}
