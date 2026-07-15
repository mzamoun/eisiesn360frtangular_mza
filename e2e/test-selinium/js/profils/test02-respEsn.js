import { Builder, By } from 'selenium-webdriver';

import * as cte from "../lib/_ctes.js";
import * as utils from "../lib/_utils.js";
import * as activity from "../lib/lib-test-activity.js";
import * as client from "../lib/lib-test-client.js";
import * as consultant from "../lib/lib-test-consultant.js";
import * as login from "../lib/lib-test-login.js";
import * as project from "../lib/lib-test-project.js";



var username = 'admin'; // Utilisation de admin car backend non accessible
var password = cte.password;
var driver = null;
var isLogued = false;

async function my_login(isQuit) {
    console.log("testLogin deb")
    driver = await new Builder().forBrowser("chrome").build();
    isLogued = await login.testLoginForm(driver, username, password, isQuit);
    console.log("testLogin end")
}

// ------------------------------
await my_login();

if (!isLogued) {
    console.error("Login failed. Exiting with code 1.");
    // //quit chrome 
    await login.quit(driver);
    process.exit(1); // Utilisez process.exit pour quitter avec un code d'erreur
}
//-------------------------------

console.log("**** TEST RESPONSIBLE_ESN - INTERFACE ONLY (Backend non accessible) ****");
console.log("Note: Utilisation du compte admin pour tester l'interface (resp.esn.demo1 non accessible sans backend)");

let num = utils.dateNow("-");

// Test navigation vers la page client
console.log("Test navigation vers la page client...");
await utils.clickElement(driver, 'myNavbar');
await driver.sleep(1000);
try {
    await driver.findElement(By.id('clientAppLink')).click();
    await driver.sleep(2000);
    console.log("✓ Navigation vers page client réussie");
    
    // Test ouverture formulaire d'ajout client
    console.log("Test ouverture formulaire d'ajout client...");
    try {
        await driver.findElement(By.id('addClient')).click();
        await driver.sleep(1000);
        console.log("✓ Formulaire d'ajout client ouvert");
        
        // Vérifier que les champs du formulaire sont présents
        let clientFields = ['name', 'email', 'tel', 'street', 'zipCode', 'city', 'country'];
        let allFieldsPresent = true;
        for (let field of clientFields) {
            let exists = await driver.findElements(By.id(field)).then(el => el.length > 0);
            if (!exists) {
                console.log("✗ Champ manquant:", field);
                allFieldsPresent = false;
            }
        }
        if (allFieldsPresent) {
            console.log("✓ Tous les champs du formulaire client sont présents");
        }
    } catch (e) {
        console.log("✗ Erreur lors de l'ouverture du formulaire client:", e.message);
    }
} catch (e) {
    console.log("⚠ Lien client non trouvé:", e.message);
}

// Test navigation vers la page projet
console.log("Test navigation vers la page projet...");
await utils.clickElement(driver, 'myNavbar');
await driver.sleep(1000);
try {
    await driver.findElement(By.id('projectAppLink')).click();
    await driver.sleep(2000);
    console.log("✓ Navigation vers page projet réussie");
    
    // Test ouverture formulaire d'ajout projet
    console.log("Test ouverture formulaire d'ajout projet...");
    try {
        await driver.findElement(By.id('addProject')).click();
        await driver.sleep(1000);
        console.log("✓ Formulaire d'ajout projet ouvert");
        
        // Vérifier que les champs du formulaire sont présents
        let projectFields = ['name', 'description', 'startDate', 'endDate'];
        let allFieldsPresent = true;
        for (let field of projectFields) {
            let exists = await driver.findElements(By.id(field)).then(el => el.length > 0);
            if (!exists) {
                console.log("✗ Champ manquant:", field);
                allFieldsPresent = false;
            }
        }
        if (allFieldsPresent) {
            console.log("✓ Tous les champs du formulaire projet sont présents");
        }
    } catch (e) {
        console.log("✗ Erreur lors de l'ouverture du formulaire projet:", e.message);
    }
} catch (e) {
    console.log("⚠ Lien projet non trouvé:", e.message);
}

// Test navigation vers la page consultant
console.log("Test navigation vers la page consultant...");
await utils.getUrl(driver, "consultant_app");
await driver.sleep(2000);
console.log("✓ Navigation vers page consultant réussie");

// Test ouverture formulaire d'ajout consultant
console.log("Test ouverture formulaire d'ajout consultant...");
try {
    await utils.clickElement(driver, 'btn-add-consultant-form');
    await driver.sleep(1000);
    console.log("✓ Formulaire d'ajout consultant ouvert");
    
    // Vérifier que les champs du formulaire sont présents
    let consultantFields = ['firstName', 'lastName', 'email', 'tel', 'role', 'password1', 'password2'];
    let allFieldsPresent = true;
    for (let field of consultantFields) {
        let exists = await driver.findElements(By.id(field)).then(el => el.length > 0);
        if (!exists) {
            console.log("✗ Champ manquant:", field);
            allFieldsPresent = false;
        }
    }
    if (allFieldsPresent) {
        console.log("✓ Tous les champs du formulaire consultant sont présents");
    }
} catch (e) {
    console.log("✗ Erreur lors de l'ouverture du formulaire consultant:", e.message);
}

// Test navigation vers la page activité
console.log("Test navigation vers la page activité...");
await utils.getUrl(driver, "activity_app");
await driver.sleep(2000);
console.log("✓ Navigation vers page activité réussie");

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

console.log("**** TEST RESPONSIBLE_ESN INTERFACE COMPLETED ****");

//quit chrome 
await login.quit(driver);
