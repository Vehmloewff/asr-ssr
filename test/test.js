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

describe(`The Basic Functionality`, () => {
	it(`should return the state template`, async () => {
		const router = createStateRouter(renderer);
		const template = '<p>template</p>';

		router.addState({
			name: 'contacts',
			template,
		});

		const staticHTML = await router.renderStatic('contacts');

		expect(staticHTML).toBe(template);
	});

	it(`should return the state template multipule times`, async () => {
		const router = createStateRouter(renderer);
		const contactsTemplate = '<p>template</p>';
		const listTemplate = '<p>list</p>';

		router.addState({
			name: 'contacts',
			template: contactsTemplate,
		});
		router.addState({
			name: 'list',
			template: listTemplate,
		});

		expect(await router.renderStatic('contacts')).toBe(contactsTemplate);
		expect(await router.renderStatic('list')).toBe(listTemplate);
	});

	it(`should return child states`, async () => {
		const router = createStateRouter(renderer);
		const app = `<navbar></navbar><slot></slot>`;
		const user = `<h1>Hello Elijah</h1>`;
		const appUser = `<navbar></navbar><h1>Hello Elijah</h1>`;

		router.addState({
			name: 'app',
			template: app,
		});
		router.addState({
			name: 'app.user',
			template: user,
		});

		expect(await router.renderStatic(`app.user`)).toBe(appUser);
	});
});
