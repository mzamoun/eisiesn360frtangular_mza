import { By } from 'selenium-webdriver';

import * as utils from './_utils.js';

export async function testLoginForm(driver, username, password, isQuit) {
    var isLogued = false ;
    
    try {
        await utils.getUrl(driver, "");

        let exists = await utils.checkElementExists(driver, ['username', 'password']);
        if (exists) {
            console.log("on va se loguer :");
            await driver.findElement(By.id('username')).sendKeys(username);
            await driver.findElement(By.id('password')).sendKeys(password);
            await driver.findElement(By.id('btn-login')).click();
            await driver.sleep(1000);
            await driver.findElement(By.id('icon_app')).click();
            await driver.sleep(2000);
        } else {
            console.log("On est deja logué.");
            isLogued = true;
        }

        let loginName = await utils.getTextById(driver, "loginName");
        if (loginName) {
            console.log("on s'est bien logué : " + loginName);
            isLogued = true;
        }else {
            console.log("on n'a pas pu se loguer !");
        }

    } catch (error) {
        utils.log_error(error, error );
    }
    finally {
        if(isQuit) {
            await quit(driver);
        }
        console.log("END : isLogued = " + isLogued);

        return isLogued;
    }
}

export async function quit(driver) {
    let date_deb = utils.log_start("quit")
    await driver.quit();
    utils.log_end("quit", date_deb)
    process.exit(0);
}
