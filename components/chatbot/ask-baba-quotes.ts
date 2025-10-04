export const SAI_BABA_QUOTES: string[] = [
  "Allah Malik (God is the Master).",
  "Why fear when I am here?",
  "Trust in Me and your prayer shall be answered.",
  "Be contented and cheerful with what comes.",
  "I give people what they want so that they may begin to want what I want to give them.",
  "If you cast your burden on Me, I shall surely bear it.",
  "Have faith and patience; then I will be always with you wherever you are.",
  "The life ahead can only be glorious if you learn to live in total harmony with the Lord.",
  "If you look to Me, I look to you.",
  "My treasury is full, and I can give anyone anything, but I have to see whether you are qualified to receive."
]

export function getRandomQuote(previous?: string): string {
  if (SAI_BABA_QUOTES.length === 0) return "Blessings to you."
  const pool = previous ? SAI_BABA_QUOTES.filter(q => q !== previous) : SAI_BABA_QUOTES
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}


