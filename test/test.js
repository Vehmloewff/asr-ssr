const createStateRouter = require('../');

function renderer() {
	return {
		renderStatic: function render({ template, paramaters }, cb) {
			cb(null, template);
		},
		getStaticChild: function getChildElement(renderedTemplateApi, cb) {
			setTimeout(function() {
				cb(null, renderedTemplateApi.getChildElement('ui-view'));
			}, 100);
		},
	};
}

describe(`renderStatic`, () => {
	it(`should return a string`, async () => {
		const router = createStateRouter(renderer);
		const template = '<p>template</p>';

		router.addState({
			name: 'contacts',
			template,
		});

		const staticHTML = await router.renderStatic('contacts');

		expect(staticHTML).toBe(template);
	});
});
