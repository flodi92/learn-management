import { getConsciousness } from './suggestTestableSkills';

describe('getConsciousness', () => {
  it('forget', () => {
    const a = getConsciousness([{ beforeDays: 0.1, correctness: 1 }]);
    const b = getConsciousness([{ beforeDays: 1, correctness: 1 }]);
    expect(a).toBeGreaterThan(b);
  });
});
