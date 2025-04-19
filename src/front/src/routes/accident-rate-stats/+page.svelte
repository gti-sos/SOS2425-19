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

    // Cargar los datos de accidentes desde la API
    async function getAccidents() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, { method: "GET" });
            const data = await res.json();
            result = JSON.stringify(data, null, 2);

            accidentData = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
        }
    }

    // Crear nuevo registro
async function createAccident() {
    resultStatus = result = "";

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

    console.log("Nuevo accidente:", newAccident);

    try {
        const res = await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newAccident)
        });

        resultStatus = res.status;
        result = await res.text();

        if (res.status === 201 || res.status === 200) {
            alert("Registro creado con éxito");
            getAccidents(); // Recargar la tabla
        } else {
            alert(`Error al crear el registro: ${res.status}\n${result}`);
        }
    } catch (error) {
        alert("Error de red al crear el registro");
        console.error(error);
    }
}


    // Eliminar un accidente
    async function deleteAccident(ine_code, year) {
        resultStatus = result = "";
        try {
            const res = await fetch(API + ine_code + "/" + year, { method: "DELETE" });
            const status = await res.status;
            resultStatus = status;
            if (status == 200) {
                console.log(`Dato ine_code:${ine_code}, año:${year} borrado con éxito`);
                getAccidents();
            } else {
                if (status == 404) {
                    alert(`No se ha encontrado el dato ine_code:${ine_code}, año:${year}`);
                }
                console.log(`ERROR deleting accident ${ine_code} ${year}: status received\n${status}`);
            }
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
        }
    }

    // Eliminar todos los datos de accidentes
    async function deleteAllAccidents() {
        try {
            const res = await fetch(API, { method: "DELETE" });
            const status = await res.status;
            resultStatus = status;
            if (status == 200) {
                console.log("Todos los datos se han borrado");
                getAccidents();
            } else {
                console.log(`ERROR deleting all accidents: status received\n${status}`);
            }
        } catch (error) {
            console.log(`ERROR deleting all data from ${API}: ${error}`);
        }
    }

    // Cargar datos iniciales
    async function loadInitialData() {
        try {
            const res = await fetch(API + "loadInitialData");
            const status = await res.status;
            resultStatus = status;
            if (status == 200) {
                const data = await res.json();
                console.log("Datos iniciales cargados");
                getAccidents();
            } else {
                const errorText = await res.text();
                console.error("Error:", errorText);
                alert(`No se pudieron cargar los datos: ${errorText}`);
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert(`Error de red al cargar los datos: ${error}`);
        }
    }

    // Función de búsqueda de accidentes
    async function searchAccidents() {
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
            accidentData = data; // Actualizar el array con los resultados
        } catch (error) {
            console.error("Error al buscar accidentes:", error);
        }
    }

    onMount(async () => {
        getAccidents();
    });
</script>

<h3>Buscar estadísticas de accidentes</h3>
<div>
    <input placeholder="INE code" bind:value={searchIneCode} />
    <input placeholder="Municipio" bind:value={searchMunicipality} />
    <select bind:value={searchProvince}>
        <option value="">-- Provincia --</option>
        {#each provinces as province}
            <option value={province}>{province}</option>
        {/each}
    </select>
    <select bind:value={searchCCAA}>
        <option value="">-- Comunidad Autónoma --</option>
        {#each autonomousCommunities as community}
            <option value={community}>{community}</option>
        {/each}
    </select>
    <input placeholder="Año" bind:value={searchYear} />
    <input placeholder="Desde (año)" bind:value={searchFrom} />
    <input placeholder="Hasta (año)" bind:value={searchTo} />
    <input placeholder="Cantidad de resultados a mostrar" bind:value={searchLimit} />
    <input placeholder="Saltar los primeros resultados" bind:value={searchOffset} />

    <Button on:click={searchAccidents}>Buscar</Button>
</div>

<svelte:head>
    <title>
        Accident Rate Stats Manager
    </title>
</svelte:head>

<h2>Estadísticas de Accidentes</h2>
<Table>
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
            <td> 
                <input bind:value={newAccidentIneCode}>
            </td>
            <td> 
                <input bind:value={newAccidentMunicipality}>
            </td>
            <td> 
                <input bind:value={newAccidentProvince}>
            </td>
            <td> 
                <input bind:value={newAccidentCCAA}>
            </td>
            <td> 
                <input bind:value={newAccidentYear}>
            </td>
            <td> 
                <input bind:value={newAccidentDeceased}>
            </td>
            <td> 
                <input bind:value={newAccidentInjuredHospitalized}>
            </td>
            <td> 
                <input bind:value={newAccidentInjuredNotHospitalized}>
            </td>
            <td>
                <Button color="primary" on:click={createAccident} >Crear registro</Button>
            </td>
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
                <Button color="warning" on:click={() => goto(`/accident-rate-stats/${accident.ine_code}/${accident.year}/editar`)}>Editar</Button>
                <Button color="danger" on:click={() => { deleteAccident(accident.ine_code, accident.year) }} >Borrar</Button>
            </td>
        </tr>
        {/each}
    </tbody>
</Table>

<Button color="danger" on:click={() => { deleteAllAccidents() }} >Borrar todos los datos</Button>
<Button color="primary" on:click={() => { loadInitialData() }} >Cargar datos de prueba</Button>
