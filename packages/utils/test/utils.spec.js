import utils from '../src/utils.js'

describe('utils.js', () => {
  describe('has(obj, key)', () => {
    const obj = { value: 1 }
    it('should be successful when object has the property.', () => {
      expect(utils.has(obj, 'value')).toBe(true)
    })
    it('should be failed when object does not has the property.', () => {
      expect(utils.has(obj, 'key')).toBe(false)
    })
    it('should be failed although parent object has the property.', () => {
      expect(utils.has(obj, 'hasOwnProperty')).toBe(false)
    })
  })

  describe('type(obj)', () => {
    it('will return object type with lowercase.', () => {
      expect(utils.type(null)).toBe('null')
      expect(utils.type(undefined)).toBe('undefined')
      expect(utils.type({})).toBe('object')
      expect(utils.type([])).toBe('array')
      expect(utils.type(new Array())).toBe('array')
      expect(utils.type('str')).toBe('string')
      expect(utils.type(new String('str'))).toBe('string')
      expect(utils.type(1)).toBe('number')
      expect(utils.type(new Number(1))).toBe('number')
      expect(utils.type(/^\d$/)).toBe('regexp')
      expect(utils.type(new RegExp('\\d'))).toBe('regexp')
      expect(utils.type(new Date())).toBe('date')
      expect(utils.type(new Boolean(true))).toBe('boolean')
      expect(utils.type(true)).toBe('boolean')
    })
  })

  describe('trim(text)', () => {
    it('will return empty string when input null.', () => {
      expect(utils.trim(null)).toBe('')
    })
    it('should clear the blank characters at both ends.', () => {
      expect(utils.trim(' string')).toBe('string')
      expect(utils.trim('string ')).toBe('string')
      expect(utils.trim(' string ')).toBe('string')
      expect(utils.trim('   string   ')).toBe('string')
    })
    it('should not clear the blank within the string.', () => {
      expect(utils.trim('str ing')).toBe('str ing')
      expect(utils.trim('  str ing ')).toBe('str ing')
    })
  })

  describe('formatDigits(number, digits)', () => {
    it('will split integer part with comma, default in 3 digits.', () => {
      expect(utils.formatDigits(10000)).toBe('10,000')
      expect(utils.formatDigits(10000.123)).toBe('10,000.123')
      expect(utils.formatDigits(10000, 4)).toBe('1,0000')
      expect(utils.formatDigits(10000.123, 4)).toBe('1,0000.123')
    })
  })

  describe('convertRadix(number, from, to)', () => {
    it('can convert any integer number.', () => {
      expect(utils.convertRadix(8, 10, 2)).toBe('1000')
      expect(utils.convertRadix(10, 16, 8)).toBe('20')
      expect(utils.convertRadix(11, 2, 10)).toBe('3')
    })
    it('parameter "form" and "to" is default to 10.', () => {
      expect(utils.convertRadix(11, 2)).toBe('3')
      expect(utils.convertRadix(10)).toBe('10')
    })
  })

  describe('formatDate(date, format)', () => {
    it('return formatted string.', () => {
      expect(utils.formatDate('2018-09-15 09:05:00', 'yyyy-MM-dd HH:mm:ss')).toBe('2018-09-15 09:05:00')
      expect(utils.formatDate('2018-09-15 09:05:00', 'y-M-d H:m:s')).toBe('18-9-15 9:5:0')
    })
    it('should be ok when the "format" parameter was not input.', () => {
      expect(utils.formatDate('2018-09-15 09:05:00')).toBe('2018-09-15 09:05:00')
    })
  })
})
