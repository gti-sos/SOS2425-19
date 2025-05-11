<script>
  import { onMount } from 'svelte';

  /**
	 * @type {string | any[]}
	 */
  let products = [];
  let error = '';

  onMount(async () => {
    try {
      const res = await fetch('/api/dummy-products');
      const data = await res.json();
      products = data.products;
    } catch (err) {
      error = 'Error al cargar los productos';
    }
  });
</script>

<h2>Lista de productos (DummyJSON API)</h2>

{#if error}
  <p style="color: red;">{error}</p>
{:else if products.length === 0}
  <p>Cargando productos...</p>
{:else}
  <table border="1" style="border-collapse: collapse; width: 100%;">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Marca</th>
        <th>Precio</th>
        <th>Descripción</th>
      </tr>
    </thead>
    <tbody>
      {#each products as product}
        <tr>
          <td>{product.id}</td>
          <td>{product.title}</td>
          <td>{product.brand}</td>
          <td>{product.price}€</td>
          <td>{product.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
