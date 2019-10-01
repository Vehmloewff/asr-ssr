const cbPromise = require('./lib/cb-promise');

function createStateRouter(makeRenderer, options) {
	console.log(options);

	const renderer = makeRenderer();

	let states = {};

	function addState({ name, template }) {
		states[name] = { template };
	}

	async function renderStatic(route) {
		const { template } = states[route];

		const staticHTML = await cbPromise(renderer.renderStatic, { template });

		return staticHTML;
	}

	return {
		addState,
		renderStatic,
	};
}

module.exports = createStateRouter;
