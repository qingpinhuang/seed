import { Snapshot, SnapshotHelper } from '../src/snapshot'

describe('snapshot.js', () => {
  describe('Snapshot', () => {
    const data = { test: 'test' }
    const context = data
    const snapshot = new Snapshot('Test', data, context)

    it("is a class's constructor", () => {
      expect(Snapshot).to.be.a('function')
    })
    it('has static methods: extends', () => {
      ;['extends'].forEach((func) => {
        expect(Snapshot[func]).to.be.a('function')
      })
    })
    it('has instance methods: save, restore', () => {
      ;['save', 'restore'].forEach((func) => {
        expect(Snapshot.prototype[func]).to.be.a('function')
      })
    })
    it('has instance property: context, origin, keys, SNAPSHOT_KEY', () => {
      expect(snapshot.context).to.equal(context)
      expect(snapshot.origin).to.equal(data)
      expect(snapshot.keys).to.deep.equal(['test'])
      expect(snapshot.SNAPSHOT_KEY).to.equal('Test')
    })
    it('instance.save()', () => {
      const result = snapshot.save()
      expect(result['Test']).to.deep.equal(data)
    })
    it('instance.restore()', () => {
      const result = snapshot.save()
      const target = snapshot.restore(result)
      expect(target).to.deep.equal(data)
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
      expect(tempSnapshot.save).to.be.a('function')
      expect(tempSnapshot.restore).to.be.a('function')
      expect(tempSnapshot.save()).to.equal('save()')
      expect(tempSnapshot.restore()).to.equal('restore()')
    })
  })

  describe('SnapshotHelper', () => {
    it("is a class's constructor", () => {
      expect(SnapshotHelper).to.be.a('function')
    })
    it('has static methods: create, add, save, restore', () => {
      ;['create', 'add', 'save', 'restore'].forEach((func) => {
        expect(SnapshotHelper[func]).to.be.a('function')
      })
    })
    it('has static property: KEY', () => {
      expect(SnapshotHelper).to.nested.property('KEY')
    })
    it('SnapshotHelper.create()', () => {
      const data = { test: 'test' }
      const context = data
      SnapshotHelper.create('Test', data, context)
      const snapshot = SnapshotHelper.snapshots.pop()
      expect(snapshot.SNAPSHOT_KEY).to.equal('Test')
      expect(snapshot.origin).to.deep.equal(data)
      expect(snapshot.context).to.deep.equal(context)
    })
    it('SnapshotHelper.add()', () => {
      const data = { test: 'test' }
      const context = data
      const snapshot = new Snapshot('Test', data, context)
      SnapshotHelper.add(snapshot)
      expect(SnapshotHelper.snapshots).to.deep.equal([snapshot])
      SnapshotHelper.snapshots = []
    })
    it('SnapshotHelper.save(), SnapshotHelper.restore()', () => {
      const data = { test: 'test' }
      const context = data
      SnapshotHelper.create('Test', data, context)
      data.test = 'test save()'
      SnapshotHelper.save()
      const result = SnapshotHelper.restore()
      expect(result['Test']).to.deep.equal(Object.assign({}, data, { test: 'test save()' }))
      SnapshotHelper.snapshots = []
    })
  })
})
