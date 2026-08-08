import { getConsciousness } from './suggestTestableSkills';

describe('getConsciousness', () => {
  it('consciousness decreases with increasing time of last repetition', () => {
    const a = getConsciousness([{ beforeDays: 1, correctness: 1 }]);
    const b = getConsciousness([{ beforeDays: 2, correctness: 1 }]);
    expect(a).toBeGreaterThan(b);
    console.log('forget', a, b);
  });
  it('consciousness is considered less when the level of correctness is lower', () => {
    const a = getConsciousness([{ beforeDays: 1, correctness: 1 }]);
    const b = getConsciousness([{ beforeDays: 1, correctness: 0.5 }]);
    expect(a).toBeGreaterThan(b);
    console.log('worse', a, b);
  });
  it('consciousness decreases less after a longer time', () => {
    const a = getConsciousness([{ beforeDays: 1, correctness: 1 }]);
    const b = getConsciousness([{ beforeDays: 2, correctness: 1 }]);
    const c = getConsciousness([{ beforeDays: 9, correctness: 1 }]);
    const d = getConsciousness([{ beforeDays: 10, correctness: 1 }]);
    expect(a - b).toBeGreaterThan(c - d);
  });
  it('consciousness increases with more frequent repetitions', () => {
    // @todo fix
    const a = getConsciousness([
      { beforeDays: 1, correctness: 1 },
      { beforeDays: 2, correctness: 1 },
    ]);
    const b = getConsciousness([{ beforeDays: 1, correctness: 1 }]);
    expect(a).toBeGreaterThan(b);
  });
  it('consciousness decreases with increasing time of last repetition', () => {
    const a = getConsciousness([
      { beforeDays: 1, correctness: 1 },
      { beforeDays: 2, correctness: 1 },
    ]);
    const b = getConsciousness([
      { beforeDays: 2, correctness: 1 },
      { beforeDays: 3, correctness: 1 },
    ]);
    expect(a).toBeGreaterThan(b);
    console.log('forget', a, b);
  });
  it('consciousness is considered less when the level of correctness is lower no matter the good result before', () => {
    const a = getConsciousness([
      { beforeDays: 1, correctness: 1 },
      { beforeDays: 2, correctness: 1 },
    ]);
    const b = getConsciousness([
      { beforeDays: 1, correctness: 0.5 },
      { beforeDays: 2, correctness: 1 },
    ]);
    expect(a).toBeGreaterThan(b);
    console.log('worse', a, b);
  });
  it('consciousness is considered less when the level of correctness is lower no matter the good result after', () => {
    const a = getConsciousness([
      { beforeDays: 1, correctness: 1 },
      { beforeDays: 2, correctness: 1 },
    ]);
    const b = getConsciousness([
      { beforeDays: 1, correctness: 1 },
      { beforeDays: 2, correctness: 0.5 },
    ]);
    expect(a).toBeGreaterThan(b);
  });
  it('consciousness is consiedered less when the last bad result is more recent', () => {
    const a = getConsciousness([
      { beforeDays: 1, correctness: 1 },
      { beforeDays: 5, correctness: 0.5 },
    ]);
    const b = getConsciousness([
      { beforeDays: 1, correctness: 1 },
      { beforeDays: 2, correctness: 0.5 },
    ]);
    expect(a).toBeGreaterThan(b);
    console.log('worse', a, b);
  });
  it.skip('', () => {
    const a = getConsciousness([{ beforeDays: 0.1, correctness: 1 }]);
    const b = getConsciousness([{ beforeDays: 1, correctness: 1 }]);
    expect(a).toBeGreaterThan(b);
    console.log('forget', a, b);
  });
  it.skip('', () => {
    const a = getConsciousness([{ beforeDays: 0.1, correctness: 1 }]);
    const b = getConsciousness([{ beforeDays: 1, correctness: 1 }]);
    expect(a).toBeGreaterThan(b);
    console.log('forget', a, b);
  });
  it.skip('', () => {
    const a = getConsciousness([{ beforeDays: 0.1, correctness: 1 }]);
    const b = getConsciousness([{ beforeDays: 1, correctness: 1 }]);
    expect(a).toBeGreaterThan(b);
    console.log('forget', a, b);
  });
});
