# installs fnm (Fast Node Manager)
winget install Schniz.fnm

# download and install Node.js
fnm use --install-if-missing 14

# verifies the right Node.js version is in the environment
node -v # should print `v14.21.3`

# verifies the right NPM version is in the environment
npm -v # should print `6.14.18`
