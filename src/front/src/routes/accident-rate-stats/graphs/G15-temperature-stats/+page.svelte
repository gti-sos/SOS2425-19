<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<style>
    #container {
    max-width: 800px;
    margin: auto;
}

.highcharts-figure,
.highcharts-data-table table {
    min-width: 360px;
    max-width: 800px;
    margin: 1em auto;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tbody tr:nth-child(even) {
    background: #f8f8f8;
}

.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

.highcharts-description {
    margin: 0.3rem 10px;
}

</style>

<script>
	//@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/accident-rate-stats/";

    if (dev) {
        API = DEVEL_HOST + API;
    };

    onMount(async () => {
        // Establecer opciones globales de colores
        Highcharts.setOptions({
            colors: [
                'rgba(5,141,199,0.5)', 'rgba(80,180,50,0.5)', 'rgba(237,86,27,0.5)'
            ]
        });

        // Obtener los datos de ambas APIs
        const responseAccidents = await fetch(API);
        const apiData = await responseAccidents.json();

        const responseTemperature = await fetch("https://sos2425-15.onrender.com/api/v1/temperature-stats/");
        const temperatureData = await responseTemperature.json();


        // Filtrar y agrupar los datos por provincias (en este caso solo Andalucía)
        const communityMap = {};
        apiData.forEach(entry => {
            const province = entry.province;
            const injured_hosp = parseInt(entry.injured_hospitalized) || 0;
            const injured_nohosp = parseInt(entry.injured_not_hospitalized) || 0;
            const injured = injured_hosp + injured_nohosp;

            if (entry.ccaa === "Andalucía") {
                if (communityMap[province]) {
                    communityMap[province] += injured;
                } else {
                    communityMap[province] = injured;
                }
            }
        });

        const temperatureGrouped = {};
        temperatureData.forEach(item => {
        const province = item.province;
        const maxAvg = Number(item.maximum_average) || 0;
        if(item.year===2023){
            if (!temperatureGrouped[province]) {
                temperatureGrouped[province] = 0;
            }
            temperatureGrouped[province] += maxAvg;
        }
});


        // Organizar los datos para el gráfico
        const chartData = Object.entries(communityMap).map(([province, injured]) => ({
            province,
            injured,
            maximum_average: temperatureGrouped[province] || 0

        }));

        // Definir la serie de datos
        const series = [{
            name: 'Heridos',
            id: 'heridos',
            data: chartData.map(item => [item.injured, item.maximum_average]),
            marker: {
                symbol: 'circle'
            }
        }];

        // Crear el gráfico
        Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zooming: {
                    type: 'xy'
                }
            },
            title: {
                text: 'Comparativa Heridos vs Precipitación Anual'
            },
            xAxis: {
                title: {
                    text: 'Heridos'
                },
                labels: {
                    format: '{value} personas'
                }
            },
            yAxis: {
                title: {
                    text: 'Temperatura Máxima Media (°C)'
                },
                labels: {
                    format: '{value} °C'
                }
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                scatter: {
                    marker: {
                        radius: 5,
                        symbol: 'circle',
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    }
                }
            },
            tooltip: {
                pointFormat: 'Heridos: {point.x} personas <br/> Temp. Máxima Media: {point.y} °C'
            },
            series
        });
    });
</script>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>
