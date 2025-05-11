<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<script>
    //@ts-nocheck
    import {onMount} from "svelte";
    import {dev} from "$app/environment"
    import { Table,Button } from '@sveltestrap/sveltestrap';

    let DEVEL_HOST = "http://localhost:16078";
    let API_DLC = "/api/v1/sanctions-and-points-stats";
    let API_MRC = "/api/v1/accident-rate-stats";
    let API_JVF = "/api/v1/ownerships-changes-stats"
    if(dev){
        API_DLC = DEVEL_HOST + API_DLC
        API_MRC = DEVEL_HOST + API_MRC
        API_JVF = DEVEL_HOST + API_JVF
    }
    let sanctionsData = [];
    let accidentsData = [];
    let changesData = [];
    let result ="";
    let resultStatus ="";
    async function getSanctions() {
        resultStatus = result = "";
        try {
            const res = await fetch(API_DLC, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            console.log(result)
            sanctionsData = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API_DLC}: ${error}`)
        }
    }
    async function getAccidents() {
        resultStatus = result = "";
        try {
            const res = await fetch(API_MRC, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            console.log(result)
            accidentsData = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API_MRC} ${error}`)
        }
    }
    async function getChanges() {
        resultStatus = result = "";
        try {
            const res = await fetch(API_JVF, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            console.log(result)
            changesData = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API_JVF} ${error}`)
        }
    }


    function renderChart() {
        const totalSanctions = sanctionsData.reduce((sum, d) => sum + d.total_sanctions_with_points, 0);
        const totalAccidents = accidentsData.reduce((sum, d) => sum + d.deceased, 0);
        const totalChanges = changesData.reduce((sum, d) => sum + d.truck, 0);

        const myData = [
            { name: 'Sanciones con puntos', y: totalSanctions },
            { name: 'Fallecidos', y: totalAccidents },
            { name: 'Cambios de titularidad', y: totalChanges }
        ];

        Highcharts.chart('container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Datos combinados'
            },
            tooltip: {
                formatter: function () {
                    return `<b>${this.point.name}</b>: ${Highcharts.numberFormat(this.point.y, 0, ',', '.')} registros`;
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'Total',
                colorByPoint: true,
                data: myData
            }]
        });
    }

    onMount(async () => {
        await getSanctions();
        await getAccidents();
        await getChanges();
        renderChart();
    });

</script>
    <div id="container"></div>