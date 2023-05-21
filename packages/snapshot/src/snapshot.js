/**
 * 快照类
 */
class Snapshot {
  /**
   * 初始化快照实例
   * @param {String} id      快照保存标识ID
   * @param {Object} origin  待处理的源数据对象
   * @param {Object} context 数据对象所在的执行上下文，如：在 Vue.Component 中，origin 设置为 data 属性，则 context 为组件实例
   */
  constructor(id, origin, context) {
    this.origin = origin || {}
    this.context = context || origin
    this.keys = Object.keys(this.origin) || []
    this.SNAPSHOT_KEY = id || `Snapshot${this.keys.join('').substring(0, 24)}`
  }
  /**
   * 保存快照数据
   */
  save() {
    const data = {}
    this.keys.forEach((key) => {
      data[key] = this.context[key]
    })
    return {
      [this.SNAPSHOT_KEY]: data,
    }
  }
  /**
   * 用快照数据恢复
   * @param {Object} data 快照数据
   */
  restore(data = {}) {
    if (!data || !data[this.SNAPSHOT_KEY]) return
    const _data = data[this.SNAPSHOT_KEY]
    this.keys.forEach((key) => {
      this.context[key] = _data[key]
    })
    return _data
  }
  /**
   * 重写快照保存/恢复处理方法
   * @param {Object} snapshot 快照保存/恢复处理方法管理对象
   * @param {Function} snapshot.save    快照保存处理方法
   * @param {Function} snapshot.restore 快照恢复处理方法
   */
  static extends(snapshot) {
    const _snapshot = new Snapshot()
    ;['save', 'restore'].forEach((name) => {
      const func = snapshot[name]
      if (func) {
        _snapshot[name] = func
      }
    })
    return _snapshot
  }
}

/**
 * 快照管理类
 */
class SnapshotHelper {
  /**
   * 缓存key
   */
  static KEY = '_SNAPSHOT_'
  /**
   * 创建快照实例，并自动添加到管理数组中
   * @param {String} id      快照保存标识ID
   * @param {Object} origin  待处理的源数据对象
   * @param {Object} context 源数据对象所在的执行上下文
   */
  static create(id, origin, context) {
    const snapshot = new Snapshot(id, origin, context)
    SnapshotHelper.add(snapshot)
  }
  /**
   * 添加需要处理的快照实例
   * @param {Snapshot} snapshot 快照实例
   */
  static add(snapshot) {
    if (!Array.isArray(SnapshotHelper.snapshots)) {
      SnapshotHelper.snapshots = []
    }
    if (snapshot instanceof Snapshot) {
      SnapshotHelper.snapshots.push(snapshot)
    }
  }
  /**
   * 保存快照
   */
  static save(key) {
    const target = {
      __key__: key,
    }
    SnapshotHelper.snapshots.forEach((snapshot) => {
      Object.assign(target, snapshot.save && snapshot.save())
    })
    sessionStorage.setItem(SnapshotHelper.KEY, JSON.stringify(target))
  }
  /**
   * 恢复快照
   */
  static restore(key) {
    let data
    try {
      data = JSON.parse(sessionStorage.getItem(SnapshotHelper.KEY))
    } catch (err) {
      // console.error(err)
    }

    if (!data || data.__key__ != key) return

    SnapshotHelper.snapshots.forEach((snapshot) => {
      snapshot.restore && snapshot.restore(data)
    })
    sessionStorage.removeItem(SnapshotHelper.KEY)
    return data
  }
}

export { Snapshot, SnapshotHelper }
