<script>
	//@ts-nocheck
	import { onMount } from "svelte";
	import { dev } from "$app/environment";

	let DEVEL_HOST = "http://localhost:16078";
	let API = "/api/v1/accident-rate-stats/";

	if (dev) {
		API = DEVEL_HOST + API;
	}

	// Función para cargar el script CanvasJS dinámicamente
	function loadCanvasJS() {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = "https://cdn.canvasjs.com/canvasjs.min.js";
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	onMount(async () => {
		await loadCanvasJS(); // Asegura que CanvasJS esté disponible

		const res = await fetch(API);
		const data = await res.json();

		const dataPoints = data.map(entry => ({
			y: Number(entry.deceased) || 0,
			label: `${entry.ine_code}-${entry.year}`
		})).filter(point => point.y > 0);

		const chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			title: {
				text: "Fallecidos por INE Code y Año"
			},
			data: [{
				type: "pie",
				startAngle: 240,
				yValueFormatString: "##0\" fallecidos\"",
				indexLabel: "{label} - {y}",
				dataPoints
			}]
		});
		chart.render();
	});
</script>

<style>
	#chartContainer {
		height: 370px;
		width: 100%;
		max-width: 800px;
		margin: auto;
	}
</style>

<div id="chartContainer"></div>
