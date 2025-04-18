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
    let neExchangeOther;
    let newExchangeYear;

    async function getChanges(){
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

    }

    async function createChanges(){
        resultStatus = result = "";
        try{
            const res = await fetch(API,{
                method:"POST",
                header:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify({


 
                })
            });
            const status= await res.status;
            resultStatus=status;
            if (status == 201){
                console.log(`contact created`);
            } else {
                console.log(`ERROR: status received \ ${status}`);
            }
        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }
   
    onMount(async () =>  {
        getChanges()
    });



</script>

<Table>

</Table>
