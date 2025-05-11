<script>
  import { onMount } from "svelte";
  let city = "Madrid"; // Ciudad a buscar
  /**
	 * @type {{ formatted: any; geometry: { lat: any; lng: any; }; components: { country: any; state: any; }; } | null}
	 */
  let data = null;
  /**
	 * @type {string | null}
	 */
  let error = null;

  // API Key de OpenCage
  const apiKey = "83b8a4dc446e4a78afe94bbc3facd0a8"; // Reemplaza con tu clave API de OpenCage

  // Función para obtener datos de la API
  const fetchCityData = async () => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${apiKey}`
      );
      const result = await response.json();
      if (result.results.length > 0) {
        data = result.results[0];
        error = null;
      } else {
        data = null;
        error = "No se encontraron resultados.";
      }
    } catch (err) {
      error = "Error al obtener los datos.";
      data = null;
    }
  };

  // Realizar la solicitud cuando la página se monta
  onMount(() => {
    fetchCityData();
  });
</script>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 8px;
    border: 1px solid #ddd;
  }
  th {
    background-color: #f2f2f2;
  }
</style>

<main>
  <h1>Datos sobre la Ciudad: {city}</h1>

  {#if error}
    <p style="color: red;">{error}</p>
  {/if}

  {#if data}
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Latitud</th>
          <th>Longitud</th>
          <th>País</th>
          <th>Comunidad Autónoma</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{data.formatted}</td>
          <td>{data.geometry.lat}</td>
          <td>{data.geometry.lng}</td>
          <td>{data.components?.country}</td>
          <td>{data.components?.state}</td>
        </tr>
      </tbody>
    </table>
  {/if}
</main>
