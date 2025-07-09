(function(root, factory){
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ocrUtils = factory();
  }
}(typeof self !== 'undefined' ? self : this, function(){
  const dictionary = [
    'the','be','to','of','and','a','in','that','have','i','it','for','not','on',
    'with','he','as','you','do','at','this','but','his','by','from','they','we',
    'say','her','she','or','an','will','my','one','all','would','there','their',
    'what','so','up','out','if','about','who','get','which','go','me','when',
    'make','can','like','time','no','just','him','know','take','people','into',
    'year','your','good','some','could','them','see','other','than','then',
    'now','look','only','come','its','over','think','also','back','after','use',
    'two','how','our','work','first','well','way','even','new','want','because',
    'any','these','give','day','most','us'
  ];

  function levenshtein(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) dp[i][0] = i;
    for (let j = 0; j <= b.length; j++) dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[a.length][b.length];
  }

  function correctWord(word) {
    let best = word;
    let bestDist = 2;
    const lower = word.toLowerCase();
    for (const dictWord of dictionary) {
      const dist = levenshtein(lower, dictWord);
      if (dist < bestDist) {
        bestDist = dist;
        best = dictWord;
        if (dist === 0) break;
      }
    }
    if (bestDist <= 1 && best !== lower) {
      return word[0] === word[0].toUpperCase() ?
        best.charAt(0).toUpperCase() + best.slice(1) : best;
    }
    return word;
  }

  function correctText(text) {
    return text
      .split(/\b/)
      .map(token => (/^[A-Za-z]+$/.test(token) ? correctWord(token) : token))
      .join('');
  }

  function segmentLines(data) {
    const lines = (data && data.lines) || [];
    return lines.map(l => l.text).join('\n');
  }

  return { correctWord, correctText, segmentLines };
}));
