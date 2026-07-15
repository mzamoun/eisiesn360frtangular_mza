/**
 * Test de debug pour vérifier l'infrastructure Selenium
 */

import { Builder, By } from 'selenium-webdriver';

console.log("=== DEBUG TEST START ===");
console.log("Node version:", process.version);
console.log("Current directory:", process.cwd());

try {
    console.log("Importing selenium-webdriver...");
    console.log("✓ selenium-webdriver imported successfully");
    
    console.log("Creating Chrome driver...");
    const driver = await new Builder().forBrowser("chrome").build();
    console.log("✓ Chrome driver created");
    
    console.log("Navigating to application...");
    await driver.get("http://localhost:4200/#");
    console.log("✓ Navigation successful");
    
    const title = await driver.getTitle();
    console.log("✓ Page title:", title);
    
    await driver.quit();
    console.log("✓ Driver quit successfully");
    console.log("=== DEBUG TEST SUCCESS ===");
    process.exit(0);
    
} catch (error) {
    console.error("✗ Error:", error.message);
    console.error("Stack:", error.stack);
    process.exit(1);
}