document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["serviceName", "accountName", "secretKey"], (data) => {
        const hasAllValues = data.serviceName && data.accountName && data.secretKey;

        if (hasAllValues) {
            document.getElementById("config-section").style.display = "none";
            document.getElementById("otp-section").style.display = "block";

            try {
                const otp = window.otplib.authenticator.generate(data.secretKey);
                document.getElementById("response").innerText = otp;

                // Send OTP to content script on active tab
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    const tab = tabs[0];
                    if (!tab || !tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("about:")) {
                        console.warn("Cannot inject OTP into this tab:", tab?.url);
                        return;
                    }

                    // Execute content script first to ensure it's ready
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content.js']
                    }, () => {
                        // Then send the message
                        chrome.tabs.sendMessage(tab.id, { 
                            action: "fill-otp", 
                            otp 
                        }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.error("Error sending OTP:", chrome.runtime.lastError.message);
                            } else if (!response) {
                                console.error("No response from content script - it may not be properly injected");
                            } else {
                                console.log("OTP fill result:", response);
                            }
                        });
                    });
                });

            } catch (error) {
                console.error("OTP generation failed", error);
                document.getElementById("response").innerText = "Invalid secret.";
            }
        } else {
            document.getElementById("config-section").style.display = "block";
        }
    });
});
  
  document.getElementById("auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const serviceName = document.getElementById("serviceName").value;
    const accountName = document.getElementById("accountName").value;
    const secretKey = document.getElementById("secretKey").value;
  
    chrome.storage.local.set({ serviceName, accountName, secretKey }, () => {
      location.reload();
    });
  });
  