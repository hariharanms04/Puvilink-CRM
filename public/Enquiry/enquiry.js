
const form = document.getElementById("enquiryForm");

const enquiryNo = document.getElementById("enquiryNo");
const enquiryDate = document.getElementById("enquiryDate");
const companyName = document.getElementById("companyName");
const mobileNo = document.getElementById("mobileNo");
const leadSource = document.getElementById("leadSource");
const enquiryCategory = document.getElementById("enquiryCategory");
const submitBtn = document.getElementById("submitBtn");

// Read URL parameters
const params = new URLSearchParams(window.location.search);

const mode = params.get("mode");
const selectedEnquiryNo = params.get("enquiry_no");

const isEditMode = mode === "edit" && selectedEnquiryNo;

// Load existing enquiry for editing
async function loadEnquiry() {
    try {
        const response = await fetch(
            `/enquiry/${encodeURIComponent(selectedEnquiryNo)}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        enquiryNo.value = result.enquiry_no;
        enquiryDate.value = String(result.enquiry_date).substring(0, 10);
        companyName.value = result.company_name;
        mobileNo.value = result.mobile_no;
        leadSource.value = result.leadsource;
        enquiryCategory.value = result.enquiry_category;

        // Do not allow changing the primary key
        enquiryNo.readOnly = true;

        submitBtn.textContent = "Update Enquiry";

    } catch (error) {
        console.error("LOAD ERROR:", error);
        alert(error.message || "Unable to load enquiry");
        window.location.href = "enquirylist.html";
    }
}

// Decide whether this is Create or Update mode
if (isEditMode) {
    loadEnquiry();
} else {
    submitBtn.textContent = "Create Enquiry";
}

// Submit form
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const enquiryData = {
        ENQUIRY_NO: enquiryNo.value,
        ENQUIRY_DATE: enquiryDate.value,
        COMPANY_NAME: companyName.value,
        MOBILE_NO: mobileNo.value,
        LEADSOURCE: leadSource.value,
        ENQUIRY_CATEGORY: enquiryCategory.value
    };

    try {

        let url;
        let method;

        if (isEditMode) {
            url = `/enquiry/${encodeURIComponent(selectedEnquiryNo)}`;
            method = "PUT";
        } else {
            url = "/enquiry";
            method = "POST";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enquiryData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(
            isEditMode
                ? "Enquiry updated successfully!"
                : "Enquiry created successfully!"
        );

        window.location.href = "enquirylist.html";

    } catch (error) {
        console.error("SAVE ERROR:", error);
        alert(error.message || "Unable to save enquiry");
    }
});
