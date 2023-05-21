const alpha = 'a-zA-Z'
const digit = '0-9'

const scheme = `[${alpha}][${alpha}${digit}+-.]*`

const username = '[^:@/?#]*'
const password = '[^@/?#]*'
const userinfo = `(${username})(?::(${password}))?`

const domainlabel = '[^.:/?#]+'
const hostname = `(?:(?:${domainlabel}\\.)*${domainlabel})`
const hostnumber = `(?:(?:${digit}{1-3}\\.){3}${digit}{1-3})`
const port = `[${digit}]+`
const host = `(${hostname}|${hostnumber})(?::(${port}))?`

const path = '[^?#]*'
const query = '[^#]*'
const fragment = '.*'

const rhost = new RegExp(host)
const rurl = new RegExp(
  `^(${scheme}:(?=//))?(?://)?(?:${userinfo}@)?(?:${host})?(/${path})?(\\?${query})?(#${fragment})?`
)

/**
 * URL解析和处理
 *
 * 注意：
 * 1. 这里只是识别和解析URL，并不验证其有效性和准确性
 * 2. URL保留字符（[:@/?#]）作为URL正则匹配的关键节点，以最先匹配到的保留字符为优先进行解析，后面再遇到保留字符时，将作为已匹配的内容理解。
 *    例如有URL：http://username:password@www.qing.com?query=:@/?#hash:@/?#，解析将会得到“?query=:@/?”和“#hash:@/?#”
 *
 * @references
 * 1. [URL](https://en.wikipedia.org/wiki/URL)
 * 2. [Uniform Resource Locators (URL)](https://tools.ietf.org/html/rfc1738)
 * 3. [Internationalized Resource Identifier](https://en.wikipedia.org/wiki/Internationalized_Resource_Identifier)
 * 4. [Internationalized Resource Identifiers (IRIs)](https://tools.ietf.org/html/rfc3987)
 * 5. [Augmented BNF for Syntax Specifications: ABNF](https://tools.ietf.org/html/rfc2234)
 * 6. [URL Living Standard](https://url.spec.whatwg.org)
 *
 * @deprecated
 * 浏览器已支持 `URL`、`URLSearchParams` 等接口实现相关的操作，具体参考如下：
 * 1. [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
 * 2. [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
 */
class URL {
  constructor(href = '') {
    this.href = href
  }
  get host() {
    return this.hostname + (this.port && `:${this.port}`)
  }
  set host(value = '') {
    const matches = value.match(rhost) || []
    Object.assign(this, {
      hostname: matches[1] || '',
      port: matches[2] || '',
    })
  }
  get origin() {
    if (!this.protocol || !this.hostname) return ''
    return `${this.protocol}//${this.host}`
  }
  get href() {
    const userinfo = this.username + (this.password && `:${this.password}`) + ((this.username || this.password) && '@')
    const double_slash = this.protocol || userinfo || this.host || this.pathname ? '//' : ''
    return `${this.protocol}${double_slash}${userinfo}${this.host}${this.pathname}${this.search}${this.hash}`
  }
  set href(value = '') {
    const matches = value.match(rurl) || []
    Object.assign(this, {
      protocol: matches[1] || '',
      username: matches[2] || '',
      password: matches[3] || '',
      hostname: matches[4] || '',
      host: (matches[4] || '') + ((matches[5] && `:${matches[5]}`) || ''),
      port: matches[5] || '',
      pathname: matches[6] || '',
      search: matches[7] || '',
      hash: matches[8] || '',
    })
  }
  toString() {
    return this.href
  }
  getQuery(name) {
    if (!name) return ''
    const query = new RegExp(`[?&]${name}=([^&]*)`)
    const matches = this.search.match(query) || []
    return matches && matches[1] ? matches[1] : ''
  }
  addQuery(name, value) {
    if (!name) return this.href
    const query = new RegExp(`([?&])${name}=[^&]*`)
    if (this.search.search(query) != -1) {
      this.search = this.search.replace(query, `$1${name}=${value}`)
    } else {
      this.search = this.search ? `${this.search}&${name}=${value}` : `?${name}=${value}`
    }
    return this.href
  }
  delQuery(name) {
    if (!name) return this.href
    const query = new RegExp(`([?&])${name}=[^&]*(&?)`)
    if (this.search.search(query) != -1) {
      this.search = this.search.replace(query, (match, p1, p2) => {
        return p2 ? p1 : ''
      })
    }
    return this.href
  }

  static parse(url) {
    return new URL(url)
  }
  static getQuery(url, name) {
    if (!url || !name) return ''
    const location = new URL(url)
    return location.getQuery(name)
  }
  static addQuery(url, name, value) {
    if (!url || !name) return url
    const location = new URL(url)
    return location.addQuery(name, value)
  }
  static delQuery(url, name) {
    if (!url || !name) return url
    const location = new URL(url)
    return location.delQuery(name)
  }
}

export default URL
