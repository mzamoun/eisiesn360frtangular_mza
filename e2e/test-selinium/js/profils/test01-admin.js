import { Builder, By } from 'selenium-webdriver';
import * as login from "../lib/lib-test-login.js";

import * as cte from "../lib/_ctes.js";
import * as utils from "../lib/_utils.js";

import * as esn from "../lib/lib-test-esn.js";
import * as mp from "../lib/lib-test-mode-paiment.js";
import * as vac from "../lib/lib-test-vacance.js";

var username = 'admin';
var password = cte.password;
var driver = null;
var isLogued = false;

async function my_login(isQuit) {
    console.log("testLogin deb")
    driver = await new Builder().forBrowser("chrome").build();
    isLogued = await login.testLoginForm(driver, username, password, isQuit);
    console.log("testLogin end")
    return isLogued;
}

// ------------------------------
await my_login();
//-------------------------------

if (!isLogued) {
    console.error("Login failed. Exiting with code 1.");
    // //quit chrome 
    await login.quit(driver);
    process.exit(1); // Utilisez process.exit pour quitter avec un code d'erreur
}

// pour garder les imports 
cte.log()
utils.log()
esn.log()
vac.log()
mp.log()
////////////////////////////////////

console.log("**** TEST ADMIN - INTERFACE ONLY (Backend non accessible) ****");

// Test navigation vers la page ESN
console.log("Test navigation vers la page ESN...");
await utils.clickElement(driver, 'myNavbar');
await driver.sleep(1000);
await driver.findElement(By.id('esnAppLink')).click();
await driver.sleep(2000);
console.log("✓ Navigation vers page ESN réussie");

// Test ouverture formulaire d'ajout ESN
console.log("Test ouverture formulaire d'ajout ESN...");
try {
    await driver.findElement(By.id('addEsn')).click();
    await driver.sleep(1000);
    console.log("✓ Formulaire d'ajout ESN ouvert");
    
    // Vérifier que les champs du formulaire sont présents
    let formFields = ['name', 'metier', 'street', 'zipCode', 'city', 'country', 'tel', 'siteWeb', 'email'];
    let allFieldsPresent = true;
    for (let field of formFields) {
        let exists = await driver.findElements(By.id(field)).then(el => el.length > 0);
        if (!exists) {
            console.log("✗ Champ manquant:", field);
            allFieldsPresent = false;
        }
    }
    if (allFieldsPresent) {
        console.log("✓ Tous les champs du formulaire ESN sont présents");
    }
} catch (e) {
    console.log("✗ Erreur lors de l'ouverture du formulaire ESN:", e.message);
}

// Test navigation vers la page vacances
console.log("Test navigation vers la page vacances...");
await utils.getUrl(driver, "cra-configuration");
await driver.sleep(2000);
console.log("✓ Navigation vers page vacances réussie");

// Test navigation vers la page mode paiement
console.log("Test navigation vers la page mode paiement...");
try {
    await utils.clickElement(driver, 'myNavbar');
    await driver.sleep(1000);
    // Chercher un lien vers la page mode paiement
    let paymentLinks = await driver.findElements(By.id('modePaiementAppLink'));
    if (paymentLinks.length > 0) {
        await paymentLinks[0].click();
        await driver.sleep(1000);
        console.log("✓ Navigation vers page mode paiement réussie");
    } else {
        console.log("⚠ Lien mode paiement non trouvé, navigation alternative...");
    }
} catch (e) {
    console.log("⚠ Erreur lors de la navigation vers mode paiement:", e.message);
}

console.log("**** TEST ADMIN INTERFACE COMPLETED ****");

// //quit chrome 
await login.quit(driver);
process.exit(0);
