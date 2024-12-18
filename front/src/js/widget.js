import './files/forms/inputmask.js';

// Timer
function getTimeRemaining(endtime) {
	let t = Date.parse(endtime) - Date.parse(new Date());
	let seconds = Math.floor((t / 1000) % 60);
	let minutes = Math.floor((t / 1000 / 60) % 60);
	let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	let days = Math.floor(t / (1000 * 60 * 60 * 24));

	return {
		'total': t,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}
function initializeClock(el, endtime) {
	let clock = el;
	function updateClock() {
		let t = getTimeRemaining(endtime);
		var minutesSpan = clock.querySelector('.js-timer-minutes');
		var secondsSpan = clock.querySelector('.js-timer-seconds');

		secondsSpan.innerHTML = t.seconds;
		minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
		secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

		if (t.total <= 0) {
			clearInterval(timeinterval);
		}
	}
	let timeinterval = setInterval(updateClock, 1000);
	updateClock();
}

document.addEventListener("click", function (event) {
	let targetElement = event.target;

	// Tab button
	if (targetElement.closest('.c-pay__tab-button')) {
		let tabButton = targetElement.closest('.c-pay__tab-button');
		let tab = tabButton.closest(".c-pay__tab");
		if (tab) {
			if (tab.classList.contains("is-active")) {
				tab.classList.remove("is-active");
			} else {
				tab.classList.add("is-active");
			}
		}
	}

	// Clear form
	if (targetElement.closest('.js-clear-pay')) {
		let button = targetElement.closest('.js-clear-pay');
		let input = button.closest(".c-pay__input");
		let inputFields = input.querySelectorAll(".ui-input2__field");
		if (inputFields.length) {
			input.classList.remove("has-valid-creditcard");
			$(".c-pay__input-error").remove();
			$(".c-pay__input").removeClass("is-error");

			inputFields.forEach(function (inputField) {
				if (inputField && !inputField.disabled) {
					inputField.value = '';
					let event = new Event('input', { bubbles: true });
					inputField.dispatchEvent(event);
				}
			});
		}
	}
});

document.addEventListener("DOMContentLoaded", function () {
	// Timer init
	let timerCountdowns = document.querySelectorAll(".js-timer-countdown");
	if (timerCountdowns.length) {
		timerCountdowns.forEach(function (timer) {
			let deadline = timer.getAttribute("data-deadline");
			if (deadline) {
				initializeClock(timer, deadline);
			}
		});
	}

	// Get receipt on email
	$(document).on("change", "#getReceipt", function () {
		let btn = $(this);
		if (btn.is(":checked")) {
			$("#getReceiptField").show()
		} else {
			$("#getReceiptField").hide();
		}
	});

	// Input field focus
	$('.ui-input2__field').not(".not-focus").focus(function () {
		$(this).parent('.ui-input2').addClass('is-focus').removeClass('has-error');
	});
	// Input field focusout
	$('.ui-input2__field').not(".not-focus").focusout(function () {
		if ($(this).val().length == 0) {
			$(this).parent('.ui-input2').removeClass('is-focus');
		}
	});

	// cardNumb field
	$(document).on("input", "#cardNumb", function () {
		let input = $(this);
		let inputValue = input.val().trim().replace(/\s/g, "");
		let banksBox = input.closest(".c-pay__input").find(".c-pay__input-banks");
		let inputClear = input.closest(".c-pay__input").find(".c-pay__input-clear");

		let bankLogo = banksBox.find(".c-pay__input-bank-logo");
		let bankSystem = banksBox.find(".c-pay__input-bank-system");

		if (inputValue.length) {
			inputClear.show();

			let paySystemId = parseInt(inputValue[0]);
			if (inputValue[0] == 2 && inputValue[1]) {
				paySystemId = parseInt(inputValue[0] + inputValue[1]);
			}

			if (paySystemId == 3) {
			} else if (paySystemId == 4) {
				bankSystem.attr("src", "img/upload/bank/visa.svg");
				bankSystem.show();
			} else if (paySystemId == 5) {
				bankSystem.attr("src", "img/upload/bank/master-card.svg");
				bankSystem.show();
			} else if (paySystemId == 6) {

			} else if (paySystemId == 22) {
				bankSystem.attr("src", "img/upload/bank/mir.svg");
				bankSystem.show();
			} else {
				bankSystem.hide();
			}

			if (inputValue.length > 5) {
				let payBin = parseInt(inputValue.substring(0, 6));

				if (payBin == 521324) {
					bankLogo.attr("src", "img/upload/bank/t-bank.svg");
					bankLogo.show();
				} else if (payBin == 427683) {
					bankLogo.attr("src", "img/upload/bank/sber.png");
					bankLogo.show();
				} else {
					bankLogo.hide();
				}
			} else {
				bankLogo.hide();
			}
		} else {
			inputClear.hide();
			bankSystem.hide();
		}
	});
	// Backspace events
	$(document).on("keyup", "#cardDate, #cardCvv", function (e) {
		if (e.keyCode == 8) {
			let field = $(this);

			if (field.attr('id') == "cardCvv" && field.val().length < 1) {
				$("#cardDate").focus();
			} else if (field.attr('id') == "cardDate" && field.val().length < 1) {
				$(".c-pay__input").removeClass("has-valid-creditcard");
				$("#cardDate").val('');
				$("#cardNumb").focus();
				$(".c-pay__input-error").remove();
			}
		}
	});

	$(".js-validate-widget-pay").validate({
		errorClass: "is-error",
		validClass: "is-success",
		errorElement: "span",
		// // make sure error message isn't displayed
		errorPlacement: function (errorElement, element) {
			if ($(element).attr("id") == 'cardNumb' || $(element).attr("id") == 'cardDate' || $(element).attr("id") == 'cardCvv') {
				element.closest(".c-pay__input").find(".c-pay__input-error").remove();
				element.closest(".c-pay__input").append(errorElement.addClass("c-pay__input-error"));
			} else {
				errorElement.insertAfter(element);
			}
		},
		// errorClass : "sa",
		highlight: function (element, errorClass, validClass) {
			if (element.id == 'cardNumb' || element.id == 'cardDate' || element.id == 'cardCvv') {
				$(element.form).find(".c-pay__input").addClass(errorClass).removeClass(validClass);
			} else {
				$(element).addClass(errorClass).removeClass(validClass);
				$(element.form).find("span[id=" + element.id + "-error" + "]")
					.addClass(errorClass);
			}
		},
		unhighlight: function (element, errorClass, validClass) {
			// console.log(element.id);

			if (element.id == 'cardNumb' || element.id == 'cardDate' || element.id == 'cardCvv') {
				$(element.form).find(".c-pay__input").removeClass(errorClass).addClass(validClass);
			} else {
				$(element).removeClass(errorClass).addClass(validClass);
				$(element.form).find("label[for=" + element.id + "-error" + "]")
					.removeClass(errorClass);
			}
		},
		invalidHandler: function (event, validator) {
			let form = validator.currentForm;
			let button = form.querySelector("button[type='submit']")
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
