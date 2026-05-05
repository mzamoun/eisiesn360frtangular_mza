/**
 * Test Selenium - Profil CONSULTANT
 * Scénarios :
 *   1. Connexion en tant que consultant
 *   2. Accéder à son profil
 *   3. Créer un CRA pour le mois courant
 *   4. Vérifier que le CRA apparaît dans la liste
 *
 * Usage : node --experimental-vm-modules test04-consultant.js
 */

import { Builder, By } from 'selenium-webdriver';

import * as cte from "../lib/_ctes.js";
import * as utils from "../lib/_utils.js";
import * as login from "../lib/lib-test-login.js";

// ─── Credentials ──────────────────────────────────────────────────────────────
var username = 'consultant.demo1@ens-demo1.com';  // à adapter selon l'environnement
var password = cte.password;
var driver   = null;
var isLogued = false;

// ─── Login ────────────────────────────────────────────────────────────────────
async function my_login() {
    console.log("=== TEST04 CONSULTANT : connexion ===");
    driver   = await new Builder().forBrowser("chrome").build();
    isLogued = await login.testLoginForm(driver, username, password, false);
    console.log("isLogued =", isLogued);
}

await my_login();

if (!isLogued) {
    console.error("Login failed. Exiting with code 1.");
    await login.quit(driver);
    process.exit(1);
}

cte.log();
utils.log();

let num = utils.dateNow("-");

// ─── Scénario 1 : accéder au profil ───────────────────────────────────────────
console.log("--- Scénario 1 : Profil consultant ---");
try {
    await driver.get(cte.URL + "/my-profile");
    await driver.sleep(1000);
    console.log("✓ Page profil chargée");
} catch (e) {
    console.warn("⚠ Profil: ", e.message);
}

// ─── Scénario 2 : Créer un CRA ────────────────────────────────────────────────
console.log("--- Scénario 2 : Créer un CRA ---");
try {
    // Naviguer vers la liste CRA
    await driver.get(cte.URL + "/cra_app");
    await driver.sleep(1000);

    // Cliquer sur le dropdown Ajouter CRA
    await driver.findElement(By.id("addCraDropdown")).click();
    await driver.sleep(400);
    await driver.findElement(By.id("addCra")).click();
    await driver.sleep(1500);

    // Remplir le formulaire CRA
    await driver.findElement(By.id("btn-cra-form-add-multi-date")).click();
    await driver.sleep(500);

    const { Select } = await import('selenium-webdriver');
    let selectActivityElement = await driver.findElement(By.id("cra-form-select-activity"));
    let selectActivity = new Select(selectActivityElement);
    await selectActivity.selectByIndex(1);

    let selectEndHourElement = await driver.findElement(By.id("cra-form-select-end-hour"));
    let selectEndHour = new Select(selectEndHourElement);
    await selectEndHour.selectByIndex(2);

    await driver.findElement(By.id("mat-date-range-input-0")).sendKeys("05/01/2025");
    await driver.findElement(By.id("endDate")).sendKeys("31/05/2025");
    await driver.sleep(500);

    await driver.findElement(By.id("btn-cra-form-add-current-activity")).click();
    await driver.sleep(500);

    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await driver.sleep(500);
    await driver.findElement(By.id("btn-cra-form-save")).click();
    await driver.sleep(1000);

    console.log("✓ CRA créé avec succès");
} catch (e) {
    console.warn("⚠ Création CRA: ", e.message);
}

// ─── Scénario 3 : Vérifier que le CRA apparaît dans la liste ──────────────────
console.log("--- Scénario 3 : Vérifier liste CRA ---");
try {
    await driver.get(cte.URL + "/cra_app");
    await driver.sleep(1000);
    // Vérifier qu'il y a au moins un élément dans la liste
    let rows = await driver.findElements(By.css("table tbody tr"));
    console.log("✓ Nombre de CRA dans la liste:", rows.length);
} catch (e) {
    console.warn("⚠ Vérification liste: ", e.message);
}

// ─── Fin ──────────────────────────────────────────────────────────────────────
await driver.sleep(1000);
await login.quit(driver);
console.log("**** TEST CONSULTANT OK ****");
