const createStateRouter = require('../');

function renderer() {
	return {
		renderStatic: async ({ template }) => {
			return template;
		},
		insertChild: async ({ parentChunk, childChunk }) => {
			return parentChunk.replace(/<slot>\w*<\/slot>/im, childChunk);
		},
	};
}

describe(`params`, () => {
	it(`should return params`, () => {
		const router = createStateRouter(renderer);

		router.addState({
			name: `app`,
			route: '/',
			template: `<navbar></navbar><slot></slot>`,
		});
		router.addState({
			name: `app.user`,
			route: '/user/:name',
			template: `<h1>Hello user!</h1>`,
		});

		expect(router.renderStatic('/app/user/Vehmloewff')).toBe(
			`<navbar></navbar><h1>Hello user!</h1>`
		);
	});
});
