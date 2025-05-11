<script>
    import { onMount } from "svelte";
    import{dev} from "$app/environment";

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v2/ownerships-changes-stats";
    const RemoteApi= "https://date.nager.at/api/v3/PublicHolidays/2024/ES";
    
    /**
	 * @type {string | any[]}
	 */
    let holidays=[];

    

    onMount(async() =>{
        const resExt= await fetch(RemoteApi);
        const data = await resExt.json();

        holidays = data;
        console.log(holidays);


    });
</script>

<h2>Festividades en España 2024</h2>
<ul>
  {#each holidays as name}
    <li>{name.localName}</li>
  {/each}
</ul>