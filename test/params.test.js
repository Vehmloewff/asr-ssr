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
	it(`should return params`, async () => {
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

		expect(await router.renderStatic('/user/this')).toBe(
			`<navbar></navbar><h1>Hello user!</h1>`
		);
	});
	it(`should work with multiple params`, async () => {
		const router = createStateRouter(renderer);

		router.addState({
			name: `app`,
			route: '/',
			template: `<navbar></navbar><slot></slot>`,
		});
		router.addState({
			name: `app.user`,
			route: '/user/:name/:id',
			template: `<h1>Hello user!</h1>`,
		});

		expect(await router.renderStatic('/user/Vehmloewff/1345')).toBe(
			`<navbar></navbar><h1>Hello user!</h1>`
		);
	});
	it(`should call the resolve with the correct params`, async () => {
		const router = createStateRouter(renderer);

		router.addState({
			name: `app`,
			route: '/app/:name/:id',
			template: `<h1>Hello user!</h1>`,
			resolve: (state, params) => {
				expect(params).toMatchObject({
					name: `Vehmloewff`,
					id: `1345`,
				});
			},
		});

		expect(await router.renderStatic('/app/Vehmloewff/1345')).toBe(
			`<h1>Hello user!</h1>`
		);
	});
});
