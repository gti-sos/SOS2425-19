
<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    

    <!-- Carga de estilos de C3 -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css" rel="stylesheet">

    <!-- Carga de D3.js (requerido por C3) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>

    <!-- Carga de C3.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
</svelte:head>

<style>
    .highcharts-figure,
    .highcharts-data-table table {
        min-width: 310px;
        max-width: 800px;
        margin: 1em auto;
    }

    #container {
        height: 400px;
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
    import{dev} from "$app/environment";

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v2/ownerships-changes-stats";

    if (dev){
        API= DEVEL_HOST + API
    };

    let exChangesData=[];
    let result="";
    let resultStatus="";

    async function getData(){
        resultStatus = result = "";
        try{
            const res = await fetch(API,{method:"GET"});
            const data= await res.json();


            result = JSON.stringify(data,null,2);
            exChangesData= data;
            console.log(`response received : ${JSON.stringify(exChangesData,null,2)} `)
        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }
    

    onMount(async() =>{
        await getData();
        
        const carTotalsByCommunity = {};
        const trucksByCommunity={};
// Variables para los totales generales de cada tipo de vehículo
let totalCars = 0;
    let totalTrucks = 0;
    let totalVans = 0;
    let totalBuses = 0;
    let totalMotorcycles = 0;
    let totalOtherVehicles = 0;

    exChangesData.forEach(entry => {
        const community = entry.autonomous_community;
        const trucks = entry.truck || 0;
        const cars = entry.car || 0;
        const vans = entry.van || 0;
        const buses = entry.bus || 0;
        const motorcycles = entry.motocycle || 0;
        const otherVehicles = entry.other_vehicle || 0;

        // Sumar los valores a los totales generales
        totalCars += cars;
        totalTrucks += trucks;
        totalVans += vans;
        totalBuses += buses;
        totalMotorcycles += motorcycles;
        totalOtherVehicles += otherVehicles;

        // Sumar los valores por comunidad (para la gráfica de Highcharts)
        if (carTotalsByCommunity[community]) {
            carTotalsByCommunity[community] += cars;
        } else {
            carTotalsByCommunity[community] = cars;
        }

        if (trucksByCommunity[community]) {
            trucksByCommunity[community] += trucks;
        } else {
            trucksByCommunity[community] = trucks;
        }
    });

        const categories = Object.keys(carTotalsByCommunity); // Las comunidades
        const carData = categories.map(c => carTotalsByCommunity[c]);
        const truckData = categories.map(c => trucksByCommunity[c]);
        
        Highcharts.chart('container', {
            chart: {
            type: 'column',
            zooming: {
                type: 'xy',
                mouseWheel: {
                    enabled: true,
                    sensitivity: 1.1
                    }
                }
            },
            title: {
                text: 'Total cars and trucks by autonomous community (2023)'
            },
            xAxis: {
                categories: categories,
                crosshair: true,
                accessibility: {
                    description: 'Comunidades autónomas'
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Número de vehículos'
                }
            },
            tooltip: {
                followTouchMove: false
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [
                {
                    name: 'Cars',
                    data: carData
                },
                    {
                    name: 'Trucks',
                    data: truckData
                    }
                ]
            });
    
        //Grafica de c3 tipo pie 
        var chart = c3.generate({
        bindto: '#c3-pie-chart',
        data: {
            columns: [
                ['Coches', totalCars],
                ['Camiones', totalTrucks],
                ['Furgonetas', totalVans],
                ['Autobuses', totalBuses],
                ['Motos', totalMotorcycles],
                ['Otros', totalOtherVehicles]
            ],
            type: 'pie',
            onclick: function (d, i) { console.log("onclick", d, i); },
            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        pie: {
            label: {
                format: function (value, ratio, id) {
                    return `${id}: ${value}`;
                }
            }
        }
    });
});

</script>

<figure class="highcharts-figure">
    <div id="container"></div>
    <div id="c3-pie-chart"></div>
    
</figure>