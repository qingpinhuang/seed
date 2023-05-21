/**
 * 数据校验器
 *
 * @case 使用示例请查看 test/validator.spec.js
 */

const defaultValidator = {
  required: {
    validate(value) {
      return !!String(value)
    },
  },
  length: {
    validate(value, { length }) {
      value = String(value)
      return value.length === length
    },
    params(rule) {
      const length = Number(rule.params)
      if (isNaN(length) || length < 0) {
        throw new Error(`invalid params in rule: ${JSON.stringify(rule)}`)
      }
      return { length }
    },
  },
  between: {
    validate(value, { min, max }) {
      value = String(value)
      return value.length >= min && value.length <= max
    },
    params(rule) {
      let { min, max } = rule.params || {}
      ;[min, max] = [Number(min), Number(max)]
      if (isNaN(min) || isNaN(max) || min < 0 || max < min) {
        throw new Error(`invalid params in rule: ${JSON.stringify(rule)}`)
      }
      return { min, max }
    },
  },
  regexp: {
    validate(value, { regexp }) {
      value = String(value)
      return regexp.test(value)
    },
    params(rule) {
      const regexp = new RegExp(rule.params)
      return { regexp }
    },
  },
}

function getValidate(rule) {
  if (typeof rule !== 'object') {
    throw new Error('rule must be an object with type or validate function')
  }

  const validator = typeof rule.validate === 'function' ? { validate: rule.validate } : defaultValidator[rule.type]
  if (!validator) {
    throw new Error('invalid function or type in rule')
  }
  validator.params = validator.params || (() => {})

  return function (value) {
    const result = validator.validate(value, validator.params(rule))
    if (typeof result === 'boolean') {
      return { valid: result, message: rule.message, rule }
    } else if (result && typeof result.valid === 'boolean') {
      return {
        valid: result.valid,
        message: result.message || rule.message,
        rule,
      }
    } else {
      throw new Error('validate function return an invalid result')
    }
  }
}

function validate(value, rules) {
  if (!Array.isArray(rules)) {
    throw new Error('rules must be an array')
  }

  const errors = []
  rules.forEach((rule) => {
    const _validate = getValidate(rule)
    const result = _validate(value)
    !result.valid && errors.push(result.message)
  })

  return { status: !errors.length, errors }
}

export default {
  validate,
}
