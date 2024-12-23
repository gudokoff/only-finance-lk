import * as flsFunctions from "./../functions.js";

// Chart
import Chart from 'chart.js/auto';

import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.register(DoughnutController, ArcElement, CategoryScale, LinearScale, BarController, BarElement, ChartDataLabels, Tooltip, LineElement);

Chart.defaults.font.family = "CourierNew";
Chart.register(ChartDataLabels);

// Chart sm
let chartsSm = document.querySelectorAll(".js-chart-sm");
if (chartsSm.length) {
	const verticalLiner = {
		id: 'verticalLiner',
		afterInit: (chart, args, opts) => {
			chart.verticalLiner = {}
		},
		afterEvent: (chart, args, options) => {
			const { inChartArea } = args
			chart.verticalLiner = { draw: inChartArea }
		},
		beforeTooltipDraw: (chart, args, options) => {
			const { draw } = chart.verticalLiner
			if (!draw) return

			const { ctx } = chart
			const { top, bottom } = chart.chartArea
			const { tooltip } = args
			const x = tooltip?.caretX
			if (!x) return

			ctx.save()
			ctx.globalCompositeOperation = 'destination-over';
			ctx.beginPath()
			ctx.moveTo(x, top)
			ctx.lineTo(x, bottom)
			ctx.strokeStyle = "transparent";
			ctx.stroke();

			ctx.restore()
		}
	}

	chartsSm.forEach(function (chart) {
		let chartBOX = chart.closest(".ui-chart-sm");
		let data = null;
		let dataLabel = '';
		let chartInstance = null;

		if (chart.getAttribute("data-json")) {
			data = chart.getAttribute("data-json");
			data = JSON.parse(data);
		}

		chartInstance = new Chart(
			chart,
			{
				type: 'line',
				data: {
					labels: data.map(row => row.date),
					datasets: [
						{
							label: false,
							data: data.map(row => row.value),
							backgroundColor: (context) => {
								const bgColor = [
									'rgba(50, 54, 54, 0.1)',
									'rgba(50, 54, 54, 0)'
								];
								if (!context.chart.chartArea) {
									return;
								}

								const { ctx, data, chartArea: { top, bottom } } = context.chart;
								const gradientBg = ctx.createLinearGradient(0, top, 0, bottom);
								gradientBg.addColorStop(0, bgColor[0])
								gradientBg.addColorStop(0.3, bgColor[0])
								gradientBg.addColorStop(1, bgColor[1])
								return gradientBg
							},
							fill: true,
							hoverBackgroundColor: false,
							borderWidth: 1,
							borderRadius: 0,
							pointRadius: 0,
							pointHoverRadius: 2,
							pointHoverBorderColor: "#010101",
							pointHoverBackgroundColor: "#010101",
							borderColor: "#010101",
						}
					]
				},
				options: {
					elements: {
						point: {
							radius: 0
						}
					},
					maintainAspectRatio: false,
					interaction: {
						mode: 'index',
						intersect: false,
					},
					plugins: {
						datalabels: false,
						legend: {
							display: false,
						},
						tooltip: {
							backgroundColor: "#fff",
							bodyColor: "#000",
							titleColor: "#000",
							borderColor: "rgba(228,228,231,0.5)",
							borderWidth: 1,
							callbacks: {
								title: function (a) {
									let date = a[0].label;
									let dateObj = new Date(date);

									var options = {
										month: 'long',
										day: 'numeric',
										timezone: 'UTC'
									};
									let ruDate = new Date(date).toLocaleString("ru", options);
									return ruDate;
								},
							},
							enabled: false,

							external: function (context) {
								// Tooltip Element
								let tooltipEl = document.getElementById('chartjs-tooltip');

								// Create element on first render
								if (!tooltipEl) {
									tooltipEl = document.createElement('div');
									tooltipEl.id = 'chartjs-tooltip';
									tooltipEl.classList.add('u-chartjs-tooltip');
									tooltipEl.innerHTML = '<table></table>';
									document.body.appendChild(tooltipEl);

								}

								// Hide if no tooltip
								const tooltipModel = context.tooltip;
								if (tooltipModel.opacity === 0) {
									tooltipEl.style.opacity = 0;
									return;
								}

								// Set caret Position
								tooltipEl.classList.remove('above', 'below', 'no-transform');
								if (tooltipModel.yAlign) {
									tooltipEl.classList.add(tooltipModel.yAlign);
								} else {
									tooltipEl.classList.add('no-transform');
								}

								function getBody(bodyItem) {
									return bodyItem.lines;
								}

								// Set Text
								if (tooltipModel.body) {
									const titleLines = tooltipModel.title || [];
									const bodyLines = tooltipModel.body.map(getBody);

									let innerHtml = '<thead>';

									titleLines.forEach(function (title) {
										innerHtml += '<tr><th>' + title + '</th></tr>';
									});
									innerHtml += '</thead><tbody>';

									bodyLines.forEach(function (body, i) {
										const colors = tooltipModel.labelColors[i];
										let style = 'background:' + colors.backgroundColor;
										style += '; border-color:' + colors.borderColor;
										style += '; border-width: 2px';
										const span = '<span style="' + style + '">' + body + '</span>';
										innerHtml += '<tr><td>' + span + '</td></tr>';
									});
									innerHtml += '</tbody>';

									let tableRoot = tooltipEl.querySelector('table');
									tableRoot.innerHTML = innerHtml;
								}

								const position = context.chart.canvas.getBoundingClientRect();

								// Display, position, and set styles for font
								tooltipEl.style.opacity = 1;
								tooltipEl.style.position = 'absolute';
								tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
								tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
								tooltipEl.style.padding = tooltipModel.padding + 'px ' + tooltipModel.padding + 'px';
								tooltipEl.style.pointerEvents = 'none';
							}
						},
						verticalLiner: {}
					},
					animation: {
						duration: 0,
					},
					layout: {
						padding: {
							left: 50,
							right: 50,
							bottom: 29,
							top: 29,
						}
					},
					scales: {
						x: {
							display: false,
						},
						y: {
							display: false,
						},
					},
				},
				plugins: [verticalLiner]
			}
		);
	})
}

