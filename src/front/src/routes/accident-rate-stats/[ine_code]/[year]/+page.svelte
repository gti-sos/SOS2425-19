<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    const DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/accident-rate-stats/";

    $: ine_code = $page.params.ine_code;
    $: year = $page.params.year;

    console.log('ine_code:', ine_code);
    console.log('year:', year);

    if (import.meta.env.DEV) {
        API = DEVEL_HOST + API;
    }

    let accident = {
        ine_code: "",
        municipality: "",
        province: "",
        ccaa: "",
        year: "",
        deceased: "",
        injured_hospitalized: "",
        injured_not_hospitalized: ""
    };

    let message = "";
    let successMessage = "";  // Variable para el mensaje de éxito

    // Cargar el accidente desde la API
    onMount(async () => {
        try {
            const res = await fetch(`${API}${ine_code}/${year}`);
            if (res.ok) {
                accident = await res.json();
            } else {
                message = `Error al obtener los datos: ${res.status}`;
            }
        } catch (error) {
            message = `Error al conectar con la API: ${error}`;
        }
    });

    // Enviar los datos actualizados
    async function updateAccident() {
        try {
            const res = await fetch(`${API}${ine_code}/${year}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(accident)
            });

            if (res.ok) {
                successMessage = "Registro actualizado correctamente";  // Mostrar mensaje de éxito
                message = "";  // Limpiar el mensaje de error si la actualización es exitosa
                setTimeout(() => {
                    goto("/accident-rate-stats"); // Redirigir después de un tiempo
                }, 1000);
            } else {
                const text = await res.text();
                message = `Error al actualizar: ${res.status} - ${text}`;
                successMessage = ""; // Limpiar el mensaje de éxito si ocurre un error
            }
        } catch (error) {
            message = `Error al conectar con la API: ${error}`;
            successMessage = ""; // Limpiar el mensaje de éxito si ocurre un error
        }
    }
</script>

<h2>Editar registro de accidente</h2>

{#if message}
    <p style="color: red">{message}</p>
{/if}

{#if successMessage}
    <p style="color: green">{successMessage}</p>
{/if}

<form on:submit|preventDefault={updateAccident}>
    <label>INE Code: <input bind:value={accident.ine_code} disabled /></label><br />
    <label>Año: <input bind:value={accident.year} disabled /></label><br />
    <label>Municipio: <input bind:value={accident.municipality} /></label><br />
    <label>Provincia: <input bind:value={accident.province} /></label><br />
    <label>CCAA: <input bind:value={accident.ccaa} /></label><br />
    <label>Fallecidos: <input type="number" bind:value={accident.deceased} /></label><br />
    <label>Heridos hospitalizados: <input type="number" bind:value={accident.injured_hospitalized} /></label><br />
    <label>Heridos no hospitalizados: <input type="number" bind:value={accident.injured_not_hospitalized} /></label><br />

    <button type="submit">Actualizar</button>
</form>
