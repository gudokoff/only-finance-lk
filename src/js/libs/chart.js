// Chart
import Chart from 'chart.js/auto';

import ChartDataLabels from 'chartjs-plugin-datalabels';

// Chart.register(DoughnutController, ArcElement, CategoryScale, LinearScale, BarController, BarElement, ChartDataLabels, Tooltip, LineElement);

Chart.defaults.font.family = "CourierNew";
Chart.register(ChartDataLabels);

// Chart circle
let chartsSm = document.querySelectorAll(".js-chart-sm");
if (chartsSm.length) {
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
							// backgroundColor: data.map(row => row.color),
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
								gradientBg.addColorStop(1, bgColor[1])
								return gradientBg
							},
							//  "linear-gradient(180deg, rgba(50, 54, 54, 0.1) 0%, rgba(50, 54, 54, 0) 100%)",
							fill: true,
							hoverBackgroundColor: false,
							borderWidth: 1,
							// borderRadius: 0,
							// hoverBorderWidth: 6,
							// hoverBorderRadius: 0,
							// hoverBorderColor: data.map(row => row.color),
							// borderSkipped: 'top',
							borderColor: "#010101",
							// borderJoinStyle: flsFunctions.mediaWidth() < flsFunctions.mediaBreakpoints["sm"] ? "round" : "miter",
							// borderAlign: 'center',
							// weight: 1,
						}
					]
				},
				options: {
					elements: {
						point: {
							radius: 0
						}
					},
					plugins: {
						labels: false,
						legend: {
							display: false
						},
						datalabels: false,
						tooltip: {
							// enabled: true,
							// xAlign: "center",
							// yAlign: "top",
							// backgroundColor: 'rgba(0, 0, 0, 1)',
							// cornerRadius: 0,
							// padding: 10,
							// borderWidth: 1,
							// borderColor: "#ffffff",
							// boxPadding: 10,
							// titleFont: {
							// 	size: 16
							// },
							// bodyFont: {
							// 	size: 16
							// }
						},
					},
					animation: {
						duration: 50,
					},
					layout: {
						padding: {
							left: 0,
							right: 0
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
			}
		);
	})
}