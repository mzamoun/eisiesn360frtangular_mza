import { By } from 'selenium-webdriver';

import * as utils from './_utils.js';

export async function addClient(driver, num) {
    let name = "test-cli-" + num

    let fct = "addClient " + name

    let date_deb = utils.log_start(fct)

    await driver.manage().window().fullscreen();
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await driver.sleep(1000);

    await utils.getUrl(driver, "client_app")
    await driver.sleep(1000);

    await utils.clickElement(driver, "addClient");
    await driver.sleep(1000);

    await driver.findElement(By.id('name')).sendKeys(name);
    await driver.findElement(By.id('email')).sendKeys("contact@" + name + ".com");
    await driver.findElement(By.id('tel')).sendKeys("0749244625");
    await driver.findElement(By.id('metier')).sendKeys("Sport");
    await driver.findElement(By.id('adresse_street')).sendKeys("85 Rue jean maurice");
    await driver.findElement(By.id('adresse_city')).sendKeys("Genvilliers");
    await driver.findElement(By.id('adresse_zipCode')).sendKeys("95130");
    await driver.findElement(By.id('adresse_country')).sendKeys("France");
    await driver.findElement(By.id('siteWeb')).sendKeys(name + ".fr");
    await driver.findElement(By.id('nomResp')).sendKeys("Mister Been");
    await driver.findElement(By.id('telResp')).sendKeys("0649244625");
    await driver.findElement(By.id('emailResp')).sendKeys("contact-resp@" + name + ".com");

    let btnSaveId = "btn-save-client";
    let btnSave = await utils.clickElement(driver, btnSaveId);
    await driver.sleep(1000);

    let ok = await utils.checkIfExistInList(driver, "client_app", "Client", name);
    if (!ok) name = ""

    utils.log_end(fct, date_deb)

    return name;

}


export async function updateClient(driver, clientName) {

    let fct = "updateClient " + clientName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "client_app", "Client", clientName);
    if(!ok) return ok

    let btnNameUpdate = "btn-update-client-0"
    let btnNameSave = "btn-save-client"

    await utils.clickElement(driver, btnNameUpdate);

    let id_modif = "metier"

    let metier_new = "my_client_metier_updated"

    await utils.setInput(driver, id_modif, metier_new);

    await utils.clickElement(driver, btnNameSave);
    await driver.sleep(1000)

    //----------------------

    ok = await utils.checkIfExistInList(driver, "client_app", "Client", clientName);
    if(!ok) return ok

    await utils.clickElement(driver, btnNameUpdate);
    let txt = await utils.getTextById(driver, id_modif, "input");
    ok = utils.checkText(id_modif, txt, metier_new);

    utils.log_end(fct, date_deb)

    return ok;
}

export async function deleteClient(driver, clientName) {

    let fct = "deleteClient " + clientName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "client_app", "Client", clientName);
    if(!ok) return ok

    await driver.sleep(1000);

    await utils.clickElement(driver, 'btn-delete-client-0');
    await driver.sleep(1000);
    await utils.clickElement(driver, 'btn-modal-ok');
    await driver.sleep(1000);

    ok = await utils.checkIfNotExistInList(driver, "client_app", "Client", clientName);
    if(!ok) return ok

    await driver.sleep(1000);

    utils.log_end(fct, date_deb)

    return true 
}
