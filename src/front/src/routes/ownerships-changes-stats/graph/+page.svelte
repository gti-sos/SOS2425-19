
<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
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
    let API= "/api/v2/ownerships-changes-stats/summary";

    if (dev){
        API= DEVEL_HOST + API
    };

    let exChangesData=[];
    let result="";
    let resultStatus="";

    async function getSummary(){
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
        await getSummary();
        
        const carTotalsByCommunity = {};

        exChangesData.forEach(entry => {
            const community = entry.autonomous_community;
            const cars = entry.total_car || 0;

            if (carTotalsByCommunity[community]) {
                carTotalsByCommunity[community] += cars;
            } else {
                carTotalsByCommunity[community] = cars;
                }
            });

        // Extraer las categorías (comunidades) y los valores (total de coches)
        const categories = Object.keys(carTotalsByCommunity);
        const carData = Object.values(carTotalsByCommunity);
        
        
        Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Total car by community'
        },
        
        xAxis: {
            categories: categories,
            crosshair: true,
            accessibility: {
                description: 'comunidades autonomas'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'total cars '
            }
        },
        tooltip: {
            valueSuffix: ' (1000 MT)'
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Cars',
            data: carData
        }]
    });
    });

</script>

<figure class="highcharts-figure">
    <div id="container"></div>
    
</figure>