<svelte:head>
    <!-- Carga de estilos de C3 -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css" rel="stylesheet">

    <!-- Carga de D3.js (requerido por C3) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>

    <!-- Carga de C3.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>
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

        
    });

</script>
