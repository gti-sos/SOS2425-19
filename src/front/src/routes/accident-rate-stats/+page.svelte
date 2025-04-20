<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { Table, Button } from '@sveltestrap/sveltestrap';
    import { goto } from '$app/navigation';

    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/accident-rate-stats/";
    if (dev) {
        API = DEVEL_HOST + API;
    }

    let accidentData = [];
    let result = "";
    let resultStatus = "";

    let successMessage = "";
    let errorMessage = "";

    let newAccidentIneCode;
    let newAccidentMunicipality;
    let newAccidentProvince;
    let newAccidentCCAA;
    let newAccidentYear;
    let newAccidentDeceased;
    let newAccidentInjuredHospitalized;
    let newAccidentInjuredNotHospitalized;

    let provinces = [];
    let autonomousCommunities = [];

    let searchIneCode = "";
    let searchMunicipality = "";
    let searchProvince = "";
    let searchCCAA = "";
    let searchYear = "";
    let searchFrom = "";
    let searchTo = "";
    let searchLimit = "";
    let searchOffset = "";

    async function getAccidents() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, { method: "GET" });
            const data = await res.json();
            result = JSON.stringify(data, null, 2);
            accidentData = data;
        } catch (error) {
            errorMessage = `Error al obtener los datos: ${error}`;
        }
    }

    async function createAccident() {
        resultStatus = result = "";
        successMessage = errorMessage = "";

        const newAccident = {
            ine_code: Number(newAccidentIneCode),
            municipality: newAccidentMunicipality?.trim(),
            province: newAccidentProvince?.trim(),
            ccaa: newAccidentCCAA?.trim(),
            year: Number(newAccidentYear),
            deceased: Number(newAccidentDeceased),
            injured_hospitalized: Number(newAccidentInjuredHospitalized),
            injured_not_hospitalized: Number(newAccidentInjuredNotHospitalized)
        };

        try {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newAccident)
            });

            resultStatus = res.status;
            result = await res.text();

            if (res.status === 201 || res.status === 200) {
                successMessage = "Registro creado con éxito.";
                getAccidents();
            } else if (res.status === 409) {
                errorMessage = `Error al crear el registro, conflicto de datos.`;
            } else {
                errorMessage = `Error al crear el registro:`;
            }
        } catch (error) {
            errorMessage = "Error de red al crear el registro";
        }
    }

    async function deleteAccident(ine_code, year) {
        resultStatus = result = "";
        successMessage = errorMessage = "";

        try {
            const res = await fetch(API + ine_code + "/" + year, { method: "DELETE" });
            const status = await res.status;
            resultStatus = status;

            if (status == 200) {
                successMessage = `Dato (ine_code: ${ine_code}, año: ${year}) borrado con éxito.`;
                getAccidents();
            } else if (status == 404) {
                errorMessage = `No se ha encontrado el dato (ine_code: ${ine_code}, año: ${year}).`;
            } else {
                errorMessage = `Error al borrar el dato: ${status}`;
            }
        } catch (error) {
            errorMessage = `Error de red al borrar: ${error}`;
        }
    }

    async function deleteAllAccidents() {
        successMessage = errorMessage = "";
        try {
            const res = await fetch(API, { method: "DELETE" });
            const status = await res.status;
            resultStatus = status;

            if (status == 200) {
                successMessage = "Todos los datos se han borrado correctamente.";
                getAccidents();
            } else {
                errorMessage = `Error al borrar todos los datos: ${status}`;
            }
        } catch (error) {
            errorMessage = `Error de red al borrar todos los datos: ${error}`;
        }
    }

    async function loadInitialData() {
        successMessage = errorMessage = "";
        try {
            const res = await fetch(API + "loadInitialData");
            const status = await res.status;
            resultStatus = status;

            if (status == 200) {
                successMessage = "Datos iniciales cargados correctamente.";
                getAccidents();
            } else {
                const errorText = await res.text();
                errorMessage = `No se pudieron cargar los datos: ${errorText}`;
            }
        } catch (error) {
            errorMessage = `Error de red al cargar los datos: ${error}`;
        }
    }

    async function searchAccidents() {
        successMessage = errorMessage = "";

        let url = `${API}?`;
        const params = [];
        if (searchIneCode) params.push(`ine_code=${searchIneCode}`);
        if (searchMunicipality) params.push(`municipality=${encodeURIComponent(searchMunicipality)}`);
        if (searchProvince) params.push(`province=${encodeURIComponent(searchProvince)}`);
        if (searchCCAA) params.push(`ccaa=${encodeURIComponent(searchCCAA)}`);
        if (searchYear) params.push(`year=${searchYear}`);
        if (searchFrom) params.push(`from=${searchFrom}`);
        if (searchTo) params.push(`to=${searchTo}`);
        if (searchLimit) params.push(`limit=${searchLimit}`);
        if (searchOffset) params.push(`offset=${searchOffset}`);

        url += params.join("&");

        try {
            const res = await fetch(url);
            const data = await res.json();
            accidentData = data;
            successMessage = "Búsqueda completada con éxito.";
        } catch (error) {
            errorMessage = "Error al buscar accidentes.";
        }
    }

    onMount(() => getAccidents());
