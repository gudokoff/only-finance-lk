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

window.tippyContent = tippy('[data-content-template]', {
	trigger: 'mouseenter click',
	// delay: [100, 200],
	content(reference) {
		const id = reference.getAttribute('data-content-template');
		const template = document.getElementById(id);
		return template.innerHTML;
	},
	allowHTML: true,
	arrow: false,
	placement: 'right-end',
	// onShow(instance) {
	// 	setTimeout(() => {
	// 		instance.hide();
	// 	}, 1000);
	// }
});
