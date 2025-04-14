chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fill-otp") {
        const otp = request.otp;
        
        // More specific selector with multiple attempts
        const selectors = [
            'input[name="totpcode"]',
            'input[name="otp"]',
            'input[autocomplete="one-time-code"]',
            'input[type="text"][name*="code"]',
            'input[placeholder*="code"]',
            'input[placeholder*="OTP"]',
            'input#totpcode'
        ];
        
        let otpInput;
        for (const selector of selectors) {
            otpInput = document.querySelector(selector);
            if (otpInput) break;
        }
        
        if (otpInput) {
            otpInput.focus();
            otpInput.value = otp;
            
            // Dispatch multiple events to ensure compatibility
            ['input', 'change', 'keydown', 'keyup'].forEach(eventType => {
                otpInput.dispatchEvent(new Event(eventType, { bubbles: true }));
            });
            
            sendResponse({ success: true, message: "OTP filled" });
        } else {
            console.warn("OTP input field not found. Tried selectors:", selectors);
            sendResponse({ success: false, message: "OTP input not found" });
        }
    }
    return true; // Important for async sendResponse
});