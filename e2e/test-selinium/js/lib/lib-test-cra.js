import { By, Select } from 'selenium-webdriver';

export async function createCra(driver) {
    try {
        await driver.findElement(By.id('myNavbar')).click();
        await driver.findElement(By.id('craAppLink')).click();
        await driver.sleep(1000);
        await driver.findElement(By.id('addCra')).click();
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");

        await driver.sleep(1000);
        await driver.findElement(By.id('btn-cra-form-add-multi-date')).click();
        await driver.sleep(1000);
        //Selectionner l'activité
        let selectActivityTypeElement = await driver.findElement(By.id('cra-form-select-activity'));
        let selectActivityType = await new Select(selectActivityTypeElement);
        await selectActivityType.selectByIndex(1);
        //Selectionner le temps
        let selectProjectElement = await driver.findElement(By.id('cra-form-select-end-hour'));
        let selectproject = await new Select(selectProjectElement);
        await selectproject.selectByIndex(2);
        //Selectionner date deb-fin
        await driver.findElement(By.id('mat-date-range-input-0')).sendKeys("05/01/2024");
        await driver.findElement(By.id('endDate')).sendKeys("31/05/2024");
        await driver.sleep(1000);
        await driver.findElement(By.id('btn-cra-form-add-current-activity')).click();
        await driver.sleep(1000);

        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(1000);
        await driver.findElement(By.id('btn-cra-form-save')).click();
    } finally {
        console.log("ERROR");
    }
}
