<script>
    import { onMount } from 'svelte';

    
    
    /**
	 * @type {string | any[]}
	 */
    let countries = [];

    onMount(async () => {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries");
        const data = await res.json();
        countries = data.data; // Aquí recibes { country, cities }
    });
</script>

<h2>Lista de países</h2>

{#if countries.length === 0}
    <p>Cargando datos...</p>
{:else}
    <ul>
        {#each countries as country}
            <li>{country.country}</li>
        {/each}
    </ul>
{/if}
