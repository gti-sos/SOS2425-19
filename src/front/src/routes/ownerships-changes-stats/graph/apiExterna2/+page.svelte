<script>
    import { onMount } from "svelte";
    import{dev} from "$app/environment";

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v2/ownerships-changes-stats";
    const RemoteApi= "https://the-trivia-api.com/api/questions";
    
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

<h2>categorias y preguntas de trivia</h2>
<ul>
  {#each uniSpain as uni}
    <li>{uni.category}</li>
      <li>{uni.question}</li>
  {/each}
</ul>