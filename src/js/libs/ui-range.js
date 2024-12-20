import * as noUiSlider from 'nouislider';
import wNumb from 'wNumb';

function rangeInit() {
	const rangeComponents = document.querySelectorAll(".ui-range");
	if (rangeComponents.length) {
		rangeComponents.forEach(range => {
			const slider = range.querySelector(".ui-range__slider-price");
			if (slider) {
				const rangeMin = parseInt(slider.dataset.min);
				const rangeMax = parseInt(slider.dataset.max);
				const rangeStart = slider.dataset.start;
				const step = parseInt(slider.dataset.step);

				const filterInputs = range.querySelectorAll('input.ui-range__input');

				let rangeStartMin = rangeMin;
				let rangeStartMax = rangeMax;
				if (rangeStart) {
					let rangeStartValues = rangeStart.split(",");
					rangeStartMin = parseInt(rangeStartValues[0]);
					rangeStartMax = parseInt(rangeStartValues[1]);

					slider.classList.add("is-set")
				}

				noUiSlider.create(slider, {
					start: [rangeStartMin, rangeStartMax],
					connect: true,
					step: step,
					handleAttributes: [
						{ 'aria-label': 'lower' },
						{ 'aria-label': 'upper' },
					],
					range: {
						'min': rangeMin,
						'max': rangeMax
					},

					// make numbers whole
					format: {
						to: value => value,
						from: value => value
					}
				});

				let moneyFormat = wNumb({
					mark: '.',
					thousand: ' ',
					decimals: 0,
					prefix: '',
					suffix: ''
				});

				// bind inputs with noUiSlider 
				slider.noUiSlider.on('start', () => {
					window.noUiSliderIsActive = true;
					document.documentElement.classList.add("noUiSliderIsActive");
				});
				slider.noUiSlider.on('end', () => {
					setTimeout(function () {
						window.noUiSliderIsActive = false;
						document.documentElement.classList.remove("noUiSliderIsActive");
					}, 0)
				});
				slider.noUiSlider.on('update', (values, handle) => {
					if (values[0] != rangeStartMin || values[1] != rangeStartMax) {

					}
					filterInputs[handle].value = moneyFormat.to(values[handle]);
					$(filterInputs[handle]).keyup();
				});

				filterInputs.forEach((input, indexInput) => {
					input.addEventListener('focus', (event) => {
						event.target.select();
					});
					input.addEventListener('click', (event) => {
						setTimeout(function () {
							event.target.select();
						}, 0);
					});
					input.addEventListener('keydown', (event) => {
						if (event.code == "ArrowLeft" || event.code == "ArrowRight" || event.code == "ArrowDown" || event.code == "ArrowUp" || event.code == "Backspace" || event.keyCode == 8) {
							setTimeout(function () {
								event.target.select();
							}, 0);
						}
					});
					input.addEventListener('input', () => {
						let price = moneyFormat.from(input.value)
						if (price) {
							input.value = moneyFormat.to(price);
						} else {
							input.value = "";
						}
					});
					input.addEventListener('change', () => {
						if (moneyFormat.from(input.value) >= step) {
							slider.noUiSlider.setHandle(indexInput, moneyFormat.from(input.value));
						}
					});
				});
			}
		});
	};
};
window.rangeSlider = rangeInit;



