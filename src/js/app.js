// Подключение основного файла стилей
import "../scss/style.scss";

import $ from "jquery";
window.$ = $;
window.jQuery = jQuery;

import wNumb from 'wNumb';

import "./libs/ui-modal.js";
import "./libs/select.js";
import "./libs/inputmask.js";
import "./libs/autosize.min.js";
import "./libs/ui-range.js";
import "./libs/tippy.js";
import "./libs/chart.js";
import "./widget.js";

import * as flsFunctions from "./functions.js";

import validate from "jquery-validation";
import "jquery-validation/dist/additional-methods.min.js";

document.addEventListener("DOMContentLoaded", function () {
	(async () => {
		window.rangeSlider();

		let moneyFormat = wNumb({
			mark: '.',
			thousand: ' ',
			decimals: 0,
			prefix: '',
			suffix: ''
		});

		jQuery.validator.addMethod("email", function (value, element) {
			return this.optional(element) || /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*")@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)$)|\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i.test(value);
		});

		jQuery.validator.addMethod("checkPhone", function (value, element) {
			return /\+\d{1}\s\(\d{3}\)\s\d{3}\s\d{4}/g.test(value);
		});
		jQuery.validator.addMethod("greaterThanZero", function (value, element) {
			return this.optional(element) || (parseFloat(value) > 0);
		});

		jQuery.validator.addMethod("hasUppercaseLetters", function (value, element) {
			const regex = /[A-Z]/g;
			return this.optional(element) || value.match(regex);
		});
		jQuery.validator.addMethod("hasLowercaseLetters", function (value, element) {
			const regex = /[a-z]/;
			return this.optional(element) || value.match(regex);
		});
		jQuery.validator.addMethod("specialCharacters", function (value, element) {
			const regex = /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/;
			return this.optional(element) || value.match(regex);
		});
		jQuery.validator.addMethod("numbers", function (value, element) {
			const regex = /[0-9]/;
			return this.optional(element) || value.match(regex);
		});

		jQuery.extend(jQuery.validator.messages, {
			FIRSTNAME: "Ошибка в данных",
			SURNAME: "Ошибка в данных",
			CARD: "Ошибка в данных",
			required: "Ошибка в данных",
			remote: "Пожалуйста, исправьте это поле",
			email: "Ошибка в данных",
			url: "Введите корректный URL",
			date: "Ошибка в данных",
			checkDate: "Ошибка в данных",
			dateISO: "Введите правильную дату (ГГ.ММ.ДД).",
			number: "Введите правильный номер",
			digits: "Введите только цифры",
			greaterThanZero: "",
			hasUppercaseLetters: "Пароль должен содержать алфавитные латинские символы в верхнем регистре (A-Z)",
			hasLowercaseLetters: "Пароль должен содержать алфавитные латинские символы в нижнем регистре (a-z)",
			specialCharacters: `Пароль должен содержать специальные символы -._!"'#%&,:;<>=@{}~$()*+/\?[]^|`,
			numbers: "Пароль должен содержать цифры (0-9)",
			creditcard: "Неверный номер карты",
			checkPhone: "Ошибка в данных",
			equalTo: "Пароли не совпадают",
			accept: "Пожалуйста, введите значение с допустимым расширением",
			maxlength: jQuery.validator.format("ошибка в данных"),
			minlength: jQuery.validator.format("минимальная длина пароля 8 символов"),
			rangelength: jQuery.validator.format("Пожалуйста, введите значение от {0} до {1} символов."),
			range: jQuery.validator.format("Введите значение между {0} до {1}."),
			max: jQuery.validator.format("Введите значение меньше или равное {0}."),
			min: jQuery.validator.format("Введите значение больше или равное {0}.")
		});

		// Фильтр для поля с вводом кол-ва товаров
		$(document).on("input", ".js-amount-field", function () {
			this.value = this.value.replace(/[^\d\.,]/g, "");
			this.value = this.value.replace(/,/g, ".");
			if (this.value.match(/\./g) && this.value.match(/\./g).length > 1) {
				this.value = this.value.substr(0, this.value.lastIndexOf("."));
			}

			if (!$(this).hasClass("is-float")) {
				if (this.value == 0) {
					// this.value = 1
				}
				this.value = this.value.split('.')[0].replace(/\D+/g, "");
				if (moneyFormat.to(parseInt(this.value))) {
					this.value = moneyFormat.to(parseInt(this.value));
				}
			} else {
				// if (moneyFormat.to(parseFloat(this.value))) {
				// this.value = moneyFormat.to(parseFloat(this.value));
				// }
			}

			if (this.value.charAt(0) === '0') {
				// this.value = this.value.slice(1);
			}
		});
		$(document).on("focus", ".js-amount-field", function () {
			if ($(this).val() == "0") {
				$(this).val('')
			}
		})
		$(document).on("blur", ".js-amount-field", function () {
			if (!$(this).val().length) {
				$(this).val(0)
			}
			if (!parseInt($(this).val())) {
				$(this).val(0)
			}
			if ($(this).val().slice(0, 1) == 0) {
				$(this).val(0)
			}

			// if (moneyFormat.to(parseFloat($(this).val()))) {
			// 	$(this).val(moneyFormat.to(parseFloat($(this).val())));
			// }
		})

		// Разблокировака кнопки отправки формы
		$(".js-validate-form, .js-validate-return, .js-validate-settings-1, .js-validate-settings-password").each(function () {
			let form = $(this);
			// disabled button[type='submit']
			form.on("input", function (e) {
				let inputsSelectsValid = false;

				form.find(".ui-input__field, select").each(function () {
					if ($(this).val().length === 0) {
						inputsSelectsValid = false;
						return false;
					} else {
						inputsSelectsValid = true;
					}
				});

				if (inputsSelectsValid && form.valid()) {
					$("button[type='submit']").attr('disabled', false);
				} else {
					$("button[type='submit']").attr('disabled', true);
				}
			});
		});
		// Валидаци попап поддержки
		$(".js-validate-support").each(function () {
			let form = $(this);
			let formValidate = form.validate({
				ignore: ':hidden:not([class~=selectized]), :hidden > .selectized, .selectize-control .selectize-input input',
				errorClass: "is-error",
				validClass: "is-success",
				errorElement: "span",
				rules: {
					NAME: {
						required: true,
					},
					PHONE: {
						required: true,
						checkPhone: true,
					},
					SUBJECT: {
						required: true,
					},
				},
				submitHandler: function (form) {
					// form.submit();
					var formData = $(form).serialize();
					console.log(formData); // for demo

					document.dispatchEvent(
						new CustomEvent('formSubmit', {
							detail: {
								form: form,
							},
						})
					);
				}
			});

			// disabled button[type='submit']
			form.on("input", function (e) {
				let inputsSelectsValid = false;

				form.find(".ui-input__field, select").each(function () {
					if ($(this).val().length === 0) {
						inputsSelectsValid = false;
						return false;
					} else {
						inputsSelectsValid = true;
					}
				});

				if (inputsSelectsValid && form.valid()) {
					$("button[type='submit']").attr('disabled', false);
				} else {
					$("button[type='submit']").attr('disabled', true);
				}
			});
		});
		// Валидация попап возврат
		$(".js-validate-return").each(function () {
			let form = $(this);
			let formValidate = form.validate({
				errorClass: "is-error",
				validClass: "is-success",
				errorElement: "span",
				rules: {
					SUMM: {
						required: true,
						greaterThanZero: true,
					},
				},
				submitHandler: function (form) {
					// form.submit();
					var formData = $(form).serialize();
					console.log(formData); // for demo

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
		// Валидация настройки
		$(".js-validate-settings-1").each(function () {
			let form = $(this);
			let formValidate = form.validate({
				errorClass: "is-error",
				validClass: "is-success",
				errorElement: "span",
				rules: {
					FIRSTNAME: {
						required: true,
					},
					SURNAME: {
						required: true,
					},
					CARD: {
						required: true,
					},
				},
				submitHandler: function (form) {
					// form.submit();
					var formData = $(form).serialize();
					console.log(formData); // for demo

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
		// Валидация настройки паролей
		$(".js-validate-settings-password").each(function () {
			let form = $(this);
			let formValidate = form.validate({
				errorClass: "is-error",
				validClass: "is-success",
				errorElement: "span",
				rules: {
					PASSWORD: {
						required: true,
					},
					NEW_PASSWORD: {
						required: true,
						minlength: 8,
						hasUppercaseLetters: true,
						hasLowercaseLetters: true,
						specialCharacters: true,
						numbers: true
					},
					NEW_PASSWORD_CONFIRM: {
						required: true,
						equalTo: "#new-password",
						minlength: 8
					},
				},
				submitHandler: function (form) {
					// form.submit();
					var formData = $(form).serialize();
					console.log(formData); // for demo

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
				if (form.classList.contains("js-form-")) {

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
					if (!btn) return;

					document.addEventListener("click", function (e) {
						if (dropdown.classList.contains("for-hover") && flsFunctions.mediaWidth() > flsFunctions.mediaBreakpoints["lg"]) {
							return false;
						}

						let targetButton = e.target;
						if (targetButton.closest(".ui-dropdown__btn") == btn) {
							dropdowns.forEach(function (dropdown2) {
								if (dropdown2 != dropdown) {
									dropdown2.classList.remove("is-active");
								}
							});
							if (dropdown.classList.contains('is-active')) {
								dropdown.classList.remove("is-active");
							} else {
								dropdown.classList.add("is-active");
							}
						} else {
							dropdown.classList.remove("is-active");
						}
					});
				}
			});

			document.addEventListener("click", function (e) {
				let targetButton = e.target;

				let dropdown = targetButton.closest(".ui-dropdown");
				if (dropdown) {
					let dropdownBody = dropdown.querySelector(".ui-dropdown__body");
					let btn = dropdown.querySelector(".ui-dropdown__btn");
					let searchField = dropdown.querySelector(".ui-dropdown__input-search");

					let option = targetButton.closest(".ui-dropdown__item");
					if (option) {
						let optionName = option.querySelector(".ui-dropdown__item-name");
						let value = optionName.textContent;

						if (btn) {
							let btnValue = btn.querySelector(".ui-dropdown__btn-value");

							if (dropdown.classList.contains("has-link")) {
								return false;
							}
							e.preventDefault();
							btnValue.innerHTML = value;
						}

						if (searchField) {
							searchField.value = value;
						}

						dropdown.classList.remove("is-active", "is-focus");
						dropdownBody.classList.remove("is-show");
					}

				}
			});
		}

		// Autoheight textarea
		let textareaAutoHeight = document.querySelectorAll(".js-auto-height");
		if (textareaAutoHeight.length) {
			textareaAutoHeight.forEach(function (textarea) {
				if (textarea) {
					autosize(textarea);
				}
			})
		}

		// Фокус на input поиска
		$(".js-live-search-input").on("focus", function () {
			let dropdown = $(this).closest(".ui-dropdown");
			let dropdownBody = dropdown.find(".ui-dropdown__body");
			dropdown.addClass("is-focus");
			if (dropdownBody.hasClass("for-search")) {
				dropdownBody.addClass("is-show");
				setTimeout(function () {
					// $(this).focus();
				}, 50)
			}
		}).on("blur", function () {
			let dropdown = $(this).closest(".ui-dropdown");
			let dropdownBody = dropdown.find(".ui-dropdown__body");
			if (!dropdownBody.hasClass("is-show")) {
				dropdown.removeClass("is-focus");
			}
			if (dropdown.find(".ui-dropdown__input-search").val().length) {
				dropdown.addClass("has-value")
			} else {
				dropdown.removeClass("has-value");
			}
		});
		// Ввод текста в input поиска
		$(document).on("input propertychange", ".js-live-search-input", function (e) {
			let dropdown = $(this).closest(".ui-dropdown");
			let dropdownBody = dropdown.find(".ui-dropdown__body");
			let inputValue = $(this).val();
			if (inputValue.length) {
				dropdownBody.addClass("is-show for-search");
			} else {
				dropdownBody.removeClass("is-show for-search");
			}
		});


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

		function generatePassword() {
			var uppercaseLetters = /[A-Z]/;
			var lowercaseLetters = /[a-z]/;
			var specialCharacters = /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/;
			var numbers = /[0-9]/;

			var length = 8,
				charset = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._!"'#%&,:;<>=@{}~$()*+/?[]^|`,
				password = "";
			function getPassword() {
				password = "";
				for (var i = 0, n = charset.length; i < length; ++i) {
					password += charset.charAt(Math.floor(Math.random() * n));
				}
				return password;
			}

			while (true) {
				getPassword();
				if (password.match(numbers) && password.match(uppercaseLetters) && password.match(lowercaseLetters) && password.match(specialCharacters)) {
					break;
				}
			}

			return password;
		}

		document.addEventListener("click", function (event) {
			let targetElement = event.target;

			// Закрытие попап-поиска при клике за его пределами
			var dropdownBody = $(".ui-dropdown__body, .ui-dropdown--search");
			if (!dropdownBody.is(targetElement) && dropdownBody.has(targetElement).length === 0) {
				dropdownBody.removeClass("is-show");
				$(".ui-dropdown--search").removeClass("is-focus");
			}

			// Разблокировать поля в форме настроек
			if (targetElement.closest('.c-settings__form-edit')) {
				let btn = targetElement.closest('.c-settings__form-edit');
				if (btn) {
					let form = btn.closest(".c-settings__form");
					let disabledEl = form.querySelectorAll("[disabled]");
					if (disabledEl.length) {
						disabledEl.forEach(function (el) {
							el.disabled = false;

							if (el.classList.contains("js-settings-save")) {
								el.classList.remove("is-hide");
								btn.classList.add("is-hide");
							}
						})
					}
				}
			}

			// Заблокировать поля в форме настроек
			if (targetElement.closest('.js-settings-save')) {
				let btn = targetElement.closest('.js-settings-save');
				if (btn) {
					let form = btn.closest(".c-settings__form");
					if ($(form).valid()) {
						let fields = form.querySelectorAll("input,button");
						if (fields.length) {
							fields.forEach(function (el) {
								el.disabled = true;

								if (el.classList.contains("c-settings__form-edit")) {
									el.classList.remove("is-hide");
									el.disabled = false;
								}
							});
							btn.classList.add("is-hide");
						}
					}
				}
			}

			// Скопировать в буфер
			if (targetElement.closest('.js-copy-to-clipboard')) {
				let btn = targetElement.closest('.js-copy-to-clipboard');
				if (btn.hasAttribute("data-copy")) {
					flsFunctions.copyToClipboard(btn.getAttribute("data-copy"));
				}
			}

			// Сгенерировать пароль
			if (targetElement.closest('.js-generate-password')) {
				let newPasswordValue = generatePassword();

				let newPasswordField = document.getElementById("new-password");
				if (newPasswordValue && newPasswordField) {
					newPasswordField.value = newPasswordValue;
				}
			}
		});

		// Табы radiobox
		const radioboxes = document.querySelectorAll(".ui-radiobox__input, .ui-checkbox-switch__input");
		if (radioboxes.length) {
			radioboxes.forEach(function (radio) {
				radio.addEventListener("change", function () {
					let radioChecked = radio.checked;
					let connectId = radio.getAttribute("data-connect-for");
					let connectTabs = document.querySelectorAll("[data-connect]");
					if (connectTabs.length) {
						connectTabs.forEach(function (tab) {
							let tabId = tab.getAttribute("data-connect");

							tab.classList.remove("is-active");

							if (tabId && tabId === connectId && radioChecked) {
								tab.classList.add("is-active");
							}
						})
					}

					// Электронная почта
					if (radio.classList.contains("js-kit-toggle-email")) {
						let item = document.querySelector(".js-kit-email");
						if (item) {
							if (radioChecked) {
								item.style.display = "block";
							} else {
								item.style.display = "none";
							}
						}
					}

					// Язык
					if (radio.classList.contains("js-kit-toggle-lang")) {
						let lang = document.querySelector(".js-kit-lang");
						let timer = document.querySelector(".js-kit-timer");
						let header = document.querySelector(".c-pay__header");

						if (lang) {
							if (radioChecked) {
								lang.style.display = "inline-flex";
								if (header) {
									header.style.display = "flex";
								}
							} else {
								lang.style.display = "none";
								if (!timer.checkVisibility() && header) {
									header.style.display = "none";
								}
							}
						}
					}

					// Таймер
					if (radio.classList.contains("js-kit-toggle-timer")) {
						let lang = document.querySelector(".js-kit-lang");
						let timer = document.querySelector(".js-kit-timer");
						let header = document.querySelector(".c-pay__header");
						if (timer) {
							if (radioChecked) {
								timer.style.display = "flex";
								if (header) {
									header.style.display = "flex";
								}
							} else {
								timer.style.display = "none";
								if (!lang.checkVisibility() && header) {
									header.style.display = "none";
								}
							}
						}
					}

					// js-kit-toggle-phone
					// js-kit-toggle-name
				});
			})
		}


		// Добавление логотипа в конструкторе
		const attachFiles = document.querySelectorAll(".js-attach-file");
		if (attachFiles.length) {
			attachFiles.forEach(function (file) {

				file.addEventListener("change", function (e) {
					let input = e.target;

					if (input.files && input.files[0]) {
						let reader = new FileReader();
						reader.onload = (e) => {
							let imgData = e.target.result;
							let imgName = input.files[0].name;
							input.setAttribute("data-title", imgName);
							console.log(e.target.result);

							var oImg = document.createElement("img");
							oImg.setAttribute('src', e.target.result);
							$(".c-pay__logotype").html(oImg);
						}
						reader.readAsDataURL(input.files[0]);
					}
				});
			})
		}
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