</script>

<svelte:head>
    <title>Accident Rate Stats Manager</title>
</svelte:head>

<h2>Estadísticas de Accidentes</h2>

{#if successMessage}
    <p style="color: green">{successMessage}</p>
{/if}

{#if errorMessage}
    <p style="color: red">{errorMessage}</p>
{/if}

<h3>Buscar estadísticas de accidentes</h3>
<div>
    <input placeholder="INE code" bind:value={searchIneCode} />
    <input placeholder="Municipio" bind:value={searchMunicipality} />
    <input placeholder="Provincia" bind:value={searchProvince} />
    <input placeholder="CCAA" bind:value={searchCCAA} />
    <input placeholder="Año" bind:value={searchYear} />
    <input placeholder="Desde (año)" bind:value={searchFrom} />
    <input placeholder="Hasta (año)" bind:value={searchTo} />
    <input placeholder="Cantidad de resultados a mostrar" bind:value={searchLimit} />
    <input placeholder="Saltar los primeros resultados" bind:value={searchOffset} />

    <Button on:click={searchAccidents}>Buscar</Button>
</div>

<Table style="table-layout: fixed; width: 100%;">
    <thead>
        <tr>
            <th>ine_code</th>
            <th>municipality</th>
            <th>province</th>
            <th>ccaa</th>
            <th>year</th>
            <th>deceased</th>
            <th>injured_hospitalized</th>
            <th>injured_not_hospitalized</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={newAccidentIneCode} style="width: 100%;"></td>
            <td><input bind:value={newAccidentMunicipality} style="width: 100%;"></td>
            <td><input bind:value={newAccidentProvince} style="width: 100%;"></td>
            <td><input bind:value={newAccidentCCAA} style="width: 100%;"></td>
            <td><input bind:value={newAccidentYear} style="width: 100%;"></td>
            <td><input bind:value={newAccidentDeceased} style="width: 100%;"></td>
            <td><input bind:value={newAccidentInjuredHospitalized} style="width: 100%;"></td>
            <td><input bind:value={newAccidentInjuredNotHospitalized} style="width: 100%;"></td>
            <td><Button color="primary" on:click={createAccident}>Crear registro</Button></td>
        </tr>

        {#each accidentData.slice().sort((a, b) => a.ine_code - b.ine_code) as accident}
        <tr>
            <td>{accident.ine_code}</td>
            <td>{accident.municipality}</td>
            <td>{accident.province}</td>
            <td>{accident.ccaa}</td>
            <td>{accident.year}</td>
            <td>{accident.deceased}</td>
            <td>{accident.injured_hospitalized}</td>
            <td>{accident.injured_not_hospitalized}</td>
            <td>
                <Button color="warning" on:click={() => goto(`/accident-rate-stats/${accident.ine_code}/${accident.year}`)}>Editar</Button>
                <Button color="danger" on:click={() => deleteAccident(accident.ine_code, accident.year)}>Borrar</Button>
            </td>
        </tr>
        {/each}
    </tbody>
</Table>

<Button color="danger" on:click={deleteAllAccidents}>Borrar todos los datos</Button>
<Button color="primary" on:click={loadInitialData}>Cargar datos iniciales</Button>
