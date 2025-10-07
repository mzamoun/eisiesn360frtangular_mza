import { By } from 'selenium-webdriver';

import * as utils from './_utils.js';

export async function addConsultant(driver, num) {
    let name = "test-consultant-" + num
    let firstName = "fn-" + num ;
    let lastName = "ln-" + num ;
    let email = firstName + "." + lastName + "@my-soc.com";

    console.log("-----------email="+email)

    let fct = "addConsultant " + name

    let date_deb = utils.log_start(fct)

    await driver.manage().window().fullscreen();
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
    await driver.sleep(1000);

    await utils.getUrl(driver, "consultant_app")
    await driver.sleep(2000);

    await utils.clickElement(driver, "btn-add-consultant-form");
    await driver.sleep(1000);

    await utils.selectInListOptions(driver, "role", "CONSULTANT");
    // si role = RESPONSIBLE_ESN
    // await utils.selectInListOptions(driver, "responsableEsn", "EsnDMO1");
    await driver.findElement(By.id('firstName')).sendKeys(firstName);
    await driver.findElement(By.id('lastName')).sendKeys(lastName);
    await driver.findElement(By.id('tel')).sendKeys("0123456789");
    await driver.findElement(By.id('email')).sendKeys(email);
    await driver.findElement(By.id('level')).sendKeys(1000);
    await driver.findElement(By.id('adresse_street')).sendKeys("my_adresse_street");
    await driver.findElement(By.id('adresse_city')).sendKeys("my_adresse_city");
    await driver.findElement(By.id('adresse_zipCode')).sendKeys("75001");
    await driver.findElement(By.id('adresse_country')).sendKeys("Algerie");
    // await driver.findElement(By.id('manager')).sendKeys("my_manager");

    // await utils.setInput(driver, 'username', email);

    await utils.setInput(driver, 'password1', "aa");
    await utils.setInput(driver, 'password2', "aa");

    // await driver.findElement(By.id('reset-password')).sendKeys("my_reset-password");
    // await driver.findElement(By.id('active')).sendKeys("my_active");

    await driver.sleep(5000);

    let btnSaveId = "btn-consultant-save";
    let btnSave = await utils.clickElement(driver, btnSaveId);
    await driver.sleep(2000);

    let ok = await utils.checkIfExistInList(driver, "consultant_app", "Consultant", num, 1);
    if (!ok) {
        utils.log_error("le consultant n'a pas été rajouté : num = "+num)
        email = null 
    }

    console.log("-----------email="+email)

    utils.log_end(fct, date_deb)

    return email;

}


export async function updateConsultant(driver, consultantName) {

    let fct = "updateConsultant " + consultantName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "consultant_list", "Consultant", consultantName, 1);
    if(!ok) return ok

    let btnNameUpdate = "btn-consultant-edit-0"
    let btnNameSave = "btn-consultant-save"

    await utils.clickElement(driver, btnNameUpdate);

    let id_modif = "level"

    let val_new = "5000"

    await utils.setInput(driver, id_modif, val_new);
    await driver.sleep(1000)

    await utils.clickElement(driver, btnNameSave);
    await driver.sleep(1000)

    //----------------------

    ok = await utils.checkIfExistInList(driver, "consultant_app", "Consultant", consultantName);
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

export async function deleteConsultant(driver, consultantName) {

    let fct = "deleteConsultant " + consultantName

    let date_deb = utils.log_start(fct)

    let ok = await utils.checkIfExistInList(driver, "consultant_app", "Consultant", consultantName);
    if(!ok) return ok

    await driver.sleep(1000);

    await utils.clickElement(driver, 'btn-delete-consultant-list-0');
    await driver.sleep(1000);
    await utils.clickElement(driver, 'btn-modal-ok');
    await driver.sleep(1000);

    ok = await utils.checkIfNotExistInList(driver, "consultant_app", "Consultant", consultantName);
    if(!ok) return ok

    await driver.sleep(1000);

    utils.log_end(fct, date_deb)

    return true 
}
