<script>
    //@ts-nocheck
    import {dev} from "$app/environment";
    import {onMount} from "svelte";
    import {Table,Button} from '@sveltestrap/sveltestrap';

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v1/ownerships-changes-stats";

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


    async function deleteExchanges(){
        resultStatus=result="";
        try{
            const res = await fetch(API+province+"/" + year,{method:"DELETE"});
            const status= await res.status;
            resultStatus=status;
            if(status==200){
                console.log(`Dato province ${province}, año$ ${year} borrado`);
                getExchanges();
            }else{
                if(status==404){
                    alert(`No se ha encontrado el dato province ${province}, año$ ${year} `)
                } 
                console.log(`ERROR, status ${status}`)
            }

        } catch (error){
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
   
    onMount(async () =>  {
        getExchanges()
    });



</script>

<h2>Exchange List</h2>
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

                </td>

            </tr>
        {/each}
    </tbody>
</Table>
