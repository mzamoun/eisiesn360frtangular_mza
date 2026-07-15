/**
 * Test Selenium simple - Vérifier que l'application est accessible
 * Scénario minimal pour tester l'infrastructure Selenium
 *
 * Usage : node --experimental-vm-modules test-simple-login.js
 */

import { Builder, By } from 'selenium-webdriver';

const URL = "http://localhost:4200/#";

async function test_simple() {
    let driver = null;
    let success = false;

    try {
        console.log("=== TEST SIMPLE : Vérifier l'application est accessible ===");
        
        // Créer le driver
        driver = await new Builder().forBrowser("chrome").build();
        console.log("✓ Chrome driver créé");

        // Naviguer vers l'application
        await driver.get(URL);
        await driver.sleep(2000);
        console.log("✓ Page chargée:", await driver.getTitle());

        // Vérifier que le formulaire de login est présent
        let usernameExists = await driver.findElements(By.id('username')).then(el => el.length > 0);
        let passwordExists = await driver.findElements(By.id('password')).then(el => el.length > 0);
        let btnLoginExists = await driver.findElements(By.id('btn-login')).then(el => el.length > 0);

        console.log("✓ username présent:", usernameExists);
        console.log("✓ password présent:", passwordExists);
        console.log("✓ btn-login présent:", btnLoginExists);

        if (usernameExists && passwordExists && btnLoginExists) {
            console.log("✓✓✓ TEST SIMPLE OK - Application accessible et formulaire login présent");
            success = true;
        } else {
            console.log("✗✗✗ TEST SIMPLE FAILED - Formulaire login incomplet");
        }

    } catch (error) {
        console.error("✗ Erreur:", error.message);
        success = false;
    } finally {
        if (driver) {
            await driver.quit();
        }
        process.exit(success ? 0 : 1);
    }
}

test_simple();