const stateState = require('./lib/state-state');
const routesHolder = require('./lib/routes-holder');

function createStateRouter(makeRenderer) {
	const renderer = makeRenderer();
	const states = stateState();
	const routes = routesHolder();

	function addState({ name, route, template, resolve }) {
		states.add(name, { template, route, name, resolve });
		routes.addRoute({
			route: states.buildFullStateRoute(name),
			name,
		});
	}

	async function renderStatic(route) {
		const { name, params } = routes.getNameFromRoute(route);

		const hierarchy = states.getHierarchy(name);

		const makeState = async (parentChunk, childTemplate, content) => {
			const childChunk = await renderer.renderStatic({
				template: childTemplate,
				paramaters: params,
				content,
			});
			return renderer.insertChild({ parentChunk, childChunk });
		};

		let lastChunk = null;
		for (let i in hierarchy) {
			const state = hierarchy[i];

			const data =
				(state.resolve && (await state.resolve(state, params))) || null;

			if (!lastChunk) {
				lastChunk = await renderer.renderStatic({
					template: state.template,
					paramaters: params,
					content: data,
				});
			} else {
				lastChunk = await makeState(lastChunk, state.template, data);
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
