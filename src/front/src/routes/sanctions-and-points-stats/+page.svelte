<script>
    //@ts-nocheck
    import {onMount} from "svelte";
    import {dev} from "$app/environment"
    import { Table } from '@sveltestrap/sveltestrap';

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
            console.log(`Response Received: \n${JSON.stringify(sanctionsData,null,2)}`);
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }

    onMount(async () => {
        getSanctions();
    })
</script>

<h2>sanctions-and-points-stats</h2>
<!--{JSON.stringify(sanctionsData,null,2)}-->
<Table>
    <thead>
        <tr>
            <th>ine_code</th>
            <th>province</th>
            <th>autonomous_community</th>
            <th>year</th>
            <th>total_sanctions_with_points</th>
            <th>total_points_deducted</th>
        </tr>
    </thead>
    <tbody>
        {#each sanctionsData.slice().sort((a, b) => a.ine_code - b.ine_code) as sanction}
        <tr>
            <td>
                {sanction.ine_code}
            </td>
            <td>
                {sanction.province}
            </td>
            <td>
                {sanction.autonomous_community}
            </td>
            <td>
                {sanction.year}
            </td>
            <td>
                {sanction.inetotal_sanctions_with_points_code}
            </td>
            <td>
                {sanction.total_points_deducted}
            </td>
        </tr>
        {/each}
    </tbody>
</Table>