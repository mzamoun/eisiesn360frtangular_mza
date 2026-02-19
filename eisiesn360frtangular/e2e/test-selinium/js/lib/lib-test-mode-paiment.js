import { By } from 'selenium-webdriver';

import * as utils from './_utils.js';

const LIST_NAME = "PayementsModes"

export function log() {

}

var last_name_url_app = "payementmode_app"
var btnSaveId = "btn-payementmode-save";


export async function addModePaiment(driver, num) {
    let name = "test-mp-" + num

    let fct = "addModePaiment " + name

    let date_deb = utils.log_start(fct)

    await driver.manage().window().fullscreen();
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await driver.sleep(1000);

    await utils.getUrl(driver, last_name_url_app)
    await driver.sleep(1000);

    await utils.clickElement(driver, "addModePaiment");
    await driver.sleep(1000);

    await driver.findElement(By.id('name')).sendKeys(name);
    await driver.sleep(1000);

    let btnSave = await utils.clickElement(driver, btnSaveId);
    await driver.sleep(1000);

    let ok = await utils.checkIfExistInList(driver, last_name_url_app, LIST_NAME, name);
    if (!ok) name = null

    utils.log_end(fct, date_deb)

    return name;

}


export async function updateModePaiment(driver, modePaimentName) {

    let fct = "updateModePaiment " + modePaimentName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, last_name_url_app, LIST_NAME, modePaimentName);
    if (!ok) return ok

    let btnNameUpdate = "btn-payementmode-edit-0"

    await utils.clickElement(driver, btnNameUpdate);
    await driver.sleep(2200)

    let id_modif = "name"

    let val_new = id_modif + "_" + modePaimentName + "_updated"

    await utils.setInput(driver, id_modif, val_new);
    await driver.sleep(1000)

    await utils.clickElement(driver, btnSaveId);
    await driver.sleep(1000)

    //----------------------

    ok = await utils.checkIfExistInList(driver, last_name_url_app, LIST_NAME, modePaimentName);
    if (!ok) return ok
    await driver.sleep(1000)

    await utils.clickElement(driver, btnNameUpdate);
    await driver.sleep(2200)
    let txt = await utils.getTextById(driver, id_modif, "input");
    await driver.sleep(1000)
    ok = utils.checkText(id_modif, txt, val_new);

    utils.log_end(fct, date_deb)

    return ok;
}

export async function deleteModePaiment(driver, modePaimentName) {

    let fct = "deleteModePaiment " + modePaimentName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, last_name_url_app, LIST_NAME, modePaimentName);
    if (!ok) return ok

    await driver.sleep(1000);

    await utils.clickElement(driver, 'btn-payementmode-delete-0');
    await driver.sleep(1000);
    await utils.clickElement(driver, 'btn-modal-ok');
    await driver.sleep(1000);

    ok = await utils.checkIfNotExistInList(driver, last_name_url_app, LIST_NAME, modePaimentName);
    if (!ok) return ok

    await driver.sleep(1000);

    utils.log_end(fct, date_deb)

    return true
}
