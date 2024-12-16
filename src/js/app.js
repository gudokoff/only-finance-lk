// Подключение основного файла стилей
import "../scss/style.scss";

import $ from "jquery";
window.$ = $;
window.jQuery = jQuery;

import "./libs/ui-modal.js";
import * as flsFunctions from "./functions.js";
// Chart
// import { Chart, DoughnutController, ArcElement, CategoryScale, LinearScale, BarController, BarElement, Tooltip } from 'chart.js';
// import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.register(DoughnutController, ArcElement, CategoryScale, LinearScale, BarController, BarElement, ChartDataLabels, Tooltip);

import validate from "jquery-validation";

document.addEventListener("DOMContentLoaded", function () {
	(async () => {
		jQuery.validator.addMethod("email", function (value, element) {
			return this.optional(element) || /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*")@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)$)|\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i.test(value);
		});
		jQuery.extend(jQuery.validator.messages, {
			required: "Ошибка в данных",
			remote: "Пожалуйста, исправьте это поле",
			email: "Ошибка в данных",
			url: "Введите корректный URL",
			date: "Ошибка в данных",
			checkDate: "Ошибка в данных",
			dateISO: "Введите правильную дату (ГГ.ММ.ДД).",
			number: "Введите правильный номер",
			digits: "Введите только цифры",
			creditcard: "Неверный номер карты",
			checkMask: "Номер телефона введен не правильно",
			equalTo: "Пожалуйста, введите значение повторно",
			accept: "Пожалуйста, введите значение с допустимым расширением",
			maxlength: jQuery.validator.format("ошибка в данных"),
			minlength: jQuery.validator.format("ошибка в данных"),
			rangelength: jQuery.validator.format("Пожалуйста, введите значение от {0} до {1} символов."),
			range: jQuery.validator.format("Введите значение между {0} до {1}."),
			max: jQuery.validator.format("Введите значение меньше или равное {0}."),
			min: jQuery.validator.format("Введите значение больше или равное {0}.")
		});

		// Валидация аторизации
		$(".js-validate-auth").each(function () {
			$(this).validate({
				errorClass: "is-error",
				validClass: "is-success",
				errorElement: "span",
				rules: {
					EMAIL: {
						required: true,
						email: true,
					},
					PASSWORD: {
						required: true,
					},
				},
				submitHandler: function (form) {
					// form.submit();

					document.dispatchEvent(
						new CustomEvent('formSubmit', {
							detail: {
								form: form,
							},
						})
					);
				}
			});
		});

		document.addEventListener("formSubmit", function (e) {
			let form = e.detail.form;
			if (form) {
				if (form.classList.contains("js-form-forgot")) {
					$(form).hide();
					$(".c-auth__content").show();
					setTimeout(function () {
						$(form).remove();
					}, 0);
				}
			}
		});

		flsFunctions.passwordToggleVisible();
		
		// Dropdown
		const dropdowns = document.querySelectorAll(".ui-dropdown");
		if (dropdowns.length) {
			dropdowns.forEach(function (dropdown) {
				if (dropdown) {

					let btn = dropdown.querySelector(".ui-dropdown__btn");
					let btnValue = btn.querySelector(".ui-dropdown__btn-value");
					let dropdownBody = dropdown.querySelector(".ui-dropdown__body");
					let bodyOptions = dropdownBody.querySelectorAll("a");

					document.addEventListener("click", function (e) {
						if (dropdown.classList.contains("for-hover") && flsFunctions.mediaWidth() > flsFunctions.mediaBreakpoints["lg"]) {
							return false;
						}

						let targetButton = e.target;
						if (targetButton.closest(".ui-dropdown__btn") == btn) {
							if (dropdown.classList.contains('is-active')) {
								dropdown.classList.remove("is-active");
							} else {
								dropdown.classList.add("is-active");
							}
						} else {
							dropdown.classList.remove("is-active");
						}
					});

					if (bodyOptions.length) {
						bodyOptions.forEach(function (option) {
							if (option) {
								option.addEventListener("click", function (e) {
									if (dropdown.classList.contains("for-hover")) {
										return false;
									}
									e.preventDefault();
									let value = option.textContent;
									btnValue.innerHTML = value;
									dropdown.classList.remove("is-active");
								});
							}
						});
					}
				}
			})
		}

		// Input field focus
		$('.ui-input3__field').not(".not-focus").focus(function () {
			$(this).parent('.ui-input3').addClass('is-focus').removeClass('has-error');

		});
		// Input field focusout
		$('.ui-input3__field').not(".not-focus").focusout(function () {
			if ($(this).val().length == 0) {
				$(this).parent('.ui-input3').removeClass('is-focus');

				var validator = $(this).closest("form").validate();
				validator.resetForm();
			}
		});
	})()
});

// Изменение ширины браузера
let onWindowResizeTimeout = null;
function onWindowResize() {
	window.windowWidthResize = flsFunctions.mediaWidth();
	if (window.windowWidth != windowWidthResize) {

		if (flsFunctions.bodyLockStatus) {
			flsFunctions.bodyUnlock();
		}

		$(document).trigger("mouseup");
	}
}
window.addEventListener("resize", () => {
	clearTimeout(onWindowResizeTimeout);
	onWindowResizeTimeout = setTimeout(onWindowResize, 100);
});