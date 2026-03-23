
// const url = "https://esn360.azurewebsites.net"
const url_dev = 'https://esn360-backend-dev.whiteforest-96ad5fb7.francecentral.azurecontainerapps.io'
const url_main = url_dev 
const url_prod = 'https://esn360-backend-prod.whiteforest-96ad5fb7.francecentral.azurecontainerapps.io'
const url = url_dev;

const urlFront_dev = 'https://mzamouneisi.github.io/eisiesn360frtangular'
const urlFront_main = urlFront_dev
const urlFront_prod = 'https://mzamouneisi.github.io/eisiesn360frtangular_prod'
const urlFront = urlFront_dev

const app = '/esn360/'

export const environment = {
  production: true,
  apiUrl: url + app + 'api',
  divUrl: url + app + 'div',
  extractUrl: url + ':8300',
  urlFront: urlFront,
};
