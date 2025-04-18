<script>
    import {dev} from "$app/environment"
	import { svelte } from "@sveltejs/vite-plugin-svelte";
    import {onMount} from "svelte";

    let API= "https://localhost::160787/api/v1/ownerships-changes-stats"
   
    let changesData=[];
    let result="";
    let resultStatus="";
    
    async function getChanges(){
        resultStatus = result = "";
        try{
            const res = await fetch(API,{method:"GET"});
            const data= await res.json();

            result = JSON.stringify(data,null,2);
            changesData= data;
        
        } catch (error){
            console.log(`ERROR: GET from ${API}: ${error}`);
        }
    }

   
    onMount(async () =>  {
        getChanges()
    });



</script>
