const expect = require('expect');

const {isRealString} = require('./validation');

describe('is real string', () => {
  it('should reject non-string values', () => {
    var result = isRealString(99);
    expect(result).toBe(false);
  });

  it('should reject string with only spaces', () => {
    var result = isRealString(   );
    expect(result).toBe(false);
  });

  it('should allow string with non-space character', () => {
    var result = isRealString('   hello world  ');
    expect(result).toBe(true);
  });
});
