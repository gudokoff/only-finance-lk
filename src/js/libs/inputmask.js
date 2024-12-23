// https://github.com/RobinHerbots/Inputmask

// Подключение модуля
import "inputmask/dist/inputmask.min.js";

const phoneMasks = document.querySelectorAll('.js-mask-phone');
if (phoneMasks.length) {
	let inputmask = Inputmask({
		mask: "+7 (999) 999 9999",
		// clearMaskOnLostFocus: false,
	}).mask(phoneMasks);
}

const dateMasks = document.querySelectorAll('.js-mask-date');
if (dateMasks.length) {
	let inputmask = Inputmask({
		jitMasking: true,
		alias: "datetime",
		inputFormat: "dd.mm.yyyy"
	}).mask(dateMasks);
}