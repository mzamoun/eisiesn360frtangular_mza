import readline from 'readline';
import { By, until } from 'selenium-webdriver';

import * as C from './_ctes.js';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

export function log(msg) {
    console.log(dateNow() + " : " + msg);
}

export function log_error(msg) {
    console.log("*** " + dateNow() + " : " + "ERROR : " + msg);
}

export function log_start(msg) {
    console.log("*********************************");
    console.log("*** DEB " + dateNow() + " : " + msg);
    console.log("*********************************");
    return new Date();
}
export function log_end(msg, date_deb) {
    let date_fin = new Date();
    console.log("*********************************");
    console.log("*** FIN " + dateNow() + " : " + msg);
    console.log("*********************************");
    // log("date_deb=/" + date_deb + "/")
    // log("date_fin=/" + date_fin + "/")
    if (date_deb) {

        let ms = date_fin.getTime() - date_deb.getTime()
        let diff = "time diff : " + ms + " ms."
        if (ms >= 1000) {
            let s = ms / 1000
            diff = "time diff : " + s + " s."
        }
        console.log(diff);
    }
    console.log("=================================");
}

export async function getUrl(driver, path) {
    console.log("getUrl : ", path)
    await driver.get(C.URL + "/" + path);
    await driver.manage().window().fullscreen();
    await driver.sleep(1000);
}

export async function setInput(driver, id, txt) {
    console.log("setInput : id, txt : " , id, txt)
    // Localiser le champ input par ID
    await driver.wait(until.elementLocated(By.id(id)), 5000);
    let inputField = await driver.findElement(By.id(id));

    // Effacer le contenu du champ
    await inputField.clear();

    // Écrire dans le champ
    await inputField.sendKeys(txt);
}

export async function searchInList(driver, txt) {
    log("search in list : txt : " + txt)
    await setInput(driver, 'searchStr', txt);
    await driver.sleep(1000);
}

export async function checkIfExistInList(driver, pathUrl, typeObj, name, nb) {
    log("checkIfExistInList DEB name, nb : " + name + ", " + nb)
    if (nb == undefined) nb = 1
    log("nb : " + nb)

    await getUrl(driver, pathUrl);
    await driver.sleep(2000);

    await searchInList(driver, name);
    await driver.sleep(3000);

    let txt = await getTextById(driver, "title_list");
    await driver.sleep(2000);
    let ok = await checkText("title_list", txt, 'Liste ' + typeObj + ' (' + nb + ')')
    log("checkIfExistInList END ok : " + ok)
    // await driver.sleep(2000)
    return ok
}

export async function checkIfNotExistInList(driver, pathUrl, typeObj, name) {
    return checkIfExistInList(driver, pathUrl, typeObj, name, 0);
}


export async function selectInListOptions(driver, id, label) {
    try {
        // Attendre que l'élément <select> soit présent
        let dropdown = await driver.wait(until.elementLocated(By.id(id)), 5000);
        log("dropdown=" + dropdown)

        // Rechercher une option contenant le texte ou une partie du texte
        let option = await dropdown.findElement(By.xpath(`.//option[contains(text(), '${label}')]`));

        // Sélectionner l'option
        await option.click();

        console.log(`Option avec '${label}' sélectionnée.`);
    } catch (error) {
        console.error(`Erreur lors de la sélection de l'option : ${error.message}`);
        throw error; // Relance l'erreur après l'avoir loggée
    }
}



/**
 * Fonction pour attendre que l'utilisateur entre key dans la console.
 * 
 * @returns {Promise<boolean>} - Résultat true si l'utilisateur entre key, sinon false.
 */
function waitForKeyPress(key) {
    return new Promise((resolve) => {
        rl.question("Appuyez sur '" + key + "' pour continuer : ", (answer) => {
            if (answer.toLowerCase() === key) {
                resolve(true);
            } else {
                console.log("Vous n'avez pas appuyé sur '" + key + "', réessayez.");
                resolve(false);
            }
        });
    });
}

