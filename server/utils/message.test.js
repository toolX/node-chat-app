const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message', () => {
    var from = 'toolX';
    var text = 'Hello world!';
    var message = generateMessage(from, text);
    expect(message).toInclude({from, text});
    expect(message.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'toolX';
    var latitude = 1;
    var longitude = 2;
    var url = 'https://www.google.com/maps?q=1,2';
    var message = generateLocationMessage(from, latitude, longitude);
    expect(message).toInclude({from, url});
    expect(message.createdAt).toBeA('number');
  });
});
