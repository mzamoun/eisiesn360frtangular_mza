import { By, Select } from 'selenium-webdriver';

import * as utils from './_utils.js';

const LIST_NAME = "de CRA";

/**
 * Créer un CRA (Compte Rendu d'Activité)
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} num - Numéro unique pour le test
 * @returns {Promise<boolean>} - true si succès, false sinon
 */
export async function createCra(driver, num) {
    let fct = "createCra";
    let date_deb = utils.log_start(fct);
    let success = false;

    try {
        await driver.manage().window().fullscreen();
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(1000);

        // Naviguer vers la page CRA
        await driver.findElement(By.id('myNavbar')).click();
        await driver.findElement(By.id('craAppLink')).click();
        await driver.sleep(1000);

        // Ouvrir le dropdown Ajouter CRA/Conge
        await driver.findElement(By.id('addCraDropdown')).click();
        await driver.sleep(300);
        
        // Sélectionner CRA dans le menu
        await driver.findElement(By.id('addCra')).click();
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(1000);

        // Ajouter une activité multi-date
        await driver.findElement(By.id('btn-cra-form-add-multi-date')).click();
        await driver.sleep(1000);

        // Sélectionner l'activité
        let selectActivityTypeElement = await driver.findElement(By.id('cra-form-select-activity'));
        let selectActivityType = new Select(selectActivityTypeElement);
        await selectActivityType.selectByIndex(1);
        await driver.sleep(500);

        // Sélectionner l'heure de fin
        let selectProjectElement = await driver.findElement(By.id('cra-form-select-end-hour'));
        let selectproject = new Select(selectProjectElement);
        await selectproject.selectByIndex(2);
        await driver.sleep(500);

        // Sélectionner date début-fin
        await driver.findElement(By.id('mat-date-range-input-0')).sendKeys("05/01/2024");
        await driver.findElement(By.id('endDate')).sendKeys("31/01/2024");
        await driver.sleep(1000);

        // Ajouter l'activité au formulaire
        await driver.findElement(By.id('btn-cra-form-add-current-activity')).click();
        await driver.sleep(1000);

        // Sauvegarder
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(1000);
        await driver.findElement(By.id('btn-cra-form-save')).click();
        await driver.sleep(2000);

        // Vérifier que le CRA apparaît dans la liste
        success = await utils.checkIfExistInList(driver, "cra_app", LIST_NAME, "01/2024");
        
        if (success) {
            console.log("✓ CRA créé avec succès");
        } else {
            console.warn("⚠ CRA créé mais non trouvé dans la liste");
        }

    } catch (error) {
        console.error("✗ Erreur lors de la création du CRA:", error.message);
        success = false;
    } finally {
        utils.log_end(fct, date_deb);
    }

    return success;
}

/**
 * Créer un congé
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} num - Numéro unique pour le test
 * @returns {Promise<boolean>} - true si succès, false sinon
 */
export async function createConge(driver, num) {
    let fct = "createConge";
    let date_deb = utils.log_start(fct);
    let success = false;

    try {
        await driver.manage().window().fullscreen();
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(1000);

        // Naviguer vers la page CRA
        await driver.findElement(By.id('myNavbar')).click();
        await driver.findElement(By.id('craAppLink')).click();
        await driver.sleep(1000);

        // Ouvrir le dropdown Ajouter CRA/Conge
        await driver.findElement(By.id('addCraDropdown')).click();
        await driver.sleep(300);
        
        // Sélectionner Congé dans le menu
        await driver.findElement(By.id('addConge')).click();
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(1000);

        // Ajouter une activité multi-date
        await driver.findElement(By.id('btn-cra-form-add-multi-date')).click();
        await driver.sleep(1000);

        // Sélectionner l'activité (type congé)
        let selectActivityTypeElement = await driver.findElement(By.id('cra-form-select-activity'));
        let selectActivityType = new Select(selectActivityTypeElement);
        await selectActivityType.selectByIndex(1);
        await driver.sleep(500);

        // Sélectionner l'heure de fin
        let selectProjectElement = await driver.findElement(By.id('cra-form-select-end-hour'));
        let selectproject = new Select(selectProjectElement);
        await selectproject.selectByIndex(2);
        await driver.sleep(500);

        // Sélectionner date début-fin
        await driver.findElement(By.id('mat-date-range-input-0')).sendKeys("05/01/2024");
        await driver.findElement(By.id('endDate')).sendKeys("31/01/2024");
        await driver.sleep(1000);

        // Ajouter l'activité au formulaire
        await driver.findElement(By.id('btn-cra-form-add-current-activity')).click();
        await driver.sleep(1000);

        // Sauvegarder
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(1000);
        await driver.findElement(By.id('btn-cra-form-save')).click();
        await driver.sleep(2000);

        // Vérifier que le congé apparaît dans la liste
        success = await utils.checkIfExistInList(driver, "cra_app", LIST_NAME, "01/2024");
        
        if (success) {
            console.log("✓ Congé créé avec succès");
        } else {
            console.warn("⚠ Congé créé mais non trouvé dans la liste");
        }

    } catch (error) {
        console.error("✗ Erreur lors de la création du congé:", error.message);
        success = false;
    } finally {
        utils.log_end(fct, date_deb);
    }

    return success;
}

/**
 * Valider un CRA
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} craIdentifier - Identifiant du CRA à valider
 * @returns {Promise<boolean>} - true si succès, false sinon
 */
