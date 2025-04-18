<script>
    //@ts-nocheck
    import {dev} from "$app/environment";
    import {onMount} from "svelte";

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v1/ownerships-changes-stats";

    if (dev){
        API= DEVEL_HOST + API;
    }

   
    let changesData=[];
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
            changesData= data;
            console.log(`response received : ${JSON.stringify(changesData,null,2)} `)
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

    async function createExchanges(){
        resultStatus = result = "";
        try{
            const res = await fetch(API,{
                method:"POST",
                header:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({

                    "autonomous_community" : newExchangeAC.trim(),
                    "province" : newExchangeProvince.trim(),
                    "truck" :Number(newExchangeTruck),
                    "van":Number(newExchangeVan),
                    "bus" :Number(newExchangeBus),
                    "car" : Number(newExchangeCar),
                    "motocycle":Number(newExchangeMotocycle),
                    "other_vehicle" :Number(newExchangeOther),
                    "year":Number(newExchangeYear)

                })
            });
            const status= await res.status;
            resultStatus=status;
            if (status == 201){
                console.log(`contact created`);
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
                console.log(`ERROR: status received \ ${status}`);
            }
        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }
   
    onMount(async () =>  {
        getExchanges()
    });



</script>

<Table>

</Table>
