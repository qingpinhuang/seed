import URL from '../src/url.js'

describe('url.js', () => {
  const matchers = {
    toBeURLObject: () => {
      return {
        compare: (actual, expected = {}) => {
          let result = { pass: true }
          for (const key in expected) {
            if (Object.prototype.hasOwnProperty.call(expected, key)) {
              if (expected[key] !== actual[key]) {
                result.pass = false
                result.message = `Expected '${key}' to be '${expected[key]}', but '${actual[key]}' in actual.`
              }
            }
          }
          return result
        },
      }
    },
  }

  beforeEach(() => {
    jasmine.addMatchers(matchers)
  })

  describe('URL', () => {
    it("is a class's constructor", () => {
      expect(typeof URL).toBe('function')
    })
    it('has static methods: parse, getQuery, addQuery, delQuery', () => {
      ;['parse', 'getQuery', 'addQuery', 'delQuery'].forEach((func) => {
        expect(URL[func]).toBeDefined()
        expect(typeof URL[func]).toBe('function')
      })
    })
  })

  describe('URL instance', () => {
    const url = 'https://username:password@hostname.com:8888/path/to/file.html?query=string&result=object#hash'
    const location = new URL(url)
    it('is an object', () => {
      expect(typeof location).toBe('object')
      expect(location instanceof URL).toBe(true)
    })
    it('with instance properties', () => {
      expect(location).toBeURLObject({
        href: url,
        host: 'hostname.com:8888',
        protocol: 'https:',
        origin: 'https://hostname.com:8888',
        username: 'username',
        password: 'password',
        hostname: 'hostname.com',
        port: '8888',
        pathname: '/path/to/file.html',
        search: '?query=string&result=object',
        hash: '#hash',
      })
    })
    it('has instance methods: toString, getQuery, addQuery, delQuery', () => {
      ;['toString', 'getQuery', 'addQuery', 'delQuery'].forEach((func) => {
        expect(location[func]).toBeDefined()
        expect(typeof location[func]).toBe('function')
      })
    })
    it('created by empty parameter', () => {
      const empty = new URL()
      expect(empty).toBeURLObject({
        href: '',
        host: '',
        protocol: '',
        origin: '',
        username: '',
        password: '',
        hostname: '',
        port: '',
        pathname: '',
        search: '',
        hash: '',
      })
    })
    it('can change host and href', () => {
      const temp = new URL()
      temp.host = 'www.qing.com:80'
      expect(temp).toBeURLObject({
        href: '//www.qing.com:80',
        host: 'www.qing.com:80',
        protocol: '',
        origin: '',
        username: '',
        password: '',
        hostname: 'www.qing.com',
        port: '80',
        pathname: '',
        search: '',
        hash: '',
      })

      temp.href = 'http://qing.com:8888/path/file.html'
      expect(temp).toBeURLObject({
        href: 'http://qing.com:8888/path/file.html',
        host: 'qing.com:8888',
        protocol: 'http:',
        origin: 'http://qing.com:8888',
        username: '',
        password: '',
        hostname: 'qing.com',
        port: '8888',
        pathname: '/path/file.html',
        search: '',
        hash: '',
      })

      temp.host = ''
      expect(temp).toBeURLObject({
        href: 'http:///path/file.html',
        host: '',
        protocol: 'http:',
        origin: '',
        username: '',
        password: '',
        hostname: '',
        port: '',
        pathname: '/path/file.html',
        search: '',
        hash: '',
      })

      temp.href = undefined
      expect(temp).toBeURLObject({
        href: '',
        host: '',
        protocol: '',
        origin: '',
        username: '',
        password: '',
        hostname: '',
        port: '',
        pathname: '',
        search: '',
        hash: '',
      })
    })
    it('execute toString() will return href', () => {
      expect(location.toString()).toBe(url)
    })
  })

  describe('URL.parse', () => {
    it('will parse url and return URL instance', () => {
      const url = 'https://username:password@qing.com:8888/path/to/file.html?query=q#hash'
      const location = URL.parse(url)
      expect(location).toBeURLObject({
        href: url,
        host: 'qing.com:8888',
        protocol: 'https:',
        origin: 'https://qing.com:8888',
        username: 'username',
        password: 'password',
        hostname: 'qing.com',
        port: '8888',
        pathname: '/path/to/file.html',
        search: '?query=q',
        hash: '#hash',
      })
    })
    it('can parse internationalized url', () => {
      const url = 'http://中文.域名:80/路径/示例.html?query=条件&更多=more#哈希'
      const location = URL.parse(url)
      expect(location).toBeURLObject({
        href: url,
        host: '中文.域名:80',
        protocol: 'http:',
        origin: 'http://中文.域名:80',
        username: '',
        password: '',
        hostname: '中文.域名',
        port: '80',
        pathname: '/路径/示例.html',
        search: '?query=条件&更多=more',
        hash: '#哈希',
      })
    })
    it('can parse url although protocol is absent', () => {
      const url = 'www.qing.com/path/to/file.html'
      const location = URL.parse(url)
      expect(location).toBeURLObject({
        href: `//${url}`,
        host: 'www.qing.com',
        protocol: '',
        origin: '',
        username: '',
        password: '',
        hostname: 'www.qing.com',
        port: '',
        pathname: '/path/to/file.html',
        search: '',
        hash: '',
      })
    })
    it('should follow "first-match-wins" to deal url', () => {
      const url = 'http://username:password@www.qing.com?query=:@/?#hash:@/?#'
      const location = URL.parse(url)
      expect(location).toBeURLObject({
        href: url,
        host: 'www.qing.com',
        protocol: 'http:',
        origin: 'http://www.qing.com',
        username: 'username',
        password: 'password',
        hostname: 'www.qing.com',
        port: '',
        pathname: '',
        search: '?query=:@/?',
        hash: '#hash:@/?#',
      })
    })
  })

  describe('URL.getQuery, instance.getQuery', () => {
    const url = 'http://qing.com/path/file.html?query=one&two=2'
    it('should return query value when it has', () => {
      expect(URL.getQuery(url, 'query')).toBe('one')
    })
    it("should return empty string when it don't has", () => {
      expect(URL.getQuery(url, 'three')).toBe('')
    })
    it('shoult return empty string when name is absent', () => {
      expect(URL.getQuery(url)).toBe('')
      expect(new URL().getQuery()).toBe('')
    })
  })

  describe('URL.addQuery, instance.addQuery', () => {
    const url = 'http://qing.com/path/file.html'
    it("should add new query when it hasn't", () => {
      let temp = URL.addQuery(url, 'query', 'one')
      temp = URL.addQuery(temp, 'two', '2')
      expect(URL.getQuery(temp, 'query')).toBe('one')
      expect(URL.getQuery(temp, 'two')).toBe('2')
    })
    it('should not change when name is absent', () => {
      expect(URL.addQuery(url)).toBe(url)
      expect(new URL(url).addQuery()).toBe(url)
    })
    it('should replace old value when it has', () => {
      let temp = URL.addQuery(url, 'query', 'one')
      expect(URL.getQuery(temp, 'query')).toBe('one')
      temp = URL.addQuery(temp, 'query', '2')
      expect(URL.getQuery(temp, 'query')).toBe('2')
    })
  })

  describe('URL.delQuery, instance.delQuery', () => {
    const url = 'http://qing.com/path/file.html?query=one&two=2'
    it('should delete query when it has', () => {
      let temp = url
      expect(URL.getQuery(temp, 'query')).toBe('one')
      temp = URL.delQuery(temp, 'query')
      expect(URL.getQuery(temp, 'query')).toBe('')

      expect(URL.getQuery(temp, 'two')).toBe('2')
      temp = URL.delQuery(temp, 'two')
      expect(URL.getQuery(temp, 'two')).toBe('')

      temp = URL.delQuery(temp, 'three')
      expect(temp).toBe('http://qing.com/path/file.html')
    })
    it('should not change when name is absent', () => {
      expect(URL.delQuery(url)).toBe(url)
      expect(new URL(url).delQuery()).toBe(url)
    })
  })
})