export async function validateCra(driver, craIdentifier) {
    let fct = "validateCra " + craIdentifier;
    let date_deb = utils.log_start(fct);
    let success = false;

    try {
        // Naviguer vers la page CRA
        await driver.findElement(By.id('myNavbar')).click();
        await driver.findElement(By.id('craAppLink')).click();
        await driver.sleep(1000);

        // Chercher le CRA dans la liste
        let exists = await utils.checkIfExistInList(driver, "cra_app", LIST_NAME, craIdentifier);
        if (!exists) {
            console.warn("⚠ CRA non trouvé dans la liste:", craIdentifier);
            return false;
        }

        // Cliquer sur le bouton de validation
        await utils.clickElement(driver, 'btn-validate-cra-0');
        await driver.sleep(500);

        // Confirmer la validation
        await utils.clickElement(driver, 'btn-modal-ok');
        await driver.sleep(2000);

        // Vérifier que le statut a changé
        console.log("✓ CRA validé avec succès");
        success = true;

    } catch (error) {
        console.error("✗ Erreur lors de la validation du CRA:", error.message);
        success = false;
    } finally {
        utils.log_end(fct, date_deb);
    }

    return success;
}

/**
 * Rejeter un CRA
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} craIdentifier - Identifiant du CRA à rejeter
 * @returns {Promise<boolean>} - true si succès, false sinon
 */
export async function rejectCra(driver, craIdentifier) {
    let fct = "rejectCra " + craIdentifier;
    let date_deb = utils.log_start(fct);
    let success = false;

    try {
        // Naviguer vers la page CRA
        await driver.findElement(By.id('myNavbar')).click();
        await driver.findElement(By.id('craAppLink')).click();
        await driver.sleep(1000);

        // Chercher le CRA dans la liste
        let exists = await utils.checkIfExistInList(driver, "cra_app", LIST_NAME, craIdentifier);
        if (!exists) {
            console.warn("⚠ CRA non trouvé dans la liste:", craIdentifier);
            return false;
        }

        // Cliquer sur le bouton de rejet
        await utils.clickElement(driver, 'btn-reject-cra-0');
        await driver.sleep(500);

        // Confirmer le rejet
        await utils.clickElement(driver, 'btn-modal-ok');
        await driver.sleep(2000);

        // Vérifier que le statut a changé
        console.log("✓ CRA rejeté avec succès");
        success = true;

    } catch (error) {
        console.error("✗ Erreur lors du rejet du CRA:", error.message);
        success = false;
    } finally {
        utils.log_end(fct, date_deb);
    }

    return success;
}

/**
 * Modifier un CRA
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} craIdentifier - Identifiant du CRA à modifier
 * @returns {Promise<boolean>} - true si succès, false sinon
 */
export async function updateCra(driver, craIdentifier) {
    let fct = "updateCra " + craIdentifier;
    let date_deb = utils.log_start(fct);
    let success = false;

    try {
        // Naviguer vers la page CRA
        await driver.findElement(By.id('myNavbar')).click();
        await driver.findElement(By.id('craAppLink')).click();
        await driver.sleep(1000);

        // Chercher le CRA dans la liste
        let exists = await utils.checkIfExistInList(driver, "cra_app", LIST_NAME, craIdentifier);
        if (!exists) {
            console.warn("⚠ CRA non trouvé dans la liste:", craIdentifier);
            return false;
        }

        // Cliquer sur le bouton de modification
        await utils.clickElement(driver, 'btn-update-cra-0');
        await driver.sleep(1000);

        // Modifier une activité (changer l'heure de fin par exemple)
        let selectProjectElement = await driver.findElement(By.id('cra-form-select-end-hour'));
        let selectproject = new Select(selectProjectElement);
        await selectproject.selectByIndex(3); // Choisir une autre heure
        await driver.sleep(500);

        // Sauvegarder
        await driver.findElement(By.id('btn-cra-form-save')).click();
        await driver.sleep(2000);

        console.log("✓ CRA modifié avec succès");
        success = true;

    } catch (error) {
        console.error("✗ Erreur lors de la modification du CRA:", error.message);
        success = false;
    } finally {
        utils.log_end(fct, date_deb);
    }

    return success;
}

/**
 * Supprimer un CRA
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} craIdentifier - Identifiant du CRA à supprimer
 * @returns {Promise<boolean>} - true si succès, false sinon
 */
export async function deleteCra(driver, craIdentifier) {
    let fct = "deleteCra " + craIdentifier;
    let date_deb = utils.log_start(fct);
    let success = false;

    try {
        // Naviguer vers la page CRA
        await driver.findElement(By.id('myNavbar')).click();
        await driver.findElement(By.id('craAppLink')).click();
        await driver.sleep(1000);

        // Chercher le CRA dans la liste
        let exists = await utils.checkIfExistInList(driver, "cra_app", LIST_NAME, craIdentifier);
        if (!exists) {
            console.warn("⚠ CRA non trouvé dans la liste:", craIdentifier);
            return false;
        }

        // Cliquer sur le bouton de suppression
        await utils.clickElement(driver, 'btn-delete-cra-0');
        await driver.sleep(500);

        // Confirmer la suppression
        await utils.clickElement(driver, 'btn-modal-ok');
        await driver.sleep(2000);

        // Vérifier que le CRA n'est plus dans la liste
        let notExists = await utils.checkIfNotExistInList(driver, "cra_app", LIST_NAME, craIdentifier);
        
        if (notExists) {
            console.log("✓ CRA supprimé avec succès");
            success = true;
        } else {
            console.warn("⚠ CRA toujours présent après suppression");
        }

    } catch (error) {
        console.error("✗ Erreur lors de la suppression du CRA:", error.message);
        success = false;
    } finally {
        utils.log_end(fct, date_deb);
    }

    return success;
}