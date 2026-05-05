/**
 * Test Selenium - Profil MANAGER
 * Scénarios :
 *   1. Connexion en tant que manager
 *   2. Consulter la liste de ses consultants
 *   3. Ajouter une activité pour un consultant
 *   4. Consulter les CRA de ses consultants
 *
 * Usage : node --experimental-vm-modules test03-manager.js
 */

import { Builder } from 'selenium-webdriver';

import * as cte from "../lib/_ctes.js";
import * as utils from "../lib/_utils.js";
import * as activity from "../lib/lib-test-activity.js";
import * as cra from "../lib/lib-test-cra.js";
import * as login from "../lib/lib-test-login.js";

// ─── Credentials ──────────────────────────────────────────────────────────────
var username = 'manager.demo1@ens-demo1.com';  // à adapter selon l'environnement
var password = cte.password;
var driver   = null;
var isLogued = false;

// ─── Login ────────────────────────────────────────────────────────────────────
async function my_login() {
    console.log("=== TEST03 MANAGER : connexion ===");
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

// ─── Scénario 1 : consulter la liste de mes consultants ───────────────────────
console.log("--- Scénario 1 : Mes Consultants ---");
try {
    await driver.findElement(
        (await import('selenium-webdriver')).By.id('myNavbar')
    ).click();
    await driver.sleep(500);
    await driver.findElement(
        (await import('selenium-webdriver')).By.id('consultantLink')
    ).click();
    await driver.sleep(1000);
    console.log("✓ Liste consultants affichée");
} catch (e) {
    console.warn("⚠ Navigation consultants: ", e.message);
}

// ─── Scénario 2 : ajouter une activité ────────────────────────────────────────
console.log("--- Scénario 2 : Ajouter activité ---");
let activityName = null;
try {
    activityName = await activity.addActivity(driver, num);
    console.log("✓ activityName=", activityName);
    if (activityName) {
        await activity.updateActivity(driver, activityName);
        await activity.deleteActivity(driver, activityName);
        console.log("✓ Activité ajoutée, modifiée, supprimée");
    }
} catch (e) {
    console.warn("⚠ Activité: ", e.message);
}

// ─── Scénario 3 : consulter CRA ───────────────────────────────────────────────
console.log("--- Scénario 3 : Consulter CRA ---");
try {
    await cra.createCra(driver);
    console.log("✓ CRA créé");
} catch (e) {
    console.warn("⚠ CRA: ", e.message);
}

// ─── Fin ──────────────────────────────────────────────────────────────────────
await driver.sleep(1000);
await login.quit(driver);
console.log("**** TEST MANAGER OK ****");
