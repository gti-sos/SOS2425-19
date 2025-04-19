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
    let newSanctionIneCode;
    let newSanctionProvince;
    let newSanctionAutonomousCommunity;
    let newSanctionYear;
    let newSanctionTotalSanctions;
    let newSanctionTotalPoints;

    let provinces = [];
    let autonomousCommunities = [];

    let searchIneCode = "";
    let searchProvince = "";
    let searchAutonomousCommunity = "";
    let searchYear = "";
    let searchFrom = "";
    let searchTo = "";
    let searchLimit = "";
    let searchOffset = "";

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
    async function deleteSanction(ine_code,year) {
        resultStatus = result = "";
        try {
            const res = await fetch(API+ine_code+"/"+year, {method:"DELETE"});  
            const status = await res.status;            
            resultStatus=status;
            if (status==200){
                console.log(`Dato ine_code:${ine_code}, año:${year} borrado con éxito`)
                getSanctions();
            }else{
                if(status ==404){
                    alert(`No se ha encontrado el dato ine_code:${ine_code}, año:${year} `)
                }
                console.log(`ERROR deleting sanction ${ine_code} ${year}: status received\n${status}`);
            }
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
        }
    }

    async function deleteAllSanctions() {
        try {
            const res = await fetch(API, {method:"DELETE"});  
            const status = await res.status;            
            resultStatus=status;
            if (status==200){
                console.log("Todos los datos se han borrado")
                getSanctions();
            }else {                
            console.log(`ERROR deleting all sanctions: status received\n${status}`);
        }
        } catch (error) {
            console.log(`ERROR deleting all data from ${API}: ${error}`);
        }
    }

    function toValidNumber(value) {
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    }

    async function createSanction() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    "ine_code": toValidNumber(Number(newSanctionIneCode)),
                    "province": newSanctionProvince?.trim()|| undefined,
                    "autonomous_community": newSanctionAutonomousCommunity?.trim() || undefined,
                    "year": toValidNumber(Number(newSanctionYear)),
                    "total_sanctions_with_points": toValidNumber(Number(newSanctionTotalSanctions)),
                    "total_points_deducted": toValidNumber(Number(newSanctionTotalPoints))
            })
            });        
            
            const status = await res.status;
            resultStatus=status
            console.log(newSanctionTotalSanctions)
            if (status==201){
                console.log(`Sanction created: \n${JSON.stringify(sanctionsData,null,2)}`);
                getSanctions();
                newSanctionIneCode = "";
                newSanctionProvince = "";
                newSanctionAutonomousCommunity = "";
                newSanctionYear = "";
                newSanctionTotalSanctions = "";
                newSanctionTotalPoints = "";
                searchIneCode = "";
                searchProvince = "";
                searchAutonomousCommunity = "";
                searchYear = "";
                searchFrom = "";
                searchTo = "";
                searchLimit = "";
                searchOffset = "";
            }else{
                if(status ==400){
                    alert(`Faltan datos por rellenar`)
                }else if(status ==409){
                    alert(`Ya existen esos datos`)                    
                }
                console.log(`ERROR creating sanction:\n${status}`)
            }
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }

    async function loadInitialData() {
        try {
            const res = await fetch(API + "loadInitialData");
            const status = await res.status;
            resultStatus=status
            if (status==200) {
                const data = await res.json();
                console.log("Datos iniciales cargados");
                getSanctions();
            } else {
                const errorText = await res.text();
                console.error("Error:", errorText);
                alert(`No se pudieron cargar los datos: ${errorText}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert(`Error de red al cargar los datos: ${error}`);
        }
    }

    async function searchSanctions() {
        let url = `${API}?`;
        const params = [];
            console.log(searchAutonomousCommunity);
        if (searchIneCode) params.push(`ine_code=${searchIneCode}`);
        if (searchProvince && !searchAutonomousCommunity)params.push(`province=${encodeURIComponent(searchProvince)}`);
        if (searchAutonomousCommunity && !searchProvince)params.push(`autonomous_community=${encodeURIComponent(searchAutonomousCommunity)}`);
        if (searchYear) params.push(`year=${searchYear}`);
        if (searchFrom) params.push(`from=${searchFrom}`);
        if (searchTo) params.push(`to=${searchTo}`);
        if (searchLimit) params.push(`limit=${searchLimit}`);
        if (searchOffset) params.push(`offset=${searchOffset}`);

        url += params.join("&");

        try {
            const res = await fetch(url);
            const data = await res.json();
            sanctionsData = data // actualizar el array con los resultados
        } catch (error) {
            console.error("Error al buscar sanciones:", error);
        }
    }

    onMount(async () => {
        getSanctions();
        // Intenta cargar desde localStorage
    const savedProvinces = localStorage.getItem('provinces');
    const savedCommunities = localStorage.getItem('autonomousCommunities');

    if (savedProvinces && savedCommunities) {
        provinces = JSON.parse(savedProvinces);
        autonomousCommunities = JSON.parse(savedCommunities);
    } else {
        try {
            const res = await fetch(`${API}`);
            const data = await res.json();

            provinces = Array.from(new Set(data.map(d => d.province).filter(Boolean))).sort();
            autonomousCommunities = Array.from(new Set(data.map(d => d.autonomous_community).filter(Boolean))).sort();
            // Guardar en localStorage
            localStorage.setItem('provinces', JSON.stringify(provinces));
            localStorage.setItem('autonomousCommunities', JSON.stringify(autonomousCommunities));
        } catch (error) {
            console.error("Error al cargar provincias y comunidades:", error);
        }
    }
    })
</script>

<h3>Buscar sanciones</h3>
<div>
    <input placeholder="INE code" bind:value={searchIneCode} />
    <select bind:value={searchProvince} disabled={searchAutonomousCommunity}>
        <option value="">-- Provincia --</option>
        {#each provinces as province}
            <option value={province}>{province}</option>
        {/each}
    </select>
    <select bind:value={searchAutonomousCommunity} disabled={searchProvince}>
        <option value="">-- Comunidad Autónoma --</option>
        {#each autonomousCommunities as community}
            <option value={community}>{community}</option>
        {/each}
    </select>
    <input placeholder="Año" bind:value={searchYear} />
    <input placeholder="Desde (año)" bind:value={searchFrom} />
    <input placeholder="Hasta (año)" bind:value={searchTo} />
    <input placeholder="Cantidad de resultados a mostrar" bind:value={searchLimit} />
    <input placeholder="Saltar los primeros resultados" bind:value={searchOffset} />

    <Button on:click={searchSanctions}>Buscar</Button>
</div>

<svelte:head>
    <title>
        Sanctions Manager
    </title>
</svelte:head>

<h2>sanctions-and-points-stats</h2>
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
        <tr>
            <td> 
                <input bind:value={newSanctionIneCode}>
            </td>
            <td> 
                <input bind:value={newSanctionProvince}>
            </td>
            <td> 
                <input bind:value={newSanctionAutonomousCommunity}>
            </td>
            <td> 
                <input bind:value={newSanctionYear}>
            </td>
            <td> 
                <input bind:value={newSanctionTotalSanctions}>
            </td>
            <td> 
                <input bind:value={newSanctionTotalPoints}>
            </td>
            
            <td>
                <Button color="primary" on:click={createSanction} >Crear registro</Button>
            </td>
        </tr>

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
                {sanction.total_sanctions_with_points}
            </td>
            <td>
                {sanction.total_points_deducted}
            </td>
            <td>
                <Button color="danger" on:click={()=>{deleteSanction(sanction.ine_code,sanction.year)}} >Borrar</Button>
                <a href={`/sanctions-and-points-stats/editar/${sanction.ine_code}/${sanction.year}`}> <Button color="secondary">Editar</Button></a>                  
            </td>
        </tr>
        {/each}
    </tbody>
</Table>

<Button color="danger" on:click={()=>{deleteAllSanctions()}} >Borrar datos</Button>
<Button color="primary" on:click={()=>{loadInitialData()}} >Datos de prueba</Button>

