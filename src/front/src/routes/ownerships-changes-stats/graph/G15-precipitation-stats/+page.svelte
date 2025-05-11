<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
	//@ts-nocheck
    import { onMount } from "svelte";
    import{dev} from "$app/environment";

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v2/ownerships-changes-stats";

    if (dev){
        API= DEVEL_HOST + API
    };

    onMount(async() =>{
        //datos mi api
        let api1 = await fetch(API);
        let exChangesData = await api1.json();
    
        //datos api externa
        const api2 = await fetch("https://sos2425-15.onrender.com/api/v1/precipitation-stats/");
        const precipitacionData = await api2.json();

        // Agrupar por provincia y preparar los datos
            const grouped = {};

            precipitacionData.forEach(entry => {
            const provincia = entry.province;
            if (!grouped[provincia]) grouped[provincia] = [];
            grouped[provincia].push({
                x: entry.historical_average,
                y: entry.annual_precipitation,
                year: entry.year
            });
            });

            // Convertir al formato que usa ApexCharts
            const series = Object.entries(grouped).map(([provincia, data]) => ({
            name: provincia,
            data: data
            }));

            // Crear el gráfico
            const options = {
            chart: {
                type: 'scatter',
                height: 450,
                zoom: { enabled: true, type: 'xy' }
            },
            title: {
                text: 'Precipitación anual vs Promedio histórico por provincia'
            },
            xaxis: {
                title: { text: "Promedio histórico (mm)" }
            },
            yaxis: {
                title: { text: "Precipitación anual (mm)" }
            },
            tooltip: {
                custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                const d = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
                return `<b>${w.globals.initialSeries[seriesIndex].name}</b><br>
                        Año: ${d.year}<br>
                        Histórica: ${d.x} mm<br>
                        Anual: ${d.y} mm`;
                }
            },
            series: series
            };

            const chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();
        });
</script>

<!-- Contenedor para el gráfico -->
<div id="chart"></div>
