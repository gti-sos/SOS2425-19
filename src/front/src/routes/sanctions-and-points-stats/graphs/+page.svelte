
<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/d3@4.13.0/build/d3.min.js" charset="utf-8"></script>
    <script src="https://cdn.jsdelivr.net/npm/taucharts@2/dist/taucharts.min.js" type="text/javascript"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/taucharts@2/dist/taucharts.min.css">


</svelte:head>
<!-- svelte-ignore css_unused_selector -->
<style>
    #bar {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #bar>svg {
        display: block;
    }

    .highcharts-figure,
.highcharts-data-table table {
    min-width: 320px;
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

input[type="number"] {
    min-width: 50px;
}

.highcharts-description {
    margin: 0.3rem 10px;
}

</style>

<script>
    //@ts-nocheck
    import {onMount} from "svelte";
    import {dev} from "$app/environment"
    import { Table,Button } from '@sveltestrap/sveltestrap';

    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/sanctions-and-points-stats/";
    if(dev){
        API = DEVEL_HOST + API
    }
    let sanctionsData = [];
    let result ="";
    let resultStatus ="";
    async function getSanctions() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            sanctionsData = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }

    function transformDataForPie(data) {
    const grouped = {};

    for (const item of data) {
        const community = item.autonomous_community;
        if (!grouped[community]) {
            grouped[community] = 0;
        }
        grouped[community] += item.total_sanctions_with_points;
    }

    return Object.entries(grouped).map(([name, y]) => ({ name, y }));
}


    onMount(async () => {
        await getSanctions();
        let myData = transformDataForPie(sanctionsData)
        //Uso de Highcharts en Pie
        // @ts-ignore
        Highcharts.chart('container', {
            chart: {
                type: 'pie'
            },
            title: {
                text: 'Sanctions Data'
            },
            tooltip: {
                //Convertir el numero del hover a un entero
                formatter: function () {
                    return `<b>${this.point.name}</b>: ${Highcharts.numberFormat(this.point.y, 0, ',', '.')} sanciones`;
                }
            },
            
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: [{
                        enabled: true,
                        distance: 20
                    }, {
                        enabled: true,
                        distance: -40,
                        format: '{point.percentage:.1f}%',
                        style: {
                            fontSize: '0.7em',
                            textOutline: 'none',
                            opacity: 0.7
                        }
                    }]
                }
            },
            series: [
                {
            name: 'Total sanctions with points',
            colorByPoint: true,
            data: myData
        }
            ]
        });  
        //Uso de Taucharts en barras

        // Agrupar por comunidad y año, sumando los puntos
        var groupedData = sanctionsData.reduce((map, sanction) => {
            let key = sanction.autonomous_community + '_' + sanction.year;
            if (!map[key]) {
                map[key] = {
                    autonomous_community: sanction.autonomous_community,
                    year: String(sanction.year),
                    total_points_deducted: 0
                };
            }
            map[key].total_points_deducted += parseInt(sanction.total_points_deducted);
            return map;
        }, {});

        var finalData = Object.values(groupedData);


        var chart = new Taucharts.Chart({
        data: finalData,
        type: 'bar',
        x: 'autonomous_community',
        y: 'total_points_deducted',
        color: 'year',
        plugins: [
            Taucharts.api.plugins.get('legend')({
                filter: true // 👈 Esto es lo que habilita el clic para filtrar
            }),
            Taucharts.api.plugins.get('tooltip')({
            fields: ['autonomous_community', 'year', 'total_points_deducted'],
            formatters: {
                'autonomous_community': function(val) { return 'Comunidad: ' + val; },
                'year': function(val) { return 'Año: ' + val; },
                'total_points_deducted': function(val) { return 'Puntos: ' + val; }
            }
            }),
        ]
        });
        chart.renderTo('#bar');

    });

</script>
<h2>Número de sanciones por Comunidad Autónoma </h2>

<figure class="highcharts-figure">
    <div id="container"></div>
    
</figure>


<h2>Número de puntos reducidos por Comunidad Autónoma</h2>
<br>
<div id="bar"></div>

<br>
<a href={`/sanctions-and-points-stats/`}> <Button color="primary">Volver a la lista</Button></a>