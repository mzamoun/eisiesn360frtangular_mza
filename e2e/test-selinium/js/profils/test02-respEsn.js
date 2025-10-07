import { Builder } from 'selenium-webdriver';

import * as utils from "../lib/_utils.js";
import * as activity from "../lib/lib-test-activity.js";
import * as client from "../lib/lib-test-client.js";
import * as consultant from "../lib/lib-test-consultant.js";
import * as login from "../lib/lib-test-login.js";
import * as project from "../lib/lib-test-project.js";



var username = 'resp.esn.demo1@ens-demo1.com';
var password = "Eisi2020";
var driver = null;
var isLogued = false;

async function my_login(isQuit) {
    console.log("testLogin deb")
    driver = await new Builder().forBrowser("chrome").build();
    isLogued = await login.testLoginForm(driver, username, password, isQuit);
    console.log("testLogin end")
}

// ------------------------------
await my_login();

if (!isLogued) {
    console.error("Login failed. Exiting with code 1.");
    // //quit chrome 
    await login.quit(driver);
    process.exit(1); // Utilisez process.exit pour quitter avec un code d'erreur
}
//-------------------------------

let num = utils.dateNow("-");

// add client
let clientName = await client.addClient(driver, num);
console.log("clientName="+clientName)

// modifier client 
if(clientName) {
    await client.updateClient(driver, clientName);

    await client.deleteClient(driver, clientName)
}

// project -----------
let projectName = await project.addProject(driver, num);
console.log("projectName=" + projectName)

if (projectName) {
        await project.updateProject(driver, projectName);

        await project.deleteProject(driver, projectName);
}

// consultant -----------
let consultantName = await consultant.addConsultant(driver, num);
console.log("consultantName=" + consultantName)

await driver.sleep(2000);

if (consultantName) {
        await consultant.updateConsultant(driver, consultantName);

        await consultant.deleteConsultant(driver, consultantName);
}

// activity -----------
let activityName = await activity.addActivity(driver, num);
console.log("activityName=" + activityName)

if (activityName) {
        await activity.updateActivity(driver, activityName);

        await activity.deleteActivity(driver, activityName);
}


///////////////////


///////////
console.log("**** TEST RESP_ESN OK")


//quit chrome 
await login.quit(driver);
