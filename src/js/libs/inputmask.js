// https://github.com/RobinHerbots/Inputmask

// Подключение модуля
import "inputmask/dist/inputmask.min.js";

const inputMasks = document.querySelectorAll('.js-mask-phone');
if (inputMasks.length) {
	let inputmask = Inputmask({
		mask: "+7 (999) 999 9999",
		// clearMaskOnLostFocus: false,
	}).mask(inputMasks);
}