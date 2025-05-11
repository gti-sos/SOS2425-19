<script>
  import { onMount } from 'svelte';

  /**
	 * @type {any[]}
	 */
  let teams = [];
  let loading = true;
  /**
	 * @type {null}
	 */
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Sevilla');
      if (!response.ok) throw new Error('Error al obtener los datos');
      const data = await response.json();
      teams = data.teams || [];
    } catch (err) {
      // @ts-ignore
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<h1>Información del equipo: Sevilla</h1>

{#if loading}
  <p>Cargando datos...</p>
{:else if error}
  <p style="color: red;">{error}</p>
{:else}
  <table border="1" cellpadding="6">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Estadio</th>
        <th>Año fundación</th>
        <th>Descripción</th>
      </tr>
    </thead>
    <tbody>
      {#each teams as team}
        <tr>
          <td>{team.strTeam}</td>
          <td>{team.strStadium}</td>
          <td>{team.intFormedYear}</td>
          <td>{team.strDescriptionEN?.slice(0, 100)}...</td>
          
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
