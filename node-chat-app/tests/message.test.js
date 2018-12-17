var expect = require('expect')
var path = require('path')

var msgPath = path.join(__dirname, '../server/utils/message.js')

var {generateMessage} = require(msgPath)
describe('generateMessage', () => {
  it('generate the right output', () => {
    var from = 'Test'
    var text = 'This is a test message'

    result = generateMessage(from, text)

    expect(result.from).toBe(from)
    expect(result.text).toBe(text)
    expect(typeof result.timestamp).toBe('number')

  })

})