export async function waitUntilKey(key) {

    try {
        // Attendre que l'utilisateur entre 'y'
        let keyPressed = false;
        while (!keyPressed) {
            keyPressed = await waitForKeyPress(key);
        }

        // Continuez avec Selenium après que l'utilisateur ait appuyé sur 'y'
        console.log("L'utilisateur a appuyé sur '" + key + "'");

    } catch (error) {
        console.log("Erreur :", error);
    } finally {
        rl.close();
    }
}

/**
 * Formatte une date selon un format donné.
 *
 * @param {Date} date - L'objet Date à formater.
 * @param {string} format - Le format désiré (ex : "dd/MM/yyyy", "yyyy-MM-dd").
 * @returns {string} - La date formatée.
 * 
 * exemple d'appel : formatterDate(new Date(), "yyyy_MM_dd_HH_mm_ss")
 */
export function formatterDate(date, format) {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error("Le paramètre 'date' doit être une instance valide de Date.");
    }

    const map = {
        dd: String(date.getDate()).padStart(2, '0'),
        MM: String(date.getMonth() + 1).padStart(2, '0'), // Mois (de 0 à 11, donc +1)
        yyyy: date.getFullYear(),
        HH: String(date.getHours()).padStart(2, '0'),
        mm: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0')
    };

    return format.replace(/dd|MM|yyyy|HH|mm|ss/g, matched => map[matched]);
}

export function dateNow(s) {
    if (!s) s = "_"
    return formatterDate(new Date(), "yyyy" + s + "MM" + s + "dd" + s + "HH" + s + "mm" + s + "ss");
}

/**
 * Vérifie si les éléments avec des IDs spécifiés existent sur la page.
 * 
 * @param {WebDriver} driver - Instance du WebDriver.
 * @param {string[]} elementNames - Tableau des noms des IDs à vérifier.
 * @returns {Promise<boolean>} - Retourne true si tous les éléments existent, sinon false.
 */
export async function checkElementExists(driver, elementNames = []) {
    try {
        for (const elementName of elementNames) {
            console.log(`Check existence de L'élément avec l'ID "${elementName}" ... `);
            // Trouver les éléments correspondant à l'ID
            let elements = await driver.findElements(By.id(elementName));
            // Si l'un des éléments est manquant, retourner false
            if (elements.length === 0) {
                console.log(`L'élément avec l'ID "${elementName}" n'existe pas.`);
                return false;
            }
            console.log('Exist.');
        }
        console.log('Tous les éléments spécifiés existent.');
        return true; // Tous les éléments existent
    } catch (error) {
        console.error('Erreur lors de la vérification des éléments :', error);
        return false;
    }
}

/**
 * Récupère la valeur textuelle d'un élément <span> par son ID.
 * 
 * @param {WebDriver} driver - Instance du WebDriver.
 * @param {string} elementId - ID de l'élément <span>.
 * @returns {Promise<string|null>} - Texte de l'élément si trouvé, sinon null.
 */
export async function getTextById(driver, elementId, typeText) {
    try {
        // Localiser l'élément par son ID
        let element = await driver.findElement(By.id(elementId));
        let text = ""
        // Obtenir le texte de l'élément
        if (typeText == "input") {
            text = await element.getAttribute('value');
        } else {
            text = await element.getText();
        }
        console.log(`Texte de l'élément "${elementId}" :`, text);
        return text;
    } catch (error) {
        if (error.name === 'NoSuchElementError') {
            console.log(`L'élément avec l'ID "${elementId}" n'existe pas.`);
        } else {
            console.error('Erreur lors de la récupération du texte :', error);
        }
        return null;
    }
}

export async function checkText(id, txt, target) {
    log("checkText id, txt, target : " + id + ", " + ", " + txt + ", " + target)
    if (!txt || !target) {
        log_error("checkText id=" + id + ": txt or target is null or undefined.");
        return false;
    }

    log("checkText: Checking if target is in txt: target='" + target + "', txt='" + txt + "'");
    if (txt.includes(target)) {
        console.log("OK test " + id + ": txt=/" + txt + "/");
        return true;
    } else {
        log_error("checkText id=" + id + ": target '" + target + "' must be in txt. But txt is=/" + txt + "/");
        return false;
    }
}


