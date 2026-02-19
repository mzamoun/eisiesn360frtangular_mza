import { By } from 'selenium-webdriver';

import * as utils from './_utils.js';

const LIST_NAME = "d'activites"

export async function addActivity(driver, num) {
    let name = "test-act-" + num

    let fct = "addActivity " + name

    let date_deb = utils.log_start(fct)

    await driver.manage().window().fullscreen();
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await driver.sleep(1000);

    await utils.getUrl(driver, "activity_app")
    await driver.sleep(1000);

    await utils.clickElement(driver, "addActivity");
    await driver.sleep(1000);

    await utils.selectInListOptions(driver,"activity-type", "MISSION");
    await driver.sleep(1000);
    await utils.selectInListOptions(driver,"project", "Project DEMO1");
    await driver.sleep(1000);

    await driver.findElement(By.id('pickerDeb')).sendKeys("01/01/2025");
    await driver.findElement(By.id('pickerFin')).sendKeys("30/01/2025");
    await driver.findElement(By.id('name')).sendKeys(name);
    await driver.findElement(By.id('description')).sendKeys("my_description");

    let btnSaveId = "btn-save-activity";
    let btnSave = await utils.clickElement(driver, btnSaveId);
    await driver.sleep(1000);

    let ok = await utils.checkIfExistInList(driver, "activity_app", LIST_NAME, name);
    if (!ok) name = null 

    utils.log_end(fct, date_deb)

    return name;

}


export async function updateActivity(driver, activityName) {

    let fct = "updateActivity " + activityName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "activity_app", LIST_NAME, activityName);
    if(!ok) return ok

    let btnNameUpdate = "btn-update-activity-0"
    let btnNameSave = "btn-save-activity"

    await utils.clickElement(driver, btnNameUpdate);
    await driver.sleep(2200)

    let id_modif = "description"

    let metier_new = "my_activity_"+id_modif+"_updated"

    await utils.setInput(driver, id_modif, metier_new);
    await driver.sleep(1000)

    await utils.clickElement(driver, btnNameSave);
    await driver.sleep(1000)

    //----------------------

    ok = await utils.checkIfExistInList(driver, "activity_app", LIST_NAME, activityName);
    if(!ok) return ok
    await driver.sleep(1000)

    await utils.clickElement(driver, btnNameUpdate);
    await driver.sleep(2200)
    let txt = await utils.getTextById(driver, id_modif, "input");
    await driver.sleep(1000)
    ok = utils.checkText(id_modif, txt, metier_new);

    utils.log_end(fct, date_deb)

    return ok;
}

export async function deleteActivity(driver, activityName) {

    let fct = "deleteActivity " + activityName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "activity_app", LIST_NAME, activityName);
    if(!ok) return ok

    await driver.sleep(1000);

    await utils.clickElement(driver, 'btn-delete-activity-0');
    await driver.sleep(1000);
    await utils.clickElement(driver, 'btn-modal-ok');
    await driver.sleep(1000);

    ok = await utils.checkIfNotExistInList(driver, "activity_app", LIST_NAME, activityName);
    if(!ok) return ok

    await driver.sleep(1000);

    utils.log_end(fct, date_deb)

    return true 
}
