/**
 * 常用工具方法
 */

const hasOwnProperty = Object.prototype.hasOwnProperty
const toString = Object.prototype.toString

const rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

//
// Object
//

/**
 * 判断对象自身是否具有指定的属性
 * @param  {Object}  obj 目标对象
 * @param  {String}  key 属性名
 * @return {Boolean}
 */
function has(obj, key) {
  return obj != null && hasOwnProperty.call(obj, key)
}

/**
 * 获取变量的类型，参数可以是任何类型的变量
 * @param  {Object} obj
 * @return {String}
 */
function type(obj) {
  return obj == null ? obj + '' : toString.call(obj).slice(8, -1).toLowerCase()
}

//
// String
//

/**
 * 去除字符串两边的空格
 * @param  {String} text
 * @return {String}
 */
function trim(text) {
  return text == null ? '' : (text + '').replace(rtrim, '')
}

//
// Number
//

/**
 * 添加逗号（,）分隔数字，支持整数和浮点数
 * @param  {Number} number
 * @return {String}
 */
function formatDigits(number, bits = 3) {
  const reg = new RegExp(`(\\d{1,${bits}})(?=(\\d{${bits}})+$)`, 'g')
  number = `${number}`.split('.')
  number[0] = number[0].replace(reg, '$1,')
  return number.join('.')
}

/**
 * 数字进制转换
 * @param  {String} number 2-36进制的任意整数
 * @param  {Number} from   数字本身的进制类型，取值范围：[2, 36]
 * @param  {Number} to     期望转换到的进制类型，取值范围：[2, 36]
 * @return {String}
 */
function convertRadix(number, from = 10, to = 10) {
  return parseInt(number, from).toString(to)
}

//
// Date
//

/**
 * 按照指定的格式格式化时间
 * @param  {Date} date     时间，可以是时间戳（精确到毫秒），日期对象和其它可以通过Date转化为日期的日期字符串
 * @param  {String} format 时间格式化方式，比如：yyyy-MM-dd HH:mm:ss
 *                         日期转化规则（示例时间：Sat Sep 15 2018 01:53:09 GMT+0800 (中国标准时间)）：
 *                         yyyy -> 2018  4位数字的年份表示
 *                         y    -> 18    去掉千位数后剩下的年份数字
 *                         MM   -> 09    固定展示2位数字的月份，不足时补0
 *                         M    -> 9     展示月份本身的数字，不补0
 *                         dd   -> 15    日期，规则同月份的MM
 *                         d    -> 15    日期，规则同月份的M
 *                         HH   -> 01    小时，规则同月份的MM
 *                         H    -> 1     小时，规则同月份的M
 *                         mm   -> 53    分钟，规则同月份的MM
 *                         m    -> 53    分钟，规则同月份的M
 *                         ss   -> 09    秒钟，规则同月份的MM
 *                         s    -> 9     秒钟，规则同月份的M
 * @return {String}
 */
function formatDate(date, format = 'yyyy-MM-dd HH:mm:ss') {
  date = new Date(date)

  let year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds()

  const fillZero = (num) => `${num}`.replace(/^(\d)$/, '0$1')

  return format
    .replace('yyyy', year)
    .replace('y', `${year}`.replace(/^\d0*/, ''))
    .replace('MM', fillZero(month))
    .replace('M', month)
    .replace('dd', fillZero(day))
    .replace('d', day)
    .replace('HH', fillZero(hour))
    .replace('H', hour)
    .replace('mm', fillZero(minute))
    .replace('m', minute)
    .replace('ss', fillZero(second))
    .replace('s', second)
}

//
// Utils
//

/**
 * 防抖：频繁触发时，只在最后一刻执行函数
 * @param {Function} func 待防抖的函数
 * @param {Number} delay 延迟时间
 */
export function debounce(func, delay = 300) {
  let timeout

  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 限频：频繁触发时，按照限定的时间间隔执行函数
 * @param {Function} func 待限频的函数
 * @param {Number} delay 延迟时间
 */
export function throttle(func, delay = 300) {
  let shouldWait = false

  return (...args) => {
    if (shouldWait) return

    func.apply(this, args)
    shouldWait = true
    setTimeout(() => {
      shouldWait = false
    }, delay)
  }
}

export default {
  // Object
  has,
  type,

  // String
  trim,

  // Number
  formatDigits,
  convertRadix,

  // Date
  formatDate,

  // Utils
  debounce,
  throttle,
}
