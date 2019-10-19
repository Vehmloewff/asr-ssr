// From https://github.com/TehShrike/abstract-state-router/blob/master/lib/state-string-parser.js

module.exports = (stateString) => {
	return stateString.split('.').reduce((stateNames, latestNameChunk) => {
		stateNames.push(
			stateNames.length
				? stateNames[stateNames.length - 1] + '.' + latestNameChunk
				: latestNameChunk
		);

		return stateNames;
	}, []);
};
