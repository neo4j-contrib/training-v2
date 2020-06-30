/* eslint-env mocha */
import chai from 'chai'
import dirtyChai from 'dirty-chai'
import GraphAcademy from '../src/index.js'

const expect = chai.expect
chai.use(dirtyChai)

describe('GraphAcademy', () => {
	it('should throw en error when a required option is missing', () => {
		expect(() => {
			new GraphAcademy({})
		}).to.throw(Error, /required option missing/);
	})
})
