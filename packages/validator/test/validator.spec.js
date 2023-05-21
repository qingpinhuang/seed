import validator from '../src/validator.js'

describe('validator.js', () => {
  describe('validate(value, rules)', () => {
    const rules = [
      { type: 'required', message: '不能为空' },
      { type: 'length', params: 6, message: '长度为6' },
      {
        type: 'between',
        params: { min: 6, max: 8 },
        message: '长度在6~8之间',
      },
      { type: 'regexp', params: /^[a-zA-Z]+$/, message: '必须为字母' },
      { validate: (value) => !!value, message: '不能为空' },
      { validate: (value) => ({ valid: !!value }), message: '不能为空' },
      { validate: (value) => ({ valid: !!value, message: '不能为空' }) },
    ]

    it('should return true when validation is successful', () => {
      const result = validator.validate('string', rules)
      expect(result.status).toBe(true)
    })

    it('should return false when validation is failed', () => {
      const results = [
        validator.validate('', [{ type: 'required', message: '不能为空' }]),
        validator.validate('length_error', [{ type: 'length', params: 6, message: '长度为6' }]),
        validator.validate('between_error', [
          {
            type: 'between',
            params: { min: 6, max: 8 },
            message: '长度在6~8之间',
          },
        ]),
        validator.validate('123456', [{ type: 'regexp', params: /^[a-zA-Z]+$/, message: '必须为字母' }]),
        validator.validate('', [{ validate: (value) => !!value, message: '不能为空' }]),
        validator.validate('', [{ validate: (value) => ({ valid: !!value }), message: '不能为空' }]),
        validator.validate('', [{ validate: (value) => ({ valid: !!value, message: '不能为空' }) }]),
      ]
      results.forEach((result) => {
        expect(result.status).toBe(false)
      })
    })

    it('should throw error when rules is invalid', () => {
      expect(() => validator.validate('')).toThrowError()
      expect(() => validator.validate('', [1])).toThrowError()
      expect(() => validator.validate('', [{ type: 'non-existent' }])).toThrowError()
      expect(() => validator.validate('', [{ validate: 'no a function' }])).toThrowError()
      expect(() => validator.validate('', [{ validate: () => 1 }])).toThrowError()
      expect(() => validator.validate('', [{ type: 'length', message: '长度为6' }])).toThrowError()
      expect(() => validator.validate('', [{ type: 'length', params: -1, message: '长度为6' }])).toThrowError()
      expect(() => validator.validate('', [{ type: 'between', message: '长度在6~8之间' }])).toThrowError()
    })
  })
})
