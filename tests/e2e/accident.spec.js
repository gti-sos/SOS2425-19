// @ts-check
import { test, expect } from '@playwright/test';

// Pruebas para Accidentes

test('has title', async ({ page }) => {
  await page.goto('http://localhost:16078/accident-rate-stats', { timeout: 60000 }); // Aumenta el timeout al cargar la página

  // Verificar que el título de la página contiene "Accident Rate Stats Manager"
  await expect(page).toHaveTitle(/Accident Rate Stats Manager/, { timeout: 60000 });  // Aumenta el timeout para la comprobación del título
});

test('create and delete accident', async ({ page }) => {
  const testIneCode = "1001";
  const testMunicipality = "Alegría-Dulantzi";
  const testProvince = "Araba/Álava";
  const testCCAA = "País Vasco";
  const testYear = "2022";
  const testDeceased = "1";
  const testInjuredHospitalized = "1";
  const testInjuredNotHospitalized = "1";

  await page.goto('http://localhost:16078/accident-rate-stats/', { timeout: 60000 });

  // Llenar los campos con los datos de prueba
  await page.locator('input').nth(0).fill(testIneCode, { timeout: 60000 });
  await page.locator('input').nth(1).fill(testMunicipality, { timeout: 60000 });
  await page.locator('input').nth(2).fill(testProvince, { timeout: 60000 });
  await page.locator('input').nth(3).fill(testCCAA, { timeout: 60000 });
  await page.locator('input').nth(4).fill(testYear, { timeout: 60000 });
  await page.locator('input').nth(5).fill(testDeceased, { timeout: 60000 });
  await page.locator('input').nth(6).fill(testInjuredHospitalized, { timeout: 60000 });
  await page.locator('input').nth(7).fill(testInjuredNotHospitalized, { timeout: 60000 });

  // Crear el nuevo registro de accidente
  await page.getByRole('button', { name: 'Crear registro' }).click({ timeout: 60000 });

  // Esperar a que la tabla se actualice
  const table = page.locator('table');
  await table.waitFor({ state: 'visible', timeout: 60000 });

  // Verificar que el registro ha sido creado y está en la tabla
  const fullRowText = `${testIneCode} ${testMunicipality} ${testProvince} ${testCCAA} ${testYear} ${testDeceased} ${testInjuredHospitalized} ${testInjuredNotHospitalized}`;
  const accidentRow = page.getByRole('row', { name: fullRowText });

  // Asegurarse de que la fila con el texto completo está presente
  await expect(accidentRow).toBeVisible({ timeout: 60000 });
  await expect(accidentRow).toContainText(testMunicipality, { timeout: 60000 });
  await expect(accidentRow).toContainText(testProvince, { timeout: 60000 });
  await expect(accidentRow).toContainText(testCCAA, { timeout: 60000 });
  await expect(accidentRow).toContainText(testYear, { timeout: 60000 });
  await expect(accidentRow).toContainText(testDeceased, { timeout: 60000 });
  await expect(accidentRow).toContainText(testInjuredHospitalized, { timeout: 60000 });
  await expect(accidentRow).toContainText(testInjuredNotHospitalized, { timeout: 60000 });

  // Borrar el registro recién creado
  await accidentRow.getByRole('button', { name: 'Borrar' }).click({ timeout: 60000 });

  // Verificar que el registro ha sido eliminado
  await expect(page.getByRole('row', { name: fullRowText })).toHaveCount(0, { timeout: 60000 });
});


test('edit an accident record', async ({ page }) => {
  await page.goto('http://localhost:16078/accident-rate-stats/', { timeout: 60000 });

  // Limpiar y cargar datos de prueba
  await page.getByRole('button', { name: 'Borrar todos los datos' }).click({ timeout: 60000 });
  await page.getByRole('button', { name: 'Cargar datos de prueba' }).click({ timeout: 60000 });

  // Hacer clic en el botón "Editar" del primer registro
  await page.getByRole('button', { name: 'Editar' }).nth(0).click({ timeout: 60000 });

  await expect(page).toHaveTitle(/Editar registro de accidente/, { timeout: 60000 });

  // Seleccionar los inputs por su orden en el DOM
  const inputs = page.locator('input');

  // Cambiar el valor del campo 'deceased' (campo número 6 en el DOM)
  await inputs.nth(5).fill('10', { timeout: 60000 });

  // Hacer clic en el botón "Actualizar"
  await page.getByRole('button', { name: 'Actualizar' }).click({ timeout: 60000 });

  // Verificar que vuelve a la página principal
  await expect(page).toHaveURL(/accident-rate-stats/, { timeout: 60000 });

  // Verificar que el cambio se ha reflejado en la tabla (opcionalmente podrías buscar por texto en la tabla)
  await expect(page.locator('table')).toContainText('10', { timeout: 60000 });
});
