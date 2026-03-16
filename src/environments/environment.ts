// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// https://esn360.azurewebsites.net/esn360/

const urlLocal = 'http://localhost:8080/esn360/'
const url_dev = 'https://esn360-backend-dev.whiteforest-96ad5fb7.francecentral.azurecontainerapps.io/esn360/'
const url_main = url_dev 
const url_prod = 'https://esn360-backend-prod.whiteforest-96ad5fb7.francecentral.azurecontainerapps.io/esn360/'
// const myUrl = urlAzure
const url = urlLocal

const urlFront_dev = 'https://mzamouneisi.github.io/eisiesn360frtangular'
const urlFront_main = urlFront_dev
const urlFront_prod = 'https://mzamouneisi.github.io/eisiesn360frtangular_prod'
const urlFront = urlFront_dev

export const environment = {
  production: true,
  apiUrl: url + 'api',
  // apiUrl: urlAzure + 'api',
  divUrl: url + 'div',
  // divUrl: urlAzure + 'div',
  urlFront: urlFront,
};
