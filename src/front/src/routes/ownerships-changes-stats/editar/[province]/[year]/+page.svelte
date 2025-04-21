<script>
	//@ts-nocheck
	import { Table,Button } from "@sveltestrap/sveltestrap";
	import {onMount} from "svelte";
	import {dev} from "$app/environment";
	import { page } from "$app/stores";
    import { get } from "svelte/store";
	import { goto } from '$app/navigation';
	import {title} from "process";

	let DEVEL_HOST= "http://localhost:16078";
	let API="/api/v2/ownerships-changes-stats/";
	if(dev){
		API=DEVEL_HOST + API
	}

	let exChangesData=[];
    let result="";
    let resultStatus="";

	let editExchangeAC="";
    let editExchangeProvince="";
    let editExchangeTruck="";
    let editExchangeVan="";
    let editExchangeBus="";
    let editExchangeCar="";
    let editExchangeMotocycle="";
    let editExchangeOther="";
    let editExchangeYear="";


	
    async function getExchange(){
        resultStatus = result = "";
		const $page=get(page);

		let province= $page.params.province;
		let year=$page.params.year;

        try{
            const res = await fetch(`${API}${province}/${year}`,{method:"GET"});
            const data= await res.json();

			exChangesData=data;
			const x= exChangesData[0];

            console.log(x);
			editExchangeAC=x.autonomous_community;
			editExchangeProvince=x.province ;
			editExchangeTruck=x.truck;
			editExchangeVan=x.van;
			editExchangeBus=x.bus;
			editExchangeCar=x.car;
			editExchangeMotocycle=x.motocycle;
			editExchangeOther=x.other_vehicle;
			editExchangeYear=x.year;

        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }
	async function updateExchange(exchange){
		
		const url=`${API}${exchange.province}/${exchange.year}`;
        try{
            const res = await fetch(url,{
				method:"PUT",
				headers:{
					"Content-type":"application/json"
				},
				body:JSON.stringify(exchange)
			});

            status = await res.status
            if (status ==200) {
                console.log(" updated successfully");
                console.log("Dato actualizado correctamente")
                goto("/ownerships-changes-stats/"); // recarga el dato actualizado
            } else {
                console.error("Failed to update", res.status);
            }
        } catch (error) {
            console.error("Error updating ", error);
        }
	}

	function updateFromInput(){
		const up={
		autonomous_community : editExchangeAC,
		province : editExchangeProvince,
    	truck : Number( editExchangeTruck),
        van: Number( editExchangeVan),
        bus: Number(editExchangeBus),
        car:  Number(editExchangeCar),
        motocycle:  Number( editExchangeMotocycle),
        other_vehicle :  Number( editExchangeOther),
        year: Number (editExchangeYear)
		}
		updateExchange(up);
	}
	onMount(() =>{
		getExchange();
	});

</script>
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
            <td><input bind:value={editExchangeAC}> </td>
            <td><input bind:value={editExchangeProvince} disabled></td>
            <td><input bind:value={editExchangeTruck}></td>
            <td><input bind:value={editExchangeVan}></td>
            <td><input bind:value={editExchangeBus}></td>
            <td><input bind:value={editExchangeCar}></td>
            <td><input bind:value={editExchangeMotocycle}></td>
            <td><input bind:value={editExchangeOther}></td>
            <td><input bind:value={editExchangeYear} disabled></td>

            <td>
                <Button color="warning" on:click={updateFromInput}>Actualizar</Button>
            </td>
		</tr>
	</tbody>
</Table>