import { By, until } from 'selenium-webdriver';

import * as utils from './_utils.js';

const LIST_NAME = "d'vacances"

export function log() {
    
}

export async function clickNextPrev(driver) {
    // Click sur "Next"
    console.log("go Click Next ")
    await utils.clickElement(driver, "cra-config-view-date3")

    // Attendre 1 seconde
    await driver.sleep(1000);

    // Click sur "Prev"
    console.log("go Click Prev ")
    await utils.clickElement(driver, "cra-config-view-date1")

    // Attendre 1 seconde
    await driver.sleep(1000);
}

export async function addDelVacance(driver, num) {
    let name = "test-act-" + num

    let fct = "addVacance " + name

    let date_deb = utils.log_start(fct)

    await driver.manage().window().fullscreen();
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await driver.sleep(1000);

    await utils.getUrl(driver, "cra-configuration")
    await driver.sleep(1000);

    // await utils.clickElement(driver, "addVacance");
    // await driver.sleep(1000);

    // TODO : racine : id="cra-config-calendar-month-view"
    //  parcourir les div avec class="cal-cell-top ng-star-inserted" : 
    //  prendre le 1er ayant aria-label ne contenant pas la chaine "One event". Noter son numero X dans la boucle. et clicker dessus
    //  wait 1000 ms
    // cick sur next  : div avec id="cra-config-view-date3"
    // cick sur prev  : div avec id="cra-config-view-date1"
    //  parcourir les div avec class="cal-cell-top ng-star-inserted" : 
    //  check si la div num X a aria-label contenant la chaine "One event". si oui click dessus, sinon Error et exit .

    // click sur next  : div avec id="cra-config-view-date3"
    // cick sur prev  : div avec id="cra-config-view-date1"
    //  parcourir les div avec class="cal-cell-top ng-star-inserted" : 
    //  check si la div num X a aria-label ne contenant pas la chaine "One event". si oui click exit OK, sinon Error et exit .
    ///////////////////////////

    // Attendre que la racine soit présente
    await driver.wait(until.elementLocated(By.id('cra-config-calendar-month-view')), 5000);

    // Étape 1 : Trouver le premier "cal-cell-top" sans "One event"
    let cells = await driver.findElements(By.css('.cal-cell-top.ng-star-inserted'));
    let targetIndex = -1;

    for (let i = 0; i < cells.length; i++) {
      let aria = await cells[i].getAttribute('aria-label');
      if (!aria.includes('One event')) {
        targetIndex = i;
        await cells[i].click();
        console.log('+++ ON AJOUTE un EVENT au targetIndex = ', targetIndex);
        break;
      }
    }

    if (targetIndex === -1) {
      throw new Error('--- Aucune cellule sans "One event" trouvée');
    }

    // Attendre 1 seconde
    await driver.sleep(1000);

    await clickNextPrev(driver)

    // Rechercher la même cellule après navigation
    cells = await driver.findElements(By.css('.cal-cell-top.ng-star-inserted'));

    let aria2 = await cells[targetIndex].getAttribute('aria-label');
    if (aria2.includes('One event')) {
        console.log('✅ Succès : EVENT a bien été AJOUTE');
      await cells[targetIndex].click();
    } else {
      throw new Error('Erreur : La cellule ne contient pas "One event" après navigation');
    }

    await clickNextPrev(driver)

    // Rechercher encore la même cellule
    cells = await driver.findElements(By.css('.cal-cell-top.ng-star-inserted'));

    let aria3 = await cells[targetIndex].getAttribute('aria-label');
    if (!aria3.includes('One event')) {
    //   await cells[targetIndex].click();
      console.log('✅ Succès : EVENT a bien été SUPPRIME');
    } else {
      throw new Error('Erreur : La cellule contient encore "One event"');
    }


    ///////////////////////////

    utils.log_end(fct, date_deb)

    return "OK";

}

