const stateState = require('./lib/state-state');

function createStateRouter(makeRenderer) {
	const renderer = makeRenderer();
	const states = stateState();

	function addState({ name, template }) {
		states.add(name, { template });
	}

	async function renderStatic(name) {
		const hierarchy = states.getHierarchy(name);

		const makeState = async (parentChunk, childTemplate) => {
			const childChunk = await renderer.renderStatic({
				template: childTemplate,
			});
			return renderer.insertChild({ parentChunk, childChunk });
		};

		let lastChunk = null;
		for (let i in hierarchy) {
			const template = hierarchy[i].template;

			if (!lastChunk) {
				lastChunk = await renderer.renderStatic({ template });
			} else {
				lastChunk = await makeState(lastChunk, template);
			}
		}

		return lastChunk;
	}

	return {
		addState,
		renderStatic,
	};
}

module.exports = createStateRouter;
