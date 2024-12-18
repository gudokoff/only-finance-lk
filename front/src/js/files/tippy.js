import tippy from 'tippy.js';

window.tippyNote = tippy('[data-tippy-note]', {
	trigger: 'click',
	delay: [100, 200],
	content: (reference) => reference.getAttribute('data-tippy-note'),
	onShow(instance) {
		setTimeout(() => {
			instance.hide();
		}, 1000);
	}
});
