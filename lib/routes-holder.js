const pathDataBuilder = require('path-to-regexp-with-reversible-keys');

module.exports = function routesHolder() {
	const routes = [];

	function addRoute({ route, name }) {
		routes.push({ name, regex: pathDataBuilder(route) });
	}

	function getNameFromRoute(route) {
		let workingName = null;
		let metaData = null;

		routes.forEach(({ regex, name }) => {
			const attempt = regex.exec(route);
			if (attempt) {
				workingName = name;
				metaData = attempt;
			}
		});

		if (!workingName) throw new Error(`Could not match route "${route}".`);
		else
			return {
				name: workingName,
				metaData,
			};
	}

	return {
		addRoute,
		getNameFromRoute,
	};
};
