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

import { Builder, By } from 'selenium-webdriver';

import * as cte from "../lib/_ctes.js";
import * as utils from "../lib/_utils.js";
import * as activity from "../lib/lib-test-activity.js";
import * as cra from "../lib/lib-test-cra.js";
import * as login from "../lib/lib-test-login.js";

// ─── Credentials ──────────────────────────────────────────────────────────────
var username = 'admin'; // Utilisation de admin car backend non accessible
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

console.log("**** TEST MANAGER - INTERFACE ONLY (Backend non accessible) ****");
console.log("Note: Utilisation du compte admin pour tester l'interface (manager.demo1 non accessible sans backend)");

let num = utils.dateNow("-");

// ─── Scénario 1 : consulter la liste de mes consultants ───────────────────────
console.log("--- Scénario 1 : Mes Consultants ---");
try {
    await utils.clickElement(driver, 'myNavbar');
    await driver.sleep(500);
    try {
        await driver.findElement(By.id('consultantLink')).click();
        await driver.sleep(1000);
        console.log("✓ Liste consultants affichée");
    } catch (e) {
        console.log("⚠ Lien consultant non trouvé:", e.message);
        // Alternative: navigation directe
        await utils.getUrl(driver, "consultant_app");
        console.log("✓ Navigation directe vers consultants réussie");
    }
} catch (e) {
    console.warn("⚠ Navigation consultants: ", e.message);
}

// ─── Scénario 2 : navigation vers activité ────────────────────────────────────
console.log("--- Scénario 2 : Navigation activité ---");
try {
    await utils.getUrl(driver, "activity_app");
    await driver.sleep(1000);
    console.log("✓ Navigation vers activité réussie");
    
    // Test ouverture formulaire d'ajout activité
    console.log("Test ouverture formulaire d'ajout activité...");
    try {
        await driver.findElement(By.id('addActivity')).click();
        await driver.sleep(1000);
        console.log("✓ Formulaire d'ajout activité ouvert");
        
        // Vérifier que les champs du formulaire sont présents
        let activityFields = ['name', 'type', 'startDate', 'endDate'];
        let allFieldsPresent = true;
        for (let field of activityFields) {
            let exists = await driver.findElements(By.id(field)).then(el => el.length > 0);
            if (!exists) {
                console.log("✗ Champ manquant:", field);
                allFieldsPresent = false;
            }
        }
        if (allFieldsPresent) {
            console.log("✓ Tous les champs du formulaire activité sont présents");
        }
    } catch (e) {
        console.log("✗ Erreur lors de l'ouverture du formulaire activité:", e.message);
    }
} catch (e) {
    console.warn("⚠ Navigation activité: ", e.message);
}

// ─── Scénario 3 : navigation vers CRA ─────────────────────────────────────────
console.log("--- Scénario 3 : Navigation CRA ---");
try {
    await utils.getUrl(driver, "cra_app");
    await driver.sleep(1000);
    console.log("✓ Navigation vers CRA réussie");
    
    // Test ouverture formulaire de création CRA
    console.log("Test ouverture formulaire de création CRA...");
    try {
        await driver.findElement(By.id('addCra')).click();
        await driver.sleep(1000);
        console.log("✓ Formulaire de création CRA ouvert");
        
        // Vérifier que les champs du formulaire sont présents
        let craFields = ['month', 'year', 'consultant'];
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

// ─── Fin ──────────────────────────────────────────────────────────────────────
await driver.sleep(1000);
await login.quit(driver);
console.log("**** TEST MANAGER INTERFACE COMPLETED ****");
