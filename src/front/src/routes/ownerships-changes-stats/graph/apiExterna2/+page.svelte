<script>
    import { onMount } from "svelte";
    import{dev} from "$app/environment";

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v2/ownerships-changes-stats";
    const RemoteApi= "http://universities.hipolabs.com/search?country=spain";
    
    /**
	 * @type {string | any[]}
	 */
    let uniSpain=[];

    

    onMount(async() =>{
        const resExt= await fetch(RemoteApi);
        const data = await resExt.json();

        uniSpain = data;
        console.log(uniSpain);


    });
</script>

<h2>Universidades de españa</h2>
<ul>
  {#each uniSpain as uni}
    <li>{uni.name}</li>
  {/each}
</ul>