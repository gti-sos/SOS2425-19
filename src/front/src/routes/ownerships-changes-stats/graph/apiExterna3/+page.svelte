<script>
    import { onMount } from "svelte";
    import{dev} from "$app/environment";

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v2/ownerships-changes-stats";
   
    /**
	 * @type {string | any[]}
	 */
    let characters=[];

    

    onMount(async() =>{
        const resExt= await fetch('/proxy/harry');
        const data = await resExt.json();

        characters = data;
        console.log(characters);


    });
</script>

<h2>Personajes de harry potter</h2>
<ul>
  {#each characters as uni}
    <li>{uni.name}</li>
  {/each}
</ul>