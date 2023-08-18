document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('toggle');

    // Retrieve the current state of ad blocking from storage and update the toggle accordingly
    chrome.storage.sync.get('adBlockingEnabled', function (data) {
        toggle.checked = data.adBlockingEnabled !== false; // Default to true if not found
    });

    // Listen for changes in the toggle state
    toggle.addEventListener('change', function () {
        const enabled = toggle.checked;

        // Send a message to the background script to toggle ad blocking
        chrome.runtime.sendMessage({ action: 'toggleAdBlocking', enabled: enabled }, function () {
            // Update the storage with the new toggle state
            chrome.storage.sync.set({ 'adBlockingEnabled': enabled });
        });
    });
});
