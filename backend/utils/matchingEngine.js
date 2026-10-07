function calculateMatchScore(newItem, existingItem) {
  let score = 0;

  // 1. Category comparison (30 pts)
  if (newItem.category.toLowerCase() === existingItem.category.toLowerCase()) {
    score += 30;
  }

  // 2. Keyword tokenization & matching (30 pts)
  const getTokens = (str) =>
    (str || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);

  const newTokens = new Set([...getTokens(newItem.title), ...getTokens(newItem.description)]);
  const existingTokens = new Set([...getTokens(existingItem.title), ...getTokens(existingItem.description)]);

  const commonWords = [...newTokens].filter((word) => existingTokens.has(word));
  if (newTokens.size > 0 && existingTokens.size > 0) {
    const keywordOverlapRatio = commonWords.length / Math.min(newTokens.size, existingTokens.size);
    score += Math.round(keywordOverlapRatio * 30);
  }

  // 3. Location matching (20 pts)
  if (newItem.location.trim().toLowerCase() === existingItem.location.trim().toLowerCase()) {
    score += 20;
  }

  // 4. Date proximity (20 pts)
  const dayDiff = Math.abs(new Date(newItem.date) - new Date(existingItem.date)) / (1000 * 60 * 60 * 24);
  if (dayDiff <= 1) {
    score += 20;
  } else if (dayDiff <= 3) {
    score += 15;
  } else if (dayDiff <= 7) {
    score += 10;
  }

  return Math.min(score, 100);
}

module.exports = { calculateMatchScore };