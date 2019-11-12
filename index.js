const stateState = require('./lib/state-state');
const routesHolder = require('./lib/routes-holder');

function createStateRouter(makeRenderer) {
	const renderer = makeRenderer();
	const states = stateState();
	const routes = routesHolder();

	function addState({ name, route, template }) {
		states.add(name, { template, route, name });
		routes.addRoute({
			route: states.buildFullStateRoute(name),
			name,
		});
	}

	async function renderStatic(route) {
		const { name } = routes.getNameFromRoute(route);

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
