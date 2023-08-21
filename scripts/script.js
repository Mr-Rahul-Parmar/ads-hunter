let adBlockingEnabled = true;
let blockingFunction;

// Initialize adBlockingEnabled to true on extension install
chrome.runtime.onInstalled.addListener(function () {
    blockingFunction = function (details) {
        console.log("I am going to block:", details.url);
        return { cancel: true };
    };

    chrome.webRequest.onBeforeRequest.addListener(
        blockingFunction,
        { urls: blocked_sites_v2 },
        ["blocking"]
    );
});

// Retrieve the adBlockingEnabled state from storage and initialize ad blocking
chrome.storage.sync.get('adBlockingEnabled', function (data) {
    adBlockingEnabled = data.adBlockingEnabled !== false; // Default to true if not found
    if (adBlockingEnabled) {
        blockingFunction = function (details) {
            console.log("I am going to block:", details.url);
            return { cancel: true };
        };

        chrome.webRequest.onBeforeRequest.addListener(
            blockingFunction,
            { urls: blocked_sites_v2 },
            ["blocking"]
        );
    }
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'toggleAdBlocking') {
        adBlockingEnabled = message.enabled;

        if (adBlockingEnabled) {
            console.log("I am Enabled");
            blockingFunction = function (details) {
                console.log("I am going to block:", details.url);
                return { cancel: true };
            };

            chrome.webRequest.onBeforeRequest.addListener(
                blockingFunction,
                { urls: blocked_sites_v2 },
                ["blocking"]
            ); // You should be adding the blockingFunction listener here
        } else {
            console.log("I am Disabled");
            // Remove the blockingFunction listener to stop ad blocking
            chrome.webRequest.onBeforeRequest.removeListener(blockingFunction);
        }
    }
});
