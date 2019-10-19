const pathDataBuilder = require('path-to-regexp-with-reversible-keys');

module.exports = function routesHolder() {
	const routes = [];

	function addRoute({ route, name }) {
		routes.push({ name, regex: pathDataBuilder(route) });
	}

	function getNameFromRoute(route) {
		let worked = null;

		routes.forEach(({ regex, name }) => {
			if (regex.test(route)) worked = name;
		});

		if (!worked) {
			throw new Error(`Could not match route "${route}".`);
		} else return worked;
	}

	return {
		addRoute,
		getNameFromRoute,
	};
};