// Chart bar
let chartsBar = document.querySelectorAll(".js-chart-bar");
if (chartsBar.length) {
	chartsBar.forEach(function (chart) {
		let chartBOX = chart.closest(".ui-chart-bar");
		let data = null;
		let dataLabel = '';
		let chartInstance = null;

		if (chart.getAttribute("data-json")) {
			data = chart.getAttribute("data-json");
			data = JSON.parse(data);
		}

		let hoverValue = undefined;
		const hoverSegment = {
			id: "hoverSegment",
			beforeDraw(chart, args, plugins) {
				const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
				ctx.save();
				const segment = width / (x.max + 1);
				ctx.fillStyle = 'rgba(247,248,248, 1)';
				let count = width / (width / (x.max + 1));
				if (count > 0) {
					for (let i = 0; i < count; i++) {
						if (i % 2 == 0) {
							ctx.fillRect(x.getPixelForValue(i) - (segment / 2), top, segment, height)
						}
					}
				}
			}
		}

		chartInstance = new Chart(
			chart,
			{
				type: 'bar',
				data: {
					labels: data.map(row => row.date),
					datasets: [
						{
							data: data.map(row => row.value),
							// backgroundColor: data.map(row => row.color),
							backgroundColor: "rgba(7, 118,115,0.6)",
							hoverBackgroundColor: "rgba(7, 118,115,1)",
							borderColor: "#077673",
							hoverBorderColor: "#077673",
							borderWidth: 1,
							borderSkipped: false,
						}, {
							data: data.map(row => row.value2),
							// backgroundColor: data.map(row => row.color),
							backgroundColor: "rgba(157,164,244,0.6)",
							hoverBackgroundColor: "rgba(157,164,244,1)",
							borderColor: "#9DA4F4",
							hoverBorderColor: "#9DA4F4",
							borderWidth: 1,
							borderSkipped: false,
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,

					// barThickness: 32,
					categoryPercentage: 1,
					barPercentage: 0.8,
					elements: {
						point: {
							radius: 0
						}
					},
					plugins: {
						datalabels: false,
						legend: {
							display: false
						},
						// datalabels: false,
						tooltip: {
							enabled: true,
							xAlign: "center",
							yAlign: "top",
							backgroundColor: '#010101',
							cornerRadius: 0,
							padding: 10,
							borderWidth: 1,
							borderColor: "#ffffff",
							boxPadding: 10,
							caretSize: 0,
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
					layout: {
						padding: {
							left: 0,
							right: 0,
							bottom: 0,
							top: 0,
						}
					},
					scales: {
						x: {
							padding: 0,
							border: {
								display: false,
							},
							grid: {
								display: false,
								drawTicks: false,
								drawBorder: false,
							},
							ticks: {
								maxRotation: 0,
								padding: 6
							}
						},
						y: {

							padding: 0,
							border: {
								display: false,
							},
							grid: {
								color: '#E1E4E4',
								drawTicks: false,
								drawBorder: false,

							},
							ticks: {
								padding: 10,
								major: {
									enabled: true
								},
								color: '#63696A',
								font: {
									weight: "normal",
									size: 14
								}
							}
						},
					},

				},
				plugins: [hoverSegment],
			}
		);
	})
}

// Chart circle
let chartsHalfCircle = document.querySelectorAll(".js-chart-circle");
if (chartsHalfCircle.length) {
	chartsHalfCircle.forEach(function (chart) {
		let chartBOX = chart.closest(".ui-chart-circle");
		let dataHTML = chartBOX.querySelector(".ui-chart-circle__data");
		let data = null;
		let totalCount = 0;
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

		if (dataHTML) {
			dataHTML.innerHTML = '';
			let dataItems = [];
			data.map(function (row, idx) {
				let dataItem = document.createElement("div");
				dataItem.className = 'ui-chart-circle__data-item';
				dataItem.setAttribute("data-id", idx);

				let color = '';
				if (row.color) {
					color = `<span style='background-color: ${row.color}' class='ui-chart-circle__data-item-color'></span>`;
				}

				let icon = '';
				if (row.icon) {
					icon = `<span class="ui-chart-circle__data-item-icon ui-icon-${row.icon}"></span>`;
				}

				let name = '';
				if (row.name) {
					name = `<span class='ui-chart-circle__data-item-name'>${row.name}</span>`;
				}

				let count = '';
				if (row.count) {
					count = `<span class='ui-chart-circle__data-item-count'>${digFormat(row.count)}</span>`;
				}

				let currency = '';
				if (row.currency) {
					currency = `<span class='ui-chart-circle__data-item-currency'>${row.currency}</span>`;
				}

				let content = color + icon + name + count + currency;

				dataItem.innerHTML = content;
				dataItems.push(dataItem);
			});
			let itemHandlerInTimeout = null;
			if (dataItems.length) {
				dataItems.forEach(function (item) {
					dataHTML.appendChild(item);
				});
			}
		}

		chartInstance = new Chart(
			chart,
			{
				type: 'doughnut',
				data: {
					labels: false,
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
							caretSize: 0,
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
					// rotation: 0,
					// circumference: 0,
					cutout: "84%",
					layout: {
						padding: {
							left: 50,
							right: 50,
							top: 50,
							bottom: 50
						}
					},
				}
			}
		);
	})
}