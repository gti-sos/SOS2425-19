// @ts-check
import { test, expect } from '@playwright/test';

//Pruebas
test('has title', async ({ page }) => {
  await page.goto('localhost:16078/ownerships-changes-stats');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Exchanges Data/);
});

test('create and delete', async ({ page }) => {
  const testExchangeAC="Andalucia";
  const testExchangeProvince="Cordoba";
  const testExchangeTruck="1";
  const testExchangeVan="2";
  const testExchangeBus="3";
  const testExchangeCar="4";
  const testExchangeMoto="5";
  const testExchangeOther="6";
  const testExchangeYear="2024";

  await page.goto('localhost:16078/ownerships-changes-stats');
  await page.getByRole("button", {name : "Borrar Todo"}).click();

  await page.getByRole('textbox').nth(9).fill(testExchangeAC);
  await page.getByRole('textbox').nth(10).fill(testExchangeProvince);
  await page.getByRole('textbox').nth(11).fill(testExchangeTruck);
  await page.getByRole('textbox').nth(12).fill(testExchangeVan);
  await page.getByRole('textbox').nth(13).fill(testExchangeBus);
  await page.getByRole('textbox').nth(14).fill(testExchangeCar);
  await page.getByRole('textbox').nth(15).fill(testExchangeMoto);
  await page.getByRole('textbox').nth(16).fill(testExchangeOther);
  await page.getByRole('textbox').nth(17).fill(testExchangeYear);

  await page.getByRole("button", {name:"Crear Registro"}).click();

  const row= `${testExchangeAC} ${testExchangeProvince} ${testExchangeTruck} ${testExchangeVan} ${testExchangeBus} ${testExchangeCar} ${testExchangeMoto} ${testExchangeOther} ${testExchangeYear}`;
  const playRow= page.getByRole("row", {name :row});
  
  await expect(playRow).toContainText(testExchangeAC);
  await expect(playRow).toContainText(testExchangeProvince);
  await expect(playRow).toContainText(testExchangeTruck);
  await expect(playRow).toContainText(testExchangeVan);
  await expect(playRow).toContainText(testExchangeBus);
  await expect(playRow).toContainText(testExchangeCar);
  await expect(playRow).toContainText(testExchangeMoto);
  await expect(playRow).toContainText(testExchangeOther);
  await expect(playRow).toContainText(testExchangeYear);

  await playRow.getByRole("button", {name:"Delete"}).click();
  await expect(page.getByRole("row", {name :row})).toHaveCount(0);

});
/*test ("borrar, cargar,editar",async ({page})=>{

  await page.goto('http://localhost:16078/ownerships-changes-stats/');
  
  //borrar y cargar
  await page.getByRole("button", {name:"Borrar todo"}).click();
  await page.getByRole("button", {name:"Cargar datos de prueba"}).click();

  //editar
  await page.getByRole("button", {name: "Editar"}).nth(0).click();

  const inputs = page.locator("input");
  await inputs.nth(6).fill("99999");
  await page.getByRole("button", {name: "Actualizar"}).click();
  await expect(page).toHaveURL(/ownerships-changes-stats/);
  await expect(page.locator("table")).toContainText("99999")

}); */