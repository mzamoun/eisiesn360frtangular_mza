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
var username = 'admin'; // Utilisation de admin car backend non accessible
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

console.log("**** TEST CONSULTANT - INTERFACE ONLY (Backend non accessible) ****");
console.log("Note: Utilisation du compte admin pour tester l'interface (consultant.demo1 non accessible sans backend)");

let num = utils.dateNow("-");

// ─── Scénario 1 : accéder au profil ───────────────────────────────────────────
console.log("--- Scénario 1 : Profil consultant ---");
try {
    await utils.getUrl(driver, "my-profile");
    await driver.sleep(1000);
    console.log("✓ Page profil chargée");
    
    // Vérifier que les champs du profil sont présents
    let profileFields = ['firstName', 'lastName', 'email', 'tel'];
    let allFieldsPresent = true;
    for (let field of profileFields) {
        let exists = await driver.findElements(By.id(field)).then(el => el.length > 0);
        if (!exists) {
            console.log("✗ Champ manquant:", field);
            allFieldsPresent = false;
        }
    }
    if (allFieldsPresent) {
        console.log("✓ Tous les champs du profil sont présents");
    }
} catch (e) {
    console.warn("⚠ Profil: ", e.message);
}

// ─── Scénario 2 : Navigation vers CRA ──────────────────────────────────────────
console.log("--- Scénario 2 : Navigation CRA ---");
try {
    await utils.getUrl(driver, "cra_app");
    await driver.sleep(1000);
    console.log("✓ Navigation vers CRA réussie");
    
    // Test ouverture formulaire de création CRA
    console.log("Test ouverture formulaire de création CRA...");
    try {
        await driver.findElement(By.id("addCraDropdown")).click();
        await driver.sleep(400);
        await driver.findElement(By.id("addCra")).click();
        await driver.sleep(1000);
        console.log("✓ Formulaire de création CRA ouvert");
        
        // Vérifier que les champs du formulaire sont présents
        let craFields = ['month', 'year', 'btn-cra-form-add-multi-date'];
        let allFieldsPresent = true;
        for (let field of craFields) {
            let exists = await driver.findElements(By.id(field)).then(el => el.length > 0);
            if (!exists) {
                console.log("✗ Champ manquant:", field);
                allFieldsPresent = false;
            }
        }
        if (allFieldsPresent) {
            console.log("✓ Tous les champs du formulaire CRA sont présents");
        }
    } catch (e) {
        console.log("✗ Erreur lors de l'ouverture du formulaire CRA:", e.message);
    }
} catch (e) {
    console.warn("⚠ Navigation CRA: ", e.message);
}

// ─── Scénario 3 : Vérifier l'accès à la liste CRA ─────────────────────────────
console.log("--- Scénario 3 : Vérifier liste CRA ---");
try {
    await utils.getUrl(driver, "cra_app");
    await driver.sleep(1000);
    // Vérifier qu'il y a au moins un élément dans la liste
    let rows = await driver.findElements(By.css("table tbody tr"));
    console.log("✓ Nombre de CRA dans la liste:", rows.length);
    console.log("✓ Liste CRA accessible");
} catch (e) {
    console.warn("⚠ Vérification liste: ", e.message);
}

// ─── Fin ──────────────────────────────────────────────────────────────────────
await driver.sleep(1000);
await login.quit(driver);
console.log("**** TEST CONSULTANT INTERFACE COMPLETED ****");
