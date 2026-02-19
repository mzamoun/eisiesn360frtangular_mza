import { By } from 'selenium-webdriver';

import * as utils from './_utils.js';

export function log() {
    
}

export async function addEsn(driver, num) {
    let esnName = "test-esn-" + num

    await driver.manage().window().fullscreen();
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await driver.sleep(1000);

    await driver.findElement(By.id('myNavbar')).click();
    await driver.findElement(By.id('esnAppLink')).click();
    await driver.sleep(1000);
    await driver.findElement(By.id('addEsn')).click();
    await driver.sleep(1000);

    await driver.findElement(By.id('name')).sendKeys(esnName);
    await driver.findElement(By.id('metier')).sendKeys("SSII");
    await driver.findElement(By.id('street')).sendKeys("6 Rue des deux communes");
    await driver.findElement(By.id('zipCode')).sendKeys("91480");
    await driver.findElement(By.id('city')).sendKeys("Quincy sous sénart");
    await driver.findElement(By.id('country')).sendKeys("France");
    await driver.findElement(By.id('tel')).sendKeys("0606060606");
    await driver.findElement(By.id('siteWeb')).sendKeys("www.eisi-consulting.fr");
    await driver.findElement(By.id('email')).sendKeys("contact@eisi-consulting.fr");

    let btnSaveId = "btn-esn-form-save";
    let btnSave = await utils.clickElement(driver, btnSaveId);
    await driver.sleep(1000);

    let ok = await utils.checkIfExistInList(driver, "esn_app", "Esn", esnName);
    if(!ok) esnName = ""

    return esnName;
}

export async function updateEsn(driver, esnName) {

    let fct = "updateEsn " + esnName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "esn_app", "Esn", esnName);
    if(!ok) return ok

    await utils.clickElement(driver, 'btn-esn-list-update0');

    let id_modif = "metier"

    let metier_new = "my_esn_metier_updated"

    await utils.setInput(driver, id_modif, metier_new);

    await utils.clickElement(driver, 'btn-esn-form-save');

    //----------------------

    ok = await utils.checkIfExistInList(driver, "esn_app", "Esn", esnName);
    if(!ok) return ok

    await utils.clickElement(driver, 'btn-esn-list-update0');
    let txt = await utils.getTextById(driver, id_modif, "input");
    ok = utils.checkText(id_modif, txt, metier_new)

    utils.log_end(fct, date_deb)

    return ok;
}

export async function deleteEsn(driver, esnName) {

    let fct = "deleteEsn " + esnName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "esn_app", "Esn", esnName);
    if(!ok) return ok

    await driver.sleep(1000);

    await utils.clickElement(driver, 'btn-esn-list-delete0');
    await driver.sleep(1000);
    await utils.clickElement(driver, 'btn-modal-ok');
    await driver.sleep(1000);

    ok = await utils.checkIfNotExistInList(driver, "esn_app", "Esn", esnName);
    if(!ok) return ok

    await driver.sleep(1000);

    utils.log_end(fct, date_deb)

    return true 
}


export async function addResponsableEsn(driver, esnName) {

    let fct = "addResponsableEsn " + esnName
    let date_deb = utils.log_start(fct)

    await utils.getUrl(driver, "consultant_app");
    await driver.sleep(2000);

    await utils.clickElement(driver, 'btn-add-consultant-form');
    await driver.sleep(2000);

    await utils.selectInListOptions(driver, "role", "RESPONSIBLE_ESN");
    await driver.sleep(2000);

    await utils.selectInListOptions(driver, "responsableEsn", esnName);
    await driver.sleep(2000);

    await driver.findElement(By.id('firstName')).sendKeys("test-FN-" + esnName);
    await driver.findElement(By.id('lastName')).sendKeys("test-LM-" + esnName);
    await driver.findElement(By.id('tel')).sendKeys("0749244625");
    await driver.findElement(By.id('email')).sendKeys("resp@"+esnName+".com");
    await driver.findElement(By.id('level')).sendKeys("1");
    await driver.findElement(By.id('date-naissance')).sendKeys("25/03/1991");
    await driver.sleep(2000);
    await driver.findElement(By.id('adresse_street')).sendKeys("85 Rue jean maurice");
    await driver.findElement(By.id('adresse_city')).sendKeys("Enghien les bains");
    await driver.findElement(By.id('adresse_zipCode')).sendKeys("95130");
    await driver.findElement(By.id('adresse_country')).sendKeys("France");
    await driver.findElement(By.id('password1')).sendKeys("aa");
    await driver.findElement(By.id('password2')).sendKeys("aa");

    await driver.sleep(2000);

    await utils.clickElement(driver, 'btn-consultant-save');
    await driver.sleep(1000);

    let ok = await utils.checkIfExistInList(driver, "consultant_app", "Consultant", esnName);
    if(!ok) return ok

    await driver.sleep(2000);

    utils.log_end(fct, date_deb)
}

export async function deleteConsultantOfEsnTest(driver, esnName) {

    let fct = "deleteConsultantOfEsnTest " + esnName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "consultant_app", "Consultant", esnName);
    if(!ok) return ok

    await driver.sleep(1000);

    await utils.clickElement(driver, 'btn-delete-consultant-list-0');
    await driver.sleep(1000);
    await utils.clickElement(driver, 'btn-modal-ok');
    await driver.sleep(1000);

    ok = await utils.checkIfNotExistInList(driver, "consultant_app", "Consultant", esnName);
    if(!ok) return ok

    await driver.sleep(1000);

    utils.log_end(fct, date_deb)

    return true 
}
