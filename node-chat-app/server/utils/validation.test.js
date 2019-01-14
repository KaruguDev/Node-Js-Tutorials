const expect = require('expect')
const {isRealString} = require('./validation')

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var strVal = 1223993
    expect(isRealString(strVal)).toBeFalsy()
  })

  it('should reject string with only spaces', () => {
    var strVal = '    '
    expect(isRealString(strVal)).toBeFalsy()
  })

  it('should allow string with non-space characters', () => {
    var strVal = 'L O R D of R I N G S   '
    expect(isRealString(strVal)).toBeTruthy()
  })
})
