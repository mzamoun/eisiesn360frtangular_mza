import { By } from 'selenium-webdriver';

import * as utils from './_utils.js';

export async function testLoginForm(driver, username, password, isQuit) {
    var isLogued = false ;
    
    try {
        await utils.getUrl(driver, "");

        let exists = await utils.checkElementExists(driver, ['username', 'password']);
        if (exists) {
            console.log("on va se loguer : username=" + username + " password=" + password);
            await driver.findElement(By.id('username')).sendKeys(username);
            await driver.findElement(By.id('password')).sendKeys(password);
            await driver.findElement(By.id('btn-login')).click();
            
            // Attendre que l'overlay de chargement disparaisse
            await utils.waitForLoadingOverlayToDisappear(driver);
            
            // Attendre un peu plus pour que la page se stabilise
            await driver.sleep(3000);
            
            // Essayer de cliquer sur icon_app avec JavaScript si le clic normal échoue
            try {
                await driver.findElement(By.id('icon_app')).click();
            } catch (e) {
                console.log("Clic normal échoué, essai avec JavaScript");
                await driver.executeScript("document.getElementById('icon_app').click()");
            }
            
            let t = 2000;
            console.log("on a clické. on attend un peu .. " + t + " ms");
            await driver.sleep(t);
        } else {
            console.log("On est deja logué.");
            isLogued = true;
        }

        let loginName = await utils.getTextById(driver, "loginName");
        if (loginName) {
            console.log("on s'est bien logué : " + loginName);
            isLogued = true;
        }else {
            console.log("on n'a pas pu se loguer ! pas de loginName");
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
