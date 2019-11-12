const pathDataBuilder = require('path-to-regexp-with-reversible-keys');

module.exports = function routesHolder() {
	const routes = [];

	function addRoute({ route, name }) {
		routes.push({ name, regex: pathDataBuilder(route) });
	}

	function getParams(keys, values) {
		values.shift();

		const params = {};

		keys.forEach((key) => {
			const value = values[0];

			params[key.name] = value;

			values.shift();
		});

		return params;
	}

	function getNameFromRoute(route) {
		let workingName = null;
		let params = null;

		routes.forEach(({ regex, name }) => {
			const attempt = regex.exec(route);
			if (attempt) {
				workingName = name;
				params = getParams(regex.keys, attempt);
			}
		});

		if (!workingName) throw new Error(`Could not match route "${route}".`);
		else
			return {
				name: workingName,
				params,
			};
	}

	return {
		addRoute,
		getNameFromRoute,
	};
};
