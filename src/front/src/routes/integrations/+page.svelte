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
