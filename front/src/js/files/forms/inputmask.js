// https://github.com/RobinHerbots/Inputmask

// Подключение модуля
import "inputmask/dist/inputmask.min.js";

Inputmask.extendDefinitions({
	'g': {
		"validator": function (chrs, buffer, pos, strict, opts) {
			let result = {};
			if (pos == 0) {
				if (chrs < 10 && chrs > 1) {
					result = {
						"insert": [
							{
								pos: 0,
								c: 0,
							},
							{
								pos: 1,
								c: chrs,
							},
						],
						caret: 3
					}
				} else {
					result = {
						"pos": 0,
						"c": chrs,
						"caret": 1
					}
				}
			} else if (pos == 1) {
				if (buffer.buffer[0] == 1) {
					if (chrs > 2) {
						result = {
							"remove": 1,
							"caret": 1
						}
					} else {
						result = {
							"pos": 1,
							"c": chrs,
							"caret": 3
						}
					}
				} else {
					result = {
						"pos": 1,
						"c": chrs,
						"caret": 3
					}
				}
			} else if (pos == 2) {

			} else if (pos == 3) {
				if (chrs > 1) {
					result = {
						"pos": 3,
						"c": chrs,
						"caret": 4
					}
				} else {
					result = {
						"remove": 3,
						"caret": 3
					}
				}
			} else if (pos == 4) {
				if (buffer.buffer[3] == 2) {
					if (chrs < 4) {
						result = {
							"remove": 4,
							"caret": 4
						}
					} else {
						result = {
							"pos": 4,
							"c": chrs,
							"caret": 5
						}
					}
				} else {
					result = {
						"pos": 4,
						"c": chrs,
						"caret": 5
					}
				}
			}
			if (!Number.isInteger(parseInt(chrs))) {
				result = {
					"remove": pos,
					"caret": pos
				}
			}
			return result;
		}
	}
});

document.addEventListener("DOMContentLoaded", function () {
	let maskCard = new Inputmask({
		mask: "9999 9999 9999 9999",
		placeholder: "",
		showMaskOnHover: false,
		showMaskOnFocus: false,
		oncomplete: function (e) {
			let field = e.target;
			// field.disabled = true;
			let form = field.closest("form");

			var validator = $(form).validate();
			if (validator.element("#cardNumb")) {
				console.log('valid');
				
				let hiddenNumb = field.value.replace(/\s/g, '');
				hiddenNumb = "*" + hiddenNumb.slice(-4);
				console.log(hiddenNumb);

				$(form).find(".c-pay__input").addClass("has-valid-creditcard");
				$("#cardDateComplet").val(hiddenNumb);
				$("#cardDate").focus();
			} else {
				// field.disabled = false;
			}
		}
	});
	maskCard.mask(".js-mask-card");

	let maskMMYY = new Inputmask({
		mask: "gg/gg",
		placeholder: "",
		showMaskOnFocus: false,
		showMaskOnHover: false,
		oncomplete: function (e) {
			$("#cardCvv").focus();
		}
	});
	maskMMYY.mask(".js-mask-pay-mmyy");
});