export async function scrollToElement(driver, elementId) {
    console.log("scrollToElement deb elementId=" + elementId)
    const element = await driver.findElement(By.id(elementId));
    const name = await element.getText();
    console.log("scrollToElement name=" + name)
    await driver.executeScript("arguments[0].scrollIntoView(true);", element);
    console.log("scrollToElement end elementId=" + elementId)
    return element;
}

async function waitForElementToBeClickable(driver, elementLocator) {
    const element = await driver.wait(until.elementLocated(elementLocator), 5000); // Localise l'élément
    await driver.wait(until.elementIsVisible(element), 5000); // Attendre qu'il soit visible
    await driver.wait(until.elementIsEnabled(element), 5000); // Attendre qu'il soit activé
    return element;
}

async function clickWithJavaScript(driver, elementLocator) {
    console.log("---------clickWithJavaScript deb elementLocator : " + elementLocator)
    const element = await driver.findElement(elementLocator);
    await driver.executeScript("arguments[0].click();", element);
    console.log("---------clickWithJavaScript fin elementLocator : " + elementLocator)
}

async function checkBlockingElement(driver, blockingLocator) {
    const elements = await driver.findElements(blockingLocator);
    if (elements.length > 0) {
        console.log("Blocking element found:", elements[0]);
        // Essayez de fermer ou de retirer le blocage
        await elements[0].click(); // Exemple si c'est un bouton de fermeture
    }
}

async function isElementEnabled(driver, elementLocator) {
    const element = await driver.findElement(elementLocator);
    return await element.isEnabled();
}

async function isElementDisplayed(driver, elementLocator) {
    const element = await driver.findElement(elementLocator);
    return await element.isDisplayed();
}


// export async function clickElement(driver, elementId) {
//     console.log("clickElement deb elementId=" + elementId)

//     const buttonLocator = By.id(elementId); // Exemple d'élément cible
//     const overlayLocator = By.className("overlay-class"); // Exemple d'élément bloquant

//     // Vérifiez et supprimez un éventuel élément bloquant
//     await checkBlockingElement(driver, overlayLocator);

//     const isEnabled = await isElementEnabled(driver, By.id(elementId));
//     const isDisplayed = await isElementDisplayed(driver, By.id(elementId));
//     console.log(`Element enabled: ${isEnabled}, displayed: ${isDisplayed}`);

//     // Attendre que le bouton soit cliquable
//     await waitForElementToBeClickable(driver, buttonLocator);

//     // Faites défiler jusqu'à l'élément
//     const button = await scrollToElement(driver, elementId);

//     // Essayez de cliquer normalement
//     try {
//         await button.click();
//     } catch (error) {
//         console.log("Click failed, attempting JavaScript click");
//         await clickWithJavaScript(driver, buttonLocator);
//     }

//     await driver.sleep(1000);

//     console.log("clickElement end elementId=" + elementId)
//     return button;
// }


export async function clickElement(driver, elementId) {
    log("DEB click on elementId="+elementId)
    const buttonLocator = By.id(elementId); // Exemple d'élément cible
    const overlayLocator = By.className("overlay-class"); // Exemple d'élément bloquant
    try {

        //     // Vérifiez et supprimez un éventuel élément bloquant
        // await checkBlockingElement(driver, overlayLocator);

        const isEnabled = await isElementEnabled(driver, By.id(elementId));
        const isDisplayed = await isElementDisplayed(driver, By.id(elementId));
        console.log(`Element enabled: ${isEnabled}, displayed: ${isDisplayed}`);

        // Attendre que l'élément soit localisé et visible
        let element = await driver.wait(
            until.elementLocated(buttonLocator),
            5000, // Timeout après 5 secondes
            `Élément avec l'id "${elementId}" introuvable`
        );

        // Attendre que l'élément soit cliquable
        await driver.wait(
            until.elementIsVisible(element),
            5000,
            `Élément avec l'id "${elementId}" n'est pas visible`
        );

        await scrollToElement(driver, elementId);
        // driver.sleep(1000)

        // Cliquer sur l'élément
        await element.click();
        console.log(`Élément avec l'id "${elementId}" cliqué avec succès.`);
    } catch (error) {
        // console.error(`Erreur lors du clic sur l'élément : ${error.message}`);
        await clickWithJavaScript(driver, buttonLocator);
    }

    log("END click on elementId="+elementId)
}

