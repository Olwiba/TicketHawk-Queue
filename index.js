const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

let chromeOptions = new chrome.Options();
chromeOptions.addArguments('--ignore-certificate-errors');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

// ASCII art to be displayed
console.log(`🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫
Welcome to Ticket Hawk!
🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫🎫`);

// Flags
let hasFound = false;

// Function to ask questions in a promise-based way
const askQuestion = (query) => new Promise(resolve => readline.question(query, resolve));

// Main async function to handle the logic
const main = async () => {
    try {
        // Getting input from the user
        const targetURL = await askQuestion("Enter the target URL: ");
        const spawnTargets = await askQuestion("How many spawn targets? ");
        const refreshTimeout = await askQuestion("Enter refresh timeout in seconds: ");

        // Closing the readline interface
        readline.close();

        // Parsing input values
        const numWindows = parseInt(spawnTargets, 10);
        const timeout = parseInt(refreshTimeout, 10) * 1000; // Convert to milliseconds

        // Array to hold references to all windows
        const windows = [];

        // Initialize browser windows
        console.log(`[Main] Initializing ${numWindows} browser windows...`);
        for (let i = 0; i < numWindows; i++) {
            const driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(chromeOptions)
                .build();
            windows.push(driver);
            await driver.get(targetURL);
            await driver.wait(until.elementLocated(By.xpath('html')), 8000);
            console.log(`[Window ${i + 1}] Initialized and navigated to ${targetURL}`);
        }

        // Function to check for the target value and handle refresh or focus
        const checkPage = async (driver, index) => {
            try {
                if (hasFound) {
                    console.log(`[Window ${index + 1}] Queue found in another window, closing this window...`);
                    await driver.quit();
                    return;
                }

                await driver.navigate().refresh();
                // Look for any element containing "queue" (case insensitive)
                const queueElement = await driver.wait(until.elementLocated(
                    By.xpath(`
                        //a[contains(translate(text(),"QUEUE","queue"),"queue")] |
                        //button[contains(translate(text(),"QUEUE","queue"),"queue")] |
                        //input[@type="submit"][contains(translate(@value,"QUEUE","queue"),"queue")] |
                        //*[@role="button"][contains(translate(text(),"QUEUE","queue"),"queue")] |
                        //*[contains(@class,"button")][contains(translate(text(),"QUEUE","queue"),"queue")] |
                        //a[contains(translate(text(),"BUY TICKETS","buy tickets"),"buy tickets")] |
                        //button[contains(translate(text(),"BUY TICKETS","buy tickets"),"buy tickets")] |
                        //input[@type="submit"][contains(translate(@value,"BUY TICKETS","buy tickets"),"buy tickets")] |
                        //*[@role="button"][contains(translate(text(),"BUY TICKETS","buy tickets"),"buy tickets")] |
                        //*[contains(@class,"button")][contains(translate(text(),"BUY TICKETS","buy tickets"),"buy tickets")]
                    `.replace(/\s+/g, ' ').trim())
                ), 5000);
                
                // Click the queue button/link when found
                await queueElement.click();
                console.log(`[Window ${index + 1}] Queue button found and clicked! Window brought to focus.`);
                hasFound = true;
                
                // Bring window to focus
                await driver.switchTo().window(await driver.getWindowHandle());
                
                // Close other windows and exit program
                console.log('[Main] Successfully joined queue! Closing other windows and exiting...');
                for (let i = 0; i < windows.length; i++) {
                    if (i !== index) {
                        try {
                            await windows[i].quit();
                        } catch (err) {
                            // Ignore errors from already closed windows
                        }
                    }
                }
                console.log('Enjoy your tickets! 🌴');
                process.exit(0);
                
            } catch (error) {
                const calculatedTimeout = Math.floor(Math.random() * timeout) + 1;
                console.log(`[Window ${index + 1}] Queue not found, refreshing in ${calculatedTimeout / 1000} seconds...`);
                await driver.sleep(calculatedTimeout);
                await checkPage(driver, index);
            }
        };

        // Start checking each window
        console.log(`[Main] Starting to check each window for the target value...`);
        windows.forEach((driver, index) => {
            checkPage(driver, index);
        });

    } catch (error) {
        console.error(`[Main] An error occurred: ${error.message}`);
    }
};

// Shutdown
const shutdown = () => {
    console.log('Exiting...');
    console.log('Enjoy your tickets! 🌴')
    process.exit(0);
}

process.on('SIGINT', shutdown);

main();