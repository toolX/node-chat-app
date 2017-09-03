const expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message', () => {
    var from = 'toolX';
    var text = 'Hello world!';
    var message = generateMessage(from, text);
    expect(message).toInclude({from, text});
    expect(message.createdAt).toBeA('number');
  });
});
