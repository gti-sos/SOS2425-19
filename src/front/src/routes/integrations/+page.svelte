
<script>

    //@ts-nocheck
    import {onMount} from "svelte";
    import {dev} from "$app/environment"
    import { Table,Button } from '@sveltestrap/sveltestrap';

    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/sanctions-and-points-stats";
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
            console.log(result)
            sanctionsData = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }

    onMount(async () => {
    await getSanctions();
});

</script>

<main>
    <h1>Listado de Integraciones</h1>

    <table>
        <thead>
            <tr>
                <th>Integraciones MRC</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <a href="/accident-rate-stats/graphs/G15-temperature-stats">Integración G15</a>
                </td>
                <td>
                    <!-- Aquí irían las integraciones AMG cuando existan -->
                </td>
            </tr>
            <tr>
                <td>
                    <a href="/accident-rate-stats/graphs/G22-ministry-of-justice-in-zaragoza">Integración G22</a>
                </td>
                <td>
                    <!-- Espacio para futuras integraciones AMG -->
                </td>
            </tr>
            <tr>
                <td>
                    <a href="/accident-rate-stats/graphs/">Integración API propia</a>
                </td>
                <td>
                    <!-- Espacio reservado para AMG -->
                </td>
            </tr>
            <tr>
                <td>
                    <a href="/accident-rate-stats/graphs/apiexterna1">Integración API externa 1 MRC</a>
                </td>
                <td>
                    <!-- Espacio para AMG -->
                </td>
            </tr>
            <tr>
                <td>
                    
                </td>
                <td>
                    <!-- Espacio para AMG -->
                </td>
            </tr>
        </tbody>
        <thead> 
            <tr>
                <th>Integraciones DLC</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <a href="sanctions-and-points-stats/integrations">Integrations DLC</a>
                </td>
                
            </tr>
        </tbody>
    </table>
</main>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    a {
        color: #0066cc;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
</style>
