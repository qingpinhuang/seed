import { Snapshot, SnapshotHelper } from '../src/snapshot'

describe('snapshot.js', () => {
  describe('Snapshot', () => {
    const data = { test: 'test' }
    const context = data
    const snapshot = new Snapshot('Test', data, context)

    it("is a class's constructor", () => {
      expect(typeof Snapshot).toBe('function')
    })
    it('has static methods: extends', () => {
      ;['extends'].forEach((func) => {
        expect(Snapshot[func]).toBeDefined()
        expect(typeof Snapshot[func]).toBe('function')
      })
    })
    it('has instance methods: save, restore', () => {
      ;['save', 'restore'].forEach((func) => {
        expect(Snapshot.prototype[func]).toBeDefined()
        expect(typeof Snapshot.prototype[func]).toBe('function')
      })
    })
    it('has instance property: context, origin, keys, SNAPSHOT_KEY', () => {
      expect(snapshot.context).toBe(context)
      expect(snapshot.origin).toBe(data)
      expect(snapshot.keys).toEqual(['test'])
      expect(snapshot.SNAPSHOT_KEY).toEqual('Test')
    })
    it('instance.save()', () => {
      const result = snapshot.save()
      expect(result['Test']).toEqual(data)
    })
    it('instance.restore()', () => {
      const result = snapshot.save()
      const target = snapshot.restore(result)
      expect(target).toEqual(data)
    })
    it('Snapshot.extends()', () => {
      const tempSnapshot = Snapshot.extends({
        save() {
          return 'save()'
        },
        restore() {
          return 'restore()'
        },
      })
      expect(typeof tempSnapshot.save).toBe('function')
      expect(typeof tempSnapshot.restore).toBe('function')
      expect(tempSnapshot.save()).toBe('save()')
      expect(tempSnapshot.restore()).toBe('restore()')
    })
  })

  describe('SnapshotHelper', () => {
    it("is a class's constructor", () => {
      expect(typeof SnapshotHelper).toBe('function')
    })
    it('has static methods: create, add, save, restore', () => {
      ;['create', 'add', 'save', 'restore'].forEach((func) => {
        expect(SnapshotHelper[func]).toBeDefined()
        expect(typeof SnapshotHelper[func]).toBe('function')
      })
    })
    it('has static property: KEY', () => {
      ;['KEY'].forEach((name) => {
        expect(SnapshotHelper[name]).toBeDefined()
      })
    })
    it('SnapshotHelper.create()', () => {
      const data = { test: 'test' }
      const context = data
      SnapshotHelper.create('Test', data, context)
      const snapshot = SnapshotHelper.snapshots.pop()
      expect(snapshot.SNAPSHOT_KEY).toBe('Test')
      expect(snapshot.origin).toEqual(data)
      expect(snapshot.context).toEqual(context)
    })
    it('SnapshotHelper.add()', () => {
      const data = { test: 'test' }
      const context = data
      const snapshot = new Snapshot('Test', data, context)
      SnapshotHelper.add(snapshot)
      expect(SnapshotHelper.snapshots).toEqual([snapshot])
      SnapshotHelper.snapshots = []
    })
    it('SnapshotHelper.save(), SnapshotHelper.restore()', () => {
      const data = { test: 'test' }
      const context = data
      SnapshotHelper.create('Test', data, context)
      data.test = 'test save()'
      SnapshotHelper.save()
      const result = SnapshotHelper.restore()
      expect(result['Test']).toEqual(Object.assign({}, data, { test: 'test save()' }))
      SnapshotHelper.snapshots = []
    })
  })
})
