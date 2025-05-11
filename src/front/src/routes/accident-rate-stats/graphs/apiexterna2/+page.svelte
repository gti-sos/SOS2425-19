<script>
  import { onMount } from 'svelte';

  /**
   * @type {any[]}
   */
  let teams = [];
  let loading = false;
  /**
   * @type {null}
   */
  let error = null;
  let teamName = ''; // Nuevo campo para almacenar el nombre del equipo ingresado

  /**
   * Función para hacer la petición a la API con el nombre del equipo ingresado
   */
  const obtenerDatosEquipo = async () => {
    if (!teamName) return; // Si no se ha ingresado un equipo, no hacer nada
    loading = true;
    try {
      const response = await fetch(`https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${teamName}`);
      if (!response.ok) throw new Error('Error al obtener los datos');
      const data = await response.json();
      teams = data.teams || [];
    } catch (err) {
      // @ts-ignore
      error = err.message;
    } finally {
      loading = false;
    }
  };
</script>

<h1>Consulta de información del equipo</h1>

<!-- Campo de entrada para que el usuario ingrese el nombre del equipo -->
<input type="text" bind:value={teamName} placeholder="Ingresa el nombre del equipo" />
<button on:click={obtenerDatosEquipo}>Buscar equipo</button>

{#if loading}
  <p>Cargando datos...</p>
{:else if error}
  <p style="color: red;">{error}</p>
{:else if teams.length > 0}
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
{:else}
  <p>No se encontraron equipos con ese nombre.</p>
{/if}
