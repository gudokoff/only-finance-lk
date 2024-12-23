// Подключение основного файла стилей
import "../scss/style.scss";

import $ from "jquery";
window.$ = $;
window.jQuery = jQuery;

import * as flsFunctions from "./files/functions.js";
// Chart
import { Chart, DoughnutController, ArcElement, CategoryScale, LinearScale, BarController, BarElement, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(DoughnutController, ArcElement, CategoryScale, LinearScale, BarController, BarElement, ChartDataLabels, Tooltip);

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
			this.value = this.value.split('.')[0].replace(/\D+/g, "");
		}
	});
	//========================================================================================================================================================
	$(document).on("input", ".js-bin-search", function () {
		let input = $(this);
		if (input.val().length) {
			input.siblings(".ui-input3__clear").show();
		} else {
			input.siblings(".ui-input3__clear").hide();
		}
	});



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

	// Chart
	Chart.defaults.font.family = "CourierNew";
	Chart.register(ChartDataLabels);
	// Chart circle
	let chartsHalfCircle = document.querySelectorAll(".js-chart-half-circle");
	if (chartsHalfCircle.length) {
		chartsHalfCircle.forEach(function (chart) {
			let chartBOX = chart.closest(".ui-chart-half-circle");
			let totalTitleHTML = chartBOX.querySelector(".ui-chart-half-circle__info-title");
			let totalHTML = chartBOX.querySelector(".ui-chart-half-circle__info-total-value");
			let dataHTML = chartBOX.querySelector(".ui-chart-half-circle__data");
			let data = null;
			let totalCount = 0;
			let totalTitle = totalTitleHTML.textContent;
			let dataLabel = '';
			let chartInstance = null;
			let digFormat = flsFunctions.getDigFormat;
			if (chart.hasAttribute("data-float")) {
				digFormat = flsFunctions.getFloatFormat;
			}

			if (chart.getAttribute("data-json")) {
				data = chart.getAttribute("data-json");
				data = JSON.parse(data);
				data.map(row => {
					if (row.color && row.color.startsWith('--')) {
						row.color = flsFunctions.cssVarValue(row.color);
					}
				});
				totalCount = data.map(row => row.count).reduce((partialSum, a) => partialSum + a, 0);
			}

			if (chart.getAttribute("data-label")) {
				dataLabel = chart.getAttribute("data-label");
			}

			if (totalHTML) {
				totalHTML.innerHTML = digFormat(totalCount);
			}

			if (dataHTML) {
				dataHTML.innerHTML = '';
				let dataItems = [];
				data.map(function (row, idx) {
					let dataItem = document.createElement("div");
					dataItem.className = 'ui-chart-half-circle__data-item';
					dataItem.setAttribute("data-id", idx);

					let color = '';
					if (row.color) {
						color = `<span style='background-color: ${row.color}' class='ui-chart-half-circle__data-item-color'></span>`;
					}

					let icon = '';
					if (row.icon) {
						icon = `<span class="ui-chart-half-circle__data-item-icon ui-icon-${row.icon}"></span>`;
					}

					let name = '';
					if (row.name) {
						name = `<span class='ui-chart-half-circle__data-item-name'>${row.name}</span>`;
					}

					let count = '';
					if (row.count) {
						count = `<span class='ui-chart-half-circle__data-item-count'>${digFormat(row.count)}</span>`;
					}

					let currency = '';
					if (row.currency) {
						currency = `<span class='ui-chart-half-circle__data-item-currency'>${row.currency}</span>`;
					}

					let content = color + icon + name + count + currency;

					dataItem.innerHTML = content;
					dataItems.push(dataItem);
				});
				let itemHandlerInTimeout = null;
				let chartHandlerOutTimeout = null;
				function chartHandlerOut() {
					totalTitleHTML.innerHTML = totalTitle;
					totalHTML.innerHTML = digFormat(totalCount);
				}
				if (dataItems.length) {
					function itemHandlerIn(item) {
						let id = item.data("id");

						chartInstance.setActiveElements([
							{ datasetIndex: 0, index: id }
						]);
						chartInstance.update();

						const label = data[id].name;
						const value = data[id].count;
						totalTitleHTML.innerHTML = label;
						totalHTML.innerHTML = digFormat(value);
					}
					function itemHandlerOut() {
						clearInterval(chartHandlerOutTimeout);
						clearInterval(itemHandlerInTimeout);
						chartInstance.setActiveElements([]);
						chartInstance.update();
						totalTitleHTML.innerHTML = totalTitle;
						totalHTML.innerHTML = digFormat(totalCount);
					}
					dataItems.forEach(function (item) {
						dataHTML.appendChild(item);
						$(item).on("mouseenter", function () {
							let item = $(this);
							clearInterval(chartHandlerOutTimeout);
							clearInterval(itemHandlerInTimeout);
							itemHandlerInTimeout = setTimeout(function () {
								itemHandlerIn(item);
							}, 50);
						});
						$(dataHTML).on("mouseleave", itemHandlerOut);
					});
				}

				$(chart).on("mouseleave", function () {
					clearInterval(itemHandlerInTimeout);
					chartHandlerOutTimeout = setTimeout(chartHandlerOut, 0);
				});
			}

			chartInstance = new Chart(
				chart,
				{
					type: 'doughnut',
					data: {
						labels: data.map(row => row.name),
						datasets: [
							{
								label: dataLabel,
								data: data.map(row => row.count),
								backgroundColor: data.map(row => row.color),
								hoverBackgroundColor: data.map(row => row.color),
								borderWidth: 0,
								borderRadius: 0,
								hoverBorderWidth: 6,
								hoverBorderRadius: 0,
								hoverBorderColor: data.map(row => row.color),
								borderSkipped: 'top',
								borderColor: data.map(row => row.color),
								borderJoinStyle: flsFunctions.mediaWidth() < flsFunctions.mediaBreakpoints["sm"] ? "round" : "miter",
								borderAlign: 'center',
								weight: 1,
							}
						]
					},
					options: {
						plugins: {
							datalabels: false,
							tooltip: {
								enabled: true,
								xAlign: "center",
								yAlign: "top",
								backgroundColor: 'rgba(0, 0, 0, 1)',
								cornerRadius: 0,
								padding: 10,
								borderWidth: 1,
								borderColor: "#ffffff",
								boxPadding: 10,
								titleFont: {
									size: 16
								},
								bodyFont: {
									size: 16
								}
							},
						},
						animation: {
							duration: 50,
						},
						rotation: -90,
						circumference: 180,
						cutout: "84%",
						layout: {
							padding: {
								left: 10,
								right: 10
							}
						},
						onHover: (evt) => {
							const points = chartInstance.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

							if (points.length) {
								const firstPoint = points[0];
								const label = chartInstance.data.labels[firstPoint.index];
								const value = chartInstance.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
								totalTitleHTML.innerHTML = label;
								totalHTML.innerHTML = digFormat(value);
							} else {
								totalTitleHTML.innerHTML = totalTitle;
								totalHTML.innerHTML = digFormat(totalCount);
							}
						},
						onClick: (evt) => {
							const points = chartInstance.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);

							if (points.length) {
								const firstPoint = points[0];
								const label = chartInstance.data.labels[firstPoint.index];
								const value = chartInstance.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
								totalTitleHTML.innerHTML = label;
								totalHTML.innerHTML = digFormat(value);
							} else {
								totalTitleHTML.innerHTML = totalTitle;
								totalHTML.innerHTML = digFormat(totalCount);
							}
						},
					}
				}
			);
		})
	}

	// Chart Horizontal
	let chartsHorizontalBar = document.querySelectorAll(".js-chart-horizontal-bar");
	if (chartsHorizontalBar.length) {
		chartsHorizontalBar.forEach(function (chart) {
			let isDarkMode = chart.closest(".is-dark");
			let chartBOX = chart.closest(".ui-chart-horizontal-bar");
			let data = null;
			let totalCount = 0;
			let dataLabel = '';
			if (chart.getAttribute("data-json")) {
				data = chart.getAttribute("data-json");
				data = JSON.parse(data);
				data.map(row => {
					if (row.color && row.color.startsWith('--')) {
						row.color = flsFunctions.cssVarValue(row.color);
					}
				});
			}
			if (chart.getAttribute("data-label")) {
				dataLabel = chart.getAttribute("data-label");
			}

			setTimeout(function () {
				new Chart(
					chart,
					{
						type: 'bar',
						data: {
							labels: data.map(row => row.name),
							datasets: [
								{
									label: dataLabel,
									data: data.map(row => row.count),
									backgroundColor: data.map(row => row.color),
									hoverBackgroundColor: data.map(row => flsFunctions.setOpacity(row.color, 0.5)),
									hoverBorderColor: "#000000",
									borderSkipped: false,
									barThickness: 24,
									borderWidth: 0,
									hoverborderWidth: 0,
									borderColor: "#fff",
								}
							]
						},
						options: {
							animation: {
								duration: 50,
							},
							resizeDelay: 100,
							indexAxis: 'y',
							maintainAspectRatio: false,
							responsive: true,
							scales: {
								x: {
									border: {
										display: false,
									},

									grid: {
										display: false
									},
									position: 'top',
									ticks: {
										major: {
											enabled: true
										},
										color: isDarkMode ? '#ffffff' : '#000000',
										font: {
											weight: "bold",
											size: 16
										}
									}
								},
								y: {
									grid: {
										display: false
									},
									border: {
										display: false,
									},
									ticks: {
										major: {
											enabled: true
										},
										color: isDarkMode ? '#ffffff' : '#000000',
										font: {
											weight: "normal",
											size: 14
										}
									}
								},
							},
							plugins: {
								datalabels: {
									clamp: true,
									align: 'end',
									anchor: 'end',
									color: '#000000',
									offset: 10,
									font: {
										weight: "bold",
										size: 16
									}
								},
								tooltip: {
									enabled: true,
									backgroundColor: 'rgba(0, 0, 0, 1)',
									cornerRadius: 0,
									padding: 10,
									borderWidth: 1,
									borderColor: "#ffffff",
									boxPadding: 10,
									titleFont: {
										size: 16
									},
									bodyFont: {
										size: 16
									}
								},
							}
						}
					}
				);
			}, 0)
		})
	}


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


	// Input field focus
	$('.ui-input3__field').not(".not-focus").focus(function () {
		$(this).parent('.ui-input3').addClass('is-focus').removeClass('has-error');
	});
	// Input field focusout
	$('.ui-input3__field').not(".not-focus").focusout(function () {
		if ($(this).val().length == 0) {
			$(this).parent('.ui-input3').removeClass('is-focus');
		}
	});

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

		if (targetElement.closest('.ui-input3__clear')) {
			let btn = targetElement.closest('.ui-input3__clear');
			let btnField = document.querySelector(".js-bin-search");
			if (btnField) {
				btnField.value = "";
				$(btnField).trigger("input").focus();
			}
		}
	});
});

