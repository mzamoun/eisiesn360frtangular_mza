import { By } from 'selenium-webdriver';

import * as utils from './_utils.js';

export async function addProject(driver, num) {
    let name = "test-project-" + num

    let fct = "addProject " + name

    let date_deb = utils.log_start(fct)

    await driver.manage().window().fullscreen();
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await driver.sleep(1000);

    await utils.getUrl(driver, "project_app")
    await driver.sleep(2000);

    await utils.clickElement(driver, "addProject");
    await driver.sleep(1000);

    await driver.findElement(By.id('name')).sendKeys(name);
    await driver.findElement(By.id('desc')).sendKeys("my_desc");
    await driver.findElement(By.id('teamNumber')).sendKeys("10");
    await driver.findElement(By.id('teamDesc')).sendKeys("my_teamDesc");
    await driver.findElement(By.id('methode')).sendKeys("my_methode");
    await driver.findElement(By.id('env')).sendKeys("my_env");
    await utils.selectInListOptions(driver, "project-select-client", "ClientDEMO1");
    await driver.findElement(By.id('comment')).sendKeys("my_comment");

    let btnSaveId = "btn-project-save";
    let btnSave = await utils.clickElement(driver, btnSaveId);
    await driver.sleep(1000);

    let ok = await utils.checkIfExistInList(driver, "project_app", "Project", num);
    if (!ok) name = ""

    utils.log_end(fct, date_deb)

    return name;


}


export async function updateProject(driver, projectName) {

    let fct = "updateProject " + projectName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "project_app", "Project", projectName);
    if(!ok) return ok

    let btnNameUpdate = "btn-project-edit-0"
    let btnNameSave = "btn-project-save"

    await utils.clickElement(driver, btnNameUpdate);

    let id_modif = "env"

    let val_new = "my_project_"+id_modif+"_updated"

    await utils.setInput(driver, id_modif, val_new);
    await driver.sleep(1000)

    await utils.clickElement(driver, btnNameSave);
    await driver.sleep(1000)

    //----------------------

    ok = await utils.checkIfExistInList(driver, "project_app", "Project", projectName);
    if(!ok) return ok

    await utils.clickElement(driver, btnNameUpdate);
    await driver.sleep(1000)

    let txt = await utils.getTextById(driver, id_modif, "input");
    await driver.sleep(1000)

    ok = utils.checkText(id_modif, txt, val_new);
    await driver.sleep(1000)

    utils.log_end(fct, date_deb)

    return ok;
}

export async function deleteProject(driver, projectName) {

    let fct = "deleteProject " + projectName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "project_app", "Project", projectName);
    if(!ok) return ok

    await driver.sleep(1000);

    await utils.clickElement(driver, 'btn-project-delete-0');
    await driver.sleep(1000);
    await utils.clickElement(driver, 'btn-modal-ok');
    await driver.sleep(1000);

    ok = await utils.checkIfNotExistInList(driver, "project_app", "Project", projectName);
    if(!ok) return ok

    await driver.sleep(1000);

    utils.log_end(fct, date_deb)

    return true 
}
