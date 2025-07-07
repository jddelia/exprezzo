const { correctText, segmentLines } = require('../js/ocrUtils');

describe('OCR Utilities', () => {
  test('segmentLines joins text lines', () => {
    const data = { lines: [{ text: 'hello' }, { text: 'world' }] };
    expect(segmentLines(data)).toBe('hello\nworld');
  });

  test('correctText fixes simple typos', () => {
    const input = 'teh quick brown';
    expect(correctText(input)).toBe('the quick brown');
  });

  test('integration segmentation + correction', () => {
    const data = { lines: [{ text: 'teh' }, { text: 'wrold' }] };
    const segmented = segmentLines(data);
    expect(correctText(segmented)).toBe('the world');
  });
});
