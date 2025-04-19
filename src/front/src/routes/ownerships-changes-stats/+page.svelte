<script>
    //@ts-nocheck
    import {dev} from "$app/environment";
    import {onMount} from "svelte";
    import {Table,Button} from '@sveltestrap/sveltestrap';
	

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v1/ownerships-changes-stats/";

    if (dev){
        API= DEVEL_HOST + API;
    }

   
    let exChangesData=[];
    let result="";
    let resultStatus="";

    let newExchangeAC;
    let newExchangeProvince;
    let newExchangeTruck;
    let newExchangeVan;
    let newExchangeBus;
    let newExchangeCar;
    let newExchangeMotocycle;
    let newExchangeOther;
    let newExchangeYear;

    let provinces =[];
    let AC=[];

    let searchExchangeAC = "";
    let searchExchangeProvince= "";
    let searchExchangeTruck= "";
    let searchExchangeVan= "";
    let searchExchangeBus= "";
    let searchExchangeCar= "";
    let searchExchangeMotocycle= "";
    let searchExchangeOther= "";
    let searchExchangeYear= "";
    let searchExchangeTo= "";
    let searchExchangeFrom= "";
    let searchExchangeLimit= "";
    let searchExchangeOffset= "";


    async function getExchanges(){
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


    async function deleteExchanges(province,year){
        resultStatus=result="";
        try{
            const res = await fetch(API+province+"/"+ year,{method:"DELETE"});
            const status= await res.status;
            resultStatus=status;
            if(status==200){
                console.log(`Dato province: ${province}, año: ${year} borrado`);
                getExchanges();
            }else{
                if(status==404){
                    alert(`No se ha encontrado el dato province: ${province}, año: ${year} `)
                } 
                console.log(`ERROR, status ${status}`)
            }

        } catch (error){
            console.log(`ERROR: DELETE data from ${API}: ${error}`);
        }
    }

    async function deleteAllExchanges(){
        try{
            const res = await fetch(API, {method:"DELETE"});
            const status = await res.status;
            resultStatus=status;
            if(status==200){
                console.log("Todos los datos se han borrado");
                getExchanges();
            }else{
                console.log(`ERROR, status ${status}`)
            }

        }catch(error){
            console.log(`ERROR: DELETE data from ${API}: ${error}`);
        }
    }
    function toValidNumber(value) {
        const num = Number(value);
        return isNaN(num) ? undefined : num;
    }


    async function createExchanges(){
        resultStatus = result = "";
        try{
            const res = await fetch(API,{
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({

                    "autonomous_community" : newExchangeAC?.trim()||undefined,
                    "province" : newExchangeProvince?.trim()||undefined,
                    "truck" :toValidNumber(Number(newExchangeTruck)),
                    "van":toValidNumber(Number(newExchangeVan)),
                    "bus" :toValidNumber(Number(newExchangeBus)),
                    "car" : toValidNumber(Number(newExchangeCar)),
                    "motocycle": toValidNumber(Number(newExchangeMotocycle)),
                    "other_vehicle" : toValidNumber(Number(newExchangeOther)),
                    "year":toValidNumber((newExchangeYear))

            })
            });
            const status= await res.status;
            resultStatus=status;
            console.log(status);
            if (status == 201){
                console.log(`contact created:\n ${JSON.stringify(exChangesData,null,2)} `);
                getExchanges();
                newExchangeAC="";
                newExchangeProvince="";
                newExchangeTruck="";
                newExchangeVan="";
                newExchangeBus="";
                newExchangeCar="";
                newExchangeMotocycle="";
                newExchangeOther="";
                newExchangeYear="";
            } else {
                if(status==400){
                    alert(`Faltan datos por introducir`)    
                }
                else if(status==409){
                    alert(`Dato existente`)
                }
                console.log(`ERROR: status received \n ${status}`);
            }
        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }
   
    async function loadInitialData() {
        try {
            const res = await fetch(API + "loadInitialData");
            const status = await res.status;
            resultStatus=status;
            if (status==200){
                const data= await res.json();
                console.log("datos iniciales cargados ");
                getExchanges();
            }else{
                const errorText=await res.text();
                console.error("Error",errorText);
                alert(`no se pudieron cargar los datos: ${errorText}`)
            }
        } catch (error) {
            console.error("Error de red", error);
            alert(`Eror de red : ${error}`);
        }
    }

    async function searchExchanges() {
        let url=`${API}?`;
        const params=[];
        console.log(searchExchangeAC);
        if (searchExchangeAC) params.push(`autonomous_community=${encodeURIComponent(searchExchangeAC)}`);
        if (searchExchangeProvince) params.push(`province=${encodeURIComponent(searchExchangeProvince)}`);
        if (searchExchangeTruck) params.push(`truck=${searchExchangeTruck}`);
        if (searchExchangeVan) params.push(`van=${searchExchangeVan}`);
        if (searchExchangeBus) params.push(`bus=${searchExchangeBus}`);
        if (searchExchangeCar) params.push(`car=${searchExchangeCar}`);
        if (searchExchangeMotocycle) params.push(`motocycle=${searchExchangeMotocycle}`);
        if (searchExchangeOther) params.push(`other_vehicle=${searchExchangeOther}`)
        if (searchExchangeYear) params.push(`year=${searchExchangeYear}`);

        if (searchExchangeFrom) params.push(`from=${searchExchangeFrom}`);
        if (searchExchangeTo) params.push(`to=${searchExchangeTo}`);
        if (searchExchangeLimit) params.push(`limit=${searchExchangeLimit}`);
        if (searchExchangeOffset) params.push(`offset=${searchExchangeOffset}`);

        url += params.join("&");

        try {
            const res = await fetch(url);
            const data = await res.json();
            exChangesData = data; // Actualizar el array con los resultados
        } catch (error) {
            console.error("Error al buscar accidentes:", error);
        }
    }

    onMount(async () =>  {
        getExchanges()

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
    });



</script>

<h2>Exchange List</h2>
<div>

    <select bind:value={searchExchangeProvince}>
        <option value="">-- Provincia --</option>
        {#each provinces as province}
            <option value={province}>{province}</option>
        {/each}
    </select>
    <select bind:value={searchExchangeAC}>
        <option value="">-- Comunidad Autónoma --</option>
        {#each AC as community}
            <option value={community}>{community}</option>
        {/each}
    </select>
    <input placeholder="Año" bind:value={searchExchangeYear} />
    <input placeholder="Desde (año)" bind:value={searchExchangeFrom} />
    <input placeholder="Hasta (año)" bind:value={searchExchangeTo} />
    <input placeholder="Cantidad de resultados a mostrar" bind:value={searchExchangeLimit} />
    <input placeholder="Saltar los primeros resultados" bind:value={searchExchangeOffset} />

    <Button on:click={searchExchanges}>Buscar</Button>
</div>
<Table>
    <thead>
        <tr>
            <th> Autonomous community </th>
            <th> Province </th>
            <th> Truck </th>
            <th> Van </th>    
            <th> Bus </th>
            <th> Car </th>
            <th> Motocycle </th>
            <th> Other Vehicle</th>
            <th> Year </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={newExchangeAC}>
            </td>
            <td>
                <input bind:value={newExchangeProvince}>
            </td>
            <td>
                <input bind:value={newExchangeTruck}>
            </td>
            <td>
                <input bind:value={newExchangeVan}>
            </td>
            <td>
                <input bind:value={newExchangeBus}>
            </td>
            <td>
                <input bind:value={newExchangeCar}>
            </td>
            <td>
                <input bind:value={newExchangeMotocycle}>
            </td>
            <td>
                <input bind:value={newExchangeOther}>
            </td>
            <td>
                <input bind:value={newExchangeYear}>
            </td>

            <td>
                <Button color="secondary" on:click={createExchanges}>Crear registro</Button>
            </td>
       
        </tr>
        {#each exChangesData.slice().sort((a, b) => a.autonomous_community.localeCompare(b.autonomous_community)) as exchange}

            <tr>
                <td>
                    {exchange.autonomous_community}
                </td>
                <td>
                    {exchange.province}
                </td>
                <td>
                    {exchange.truck}
                </td>
                <td>
                    {exchange.van}
                </td>
                <td>
                    {exchange.bus}
                </td>
                <td>
                    {exchange.car}
                </td>
                <td>
                    {exchange.motocycle}
                </td>
                <td>
                    {exchange.other_vehicle}
                </td>
                <td>
                    {exchange.year}
                </td>
                <td>
                    <Button color="danger" on:click={() => {deleteExchanges(exchange.province,exchange.year)}}>Delete</Button>
                    <a href={`/ownerships-changes-stats/editar/${exchange.province}/${exchange.year}`}> <Button color="secondary">Editar</Button></a>                  

                </td>

            </tr>
        {/each}
    </tbody>

</Table>
<Button color = "danger" on:click={()=>{deleteAllExchanges()} }> Borrar todo</Button>
<Button color="primary" on:click={() => { loadInitialData() }} >Cargar datos de prueba</Button>
