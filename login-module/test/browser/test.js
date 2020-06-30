/* global GraphAcademyLogin */
(async () => {
	let reporter
	if (typeof mochaOpts === 'function') {
		reporter = await mochaOpts().reporter
	} else {
		reporter = 'html'
	}
	mocha.setup({
		ui: 'bdd',
		checkLeaks: false,
		reporter: reporter
	})

	const expect = chai.expect

	describe('GraphAcademy', () => {
		it('should throw en error when a required option is missing', () => {
			expect(() => {
				new GraphAcademyLogin({})
			}).to.throw(Error, /required option missing/);
		})
	})

	mocha.run(function (failures) {
		if (failures > 0) {
			console.error('%d failures', failures)
		}
	})
})().catch(err => {
	console.error('Unable to start the browser tests suite: ' + err)
})
