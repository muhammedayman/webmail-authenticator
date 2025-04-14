document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get(["serviceName", "accountName", "secretKey"], (data) => {
        document.getElementById("serviceName").value = data.serviceName || "";
        document.getElementById("accountName").value = data.accountName || "";
        document.getElementById("secretKey").value = data.secretKey || "";
    });

    document.getElementById("options-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const serviceName = document.getElementById("serviceName").value;
        const accountName = document.getElementById("accountName").value;
        const secretKey = document.getElementById("secretKey").value;

        chrome.storage.local.set({ serviceName, accountName, secretKey }, () => {
            alert("Configuration saved.");
        });
    });

    document.getElementById("reset").addEventListener("click", () => {
        chrome.storage.local.clear(() => {
            alert("Configuration reset.");
            location.reload();
        });
    });
});
