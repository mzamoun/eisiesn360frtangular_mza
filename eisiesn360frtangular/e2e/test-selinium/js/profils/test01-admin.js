import { Builder } from 'selenium-webdriver';
import * as login from "../lib/lib-test-login.js";

import * as cte from "../lib/_ctes.js";
import * as utils from "../lib/_utils.js";

import * as esn from "../lib/lib-test-esn.js";
import * as mp from "../lib/lib-test-mode-paiment.js";
import * as vac from "../lib/lib-test-vacance.js";

var username = 'admin@eisi-consulting.fr';
var password = "Eisi2020";
var driver = null;
var isLogued = false;

async function my_login(isQuit) {
    console.log("testLogin deb")
    driver = await new Builder().forBrowser("chrome").build();
    isLogued = await login.testLoginForm(driver, username, password, isQuit);
    console.log("testLogin end")
    return isLogued;
}

// ------------------------------
await my_login();
//-------------------------------

if (!isLogued) {
    console.error("Login failed. Exiting with code 1.");
    // //quit chrome 
    await login.quit(driver);
    process.exit(1); // Utilisez process.exit pour quitter avec un code d'erreur
}

// pour garder les imports 
cte.log()
utils.log()
esn.log()
vac.log()
mp.log()
////////////////////////////////////

// add esn
let esnName = await esn.addEsn(driver, utils.dateNow("-"));
console.log("esnName=" + esnName)

if (esnName != "" && esnName != undefined) {
    await esn.updateEsn(driver, esnName);

    await esn.addResponsableEsn(driver, esnName)

    await esn.deleteConsultantOfEsnTest(driver, esnName)

    await esn.deleteEsn(driver, esnName);

    console.log("**** TEST ADMIN OK")
}

// vacance -----------
let res = await vac.addDelVacance(driver, utils.dateNow("-"));
console.log("vac.res=" + res)

// mode paiment -----------
let mpName = await mp.addModePaiment(driver, utils.dateNow("-"));
console.log("mpName=" + mpName)

if (mpName) {
        await mp.updateModePaiment(driver, mpName);

        await mp.deleteModePaiment(driver, mpName);
}

// //quit chrome 
await login.quit(driver);
process.exit(0);
