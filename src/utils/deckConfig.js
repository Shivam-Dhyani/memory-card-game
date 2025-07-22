const emojiPool = [
  "🐶",
  "🐱",
  "🐼",
  "🦊",
  "🐵",
  "🐸",
  "🐷",
  "🦁",
  "🐯",
  "🐮",
  "🐔",
  "🦄",
  "🐙",
  "🐠",
  "🐳",
  "🐞",
  "🦋",
  "🐢",
  "🦕",
  "🐍",
  "🐝",
  "🐧",
  "🦓",
  "🦔",
];

export const createShuffledDeck = (pairCount = 8) => {
  const selected = emojiPool.slice(0, pairCount);
  const deck = [...selected, ...selected].map((symbol, index) => ({
    id: index + "-" + symbol,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));

  // Fisher-Yates Shuffle Algorithm / Knuth Shuffle Algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

export const getPairCount = (difficulty) =>
  difficulty === "hard" ? 18 : difficulty === "easy" ? 8 : 0;
