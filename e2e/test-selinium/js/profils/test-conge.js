/**
 * Test Selenium - Création de congé
 * Scénario simple pour tester la nouvelle fonction createConge
 *
 * Usage : node --experimental-vm-modules test-conge.js
 */

import { Builder } from 'selenium-webdriver';

import * as cte from "../lib/_ctes.js";
import * as utils from "../lib/_utils.js";
import * as login from "../lib/lib-test-login.js";
import * as cra from "../lib/lib-test-cra.js";

// ─── Credentials ──────────────────────────────────────────────────────────────
var username = 'manager.demo1';  // ou consultant.demo1@ens-demo1.com
var password = cte.password;
var driver   = null;
var isLogued = false;

// ─── Login ────────────────────────────────────────────────────────────────────
async function my_login() {
    console.log("=== TEST CONGÉ : connexion ===");
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

// ─── Scénario : Créer un congé ───────────────────────────────────────────────
console.log("--- Scénario : Créer un congé ---");
let congéSuccess = false;
try {
    congéSuccess = await cra.createConge(driver, num);
    console.log("✓ Résultat création congé:", congéSuccess);
} catch (e) {
    console.warn("⚠ Erreur création congé:", e.message);
}

// ─── Fin ──────────────────────────────────────────────────────────────────────
await driver.sleep(1000);
await login.quit(driver);

if (congéSuccess) {
    console.log("**** TEST CONGÉ OK ****");
    process.exit(0);
} else {
    console.log("**** TEST CONGÉ FAILED ****");
    process.exit(1);
}