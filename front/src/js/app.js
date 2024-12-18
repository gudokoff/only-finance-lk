// Подключение основного файла стилей
import "../scss/style.scss";

import $ from "jquery";
window.$ = $;
window.jQuery = jQuery;

import validate from "jquery-validation";
import "jquery-validation/dist/additional-methods.min.js";

// Модуль Попапы
import './libs/ui-modal.js';

import './files/tippy.js';

import './widget.js'

function formValidate() {
	jQuery.extend(jQuery.validator.messages, {
		...validatorMessages,
		maxlength: jQuery.validator.format("ошибка в данных"),
		minlength: jQuery.validator.format("ошибка в данных"),
		rangelength: jQuery.validator.format("Пожалуйста, введите значение от {0} до {1} символов."),
		range: jQuery.validator.format("Введите значение между {0} до {1}."),
		max: jQuery.validator.format("Введите значение меньше или равное {0}."),
		min: jQuery.validator.format("Введите значение больше или равное {0}.")
	});

	jQuery.validator.addMethod("checkMask", function (value, element) {
		return /\+\d{1}\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}/g.test(value);
	});
	jQuery.validator.addMethod("checkDate", function (value, element) {
		return /\d{1}\d{1}\/\d{1}\d{1}/g.test(value);
	});
	// jQuery.validator.addMethod("checkCard", function (value, element) {
	// 	return /\d{4}\s\(\d{4}\)\s\d{4}\s\d{4}/g.test(value);
	// });
	jQuery.validator.addMethod("email", function (value, element) {
		return this.optional(element) || /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*")@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)$)|\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i.test(value);
	});
	jQuery.validator.addMethod("captcha", function (value, element) {
		return /отзыв/g.test(value);
	});
	//========================================================================================================================================================

	//========================================================================================================================================================
	// Фильтр для поля с вводом кол-ва товаров
	$(document).on("input", ".js-amount-field", function () {
		this.value = this.value.replace(/[^\d\.,]/g, "");
		this.value = this.value.replace(/,/g, ".");
		if (this.value.match(/\./g) && this.value.match(/\./g).length > 1) {
			this.value = this.value.substr(0, this.value.lastIndexOf("."));
		}

		if (!$(this).hasClass("is-float")) {
			if (this.value == 0) {
				this.value = 1
			}
			this.value = this.value.split('.')[0].replace(/\D+/g, "");
		}
		if (this.value.charAt(0) === '0') {
			// this.value = this.value.slice(1);
		}
	});
	//========================================================================================================================================================

	//========================================================================================================================================================
	// Валидация форм
	$(".js-validate-form").each(function () {
		$(this).validate({
			errorClass: "is-error",
			validClass: "is-success",
			errorElement: "span",
			// // make sure error message isn't displayed
			// errorPlacement: function () { },
			// // set the errorClass as a random string to prevent label disappearing when valid
			// errorClass : "sa",
			// // use highlight and unhighlight
			highlight: function (element, errorClass, validClass) {
				// $(element.form).find("span[id=" + element.getAttribute("name") + "]")
				// .addClass("c-input__error");
			},
			// unhighlight: function (element, errorClass, validClass) {
			//     $(element.form).find("label[for=" + element.id + "]")
			//     .removeClass("error");
			// },
			invalidHandler: function (event, validator) {
				let form = validator.currentForm;
				let button = form.querySelector("button[type='submit']")
				// console.log(button);
				// console.log(validator);
			},
			rules: {
				...validatorRules
			},
			messages: {
				...validatorRulesMessages
			},
			...validatorSubmitHandler
		});
	});
}
document.addEventListener("DOMContentLoaded", function () {
	formValidate();
	// Кастомизация загрузки файла
	var dt = new DataTransfer();
	$('.input-file input[type=file]').on('change', function () {
		let $files_list = $(this).closest('.input-file').next();
		$files_list.empty();

		for (var i = 0; i < this.files.length; i++) {
			let new_file_input = '<div class="input-file-list-item">' +
				'<span class="input-file-list-name">' + this.files.item(i).name + '</span>' +
				'<a href="#" onclick="removeFilesItem(this); return false;" class="input-file-list-remove">x</a>' +
				'</div>';
			$files_list.append(new_file_input);
			dt.items.add(this.files.item(i));
		};
		this.files = dt.files;
	});

	function removeFilesItem(target) {
		let name = $(target).prev().text();
		let input = $(target).closest('.input-file-row').find('input[type=file]');
		$(target).closest('.input-file-list-item').remove();
		for (let i = 0; i < dt.items.length; i++) {
			if (name === dt.items[i].getAsFile().name) {
				dt.items.remove(i);
			}
		}
		input[0].files = dt.files;
	}
	window.removeFilesItem = removeFilesItem;

	// Плавный скрол к блоку
	$("[data-goto]").on("click", function () {
		var get_id = $(this).attr("data-goto");
		var target = $(get_id).offset().top - 20;
		$("html, body").animate({ scrollTop: target }, 800);
	});

	$('.js-form-validate').submit(function (e) {
		e.preventDefault();
		let form = $(this);

		if (form.hasClass("c-auth")) {
			let input = form.find(".ui-input__field");
			let error = form.find(".js-form-error");
			let errorMsg = error.attr('data-error');
			error.html(errorMsg)
		}

		if (form.hasClass("c-form-resume")) {

			let error = form.find(".js-form-error");

			if (!form.find("#c_2").is(':checked')) {
				error.html("согласитесь на обработку данных")
			} else {
				error.html('');
			}
		}
	});

	// popupCookie
	if (localStorage.getItem('popupCookie')) {

	} else {
		$(".ui-popup--cookie").fadeIn();
	}

	$(document).on("click", ".js-popup-close", function () {
		let btn = $(this);
		btn.closest(".ui-popup").fadeOut();
		setTimeout(function () {
			btn.closest(".ui-popup").hide();
			localStorage.setItem('popupCookie', true)
		}, 300);
	});

	// Анимация логотипа
	var headerLogotype = document.getElementById('header-logotype');
	if (headerLogotype) {
		window.addEventListener('scroll', function () {
			let logotype = document.querySelector(".s-preview__logotype");
			let headerHeight = $(".c-header").height();
			let logotypePositionTop = $(".s-preview__logotype").offset().top - $(window).scrollTop();


			if (logotype) {
				if (logotypePositionTop < headerHeight) {
					$(headerLogotype).css("opacity", 1 -
						logotypePositionTop / headerHeight);
				} else {
					$(headerLogotype).css("opacity", 0);
				}
			}
		});
	}

	// Копировать текст в буфер
	function copyToClipboard(text) {
		var aux = document.createElement("input");
		aux.setAttribute("value", text);
		document.body.appendChild(aux);
		aux.select();
		document.execCommand("copy");
		document.body.removeChild(aux);
	}

	document.addEventListener("click", function () {
		let targetElement = event.target;

		// Смена видимости пароля
		if (targetElement.closest('.js-toggle-password')) {
			let btn = targetElement.closest('.js-toggle-password');
			let inputType = btn.classList.contains('_viewpass-active') ? 'password' : 'text';
			btn.parentElement.querySelector('input').setAttribute('type', inputType);
			btn.classList.toggle('_viewpass-active');
		}

		if (targetElement.closest('.js-copy-to-clipboard')) {
			let btn = targetElement.closest('.js-copy-to-clipboard');
			if (btn.hasAttribute("data-copy")) {
				copyToClipboard(btn.getAttribute("data-copy"));
			}
		}
	});
});

