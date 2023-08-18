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

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'toggleAdBlocking') {
        adBlockingEnabled = message.enabled;

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
        } else {
            console.log("I am Disable");
            chrome.webRequest.onBeforeRequest.removeListener(blockingFunction);
        }
    }
});
