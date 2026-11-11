
const form = document.getElementById("quotationForm");

const quotationNo = document.getElementById("quotation_no");
const proposalDate = document.getElementById("proposal_date");
const status = document.getElementById("status");
const customerName = document.getElementById("customer_name");
const customerContact = document.getElementById("customer_contact");
const customerMail = document.getElementById("customer_mail");
const gstin = document.getElementById("gstin");
const submitBtn = document.getElementById("submitBtn");

// Read URL parameters
const params = new URLSearchParams(window.location.search);

const mode = params.get("mode");
const selectedQuotationNo = params.get("quotation_no");

const isEditMode = mode === "edit" && selectedQuotationNo;

// Load existing quotation for editing
async function loadQuotation() {
    try {
        const response = await fetch(
            `/quotation/${encodeURIComponent(selectedQuotationNo)}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        quotationNo.value = result.quotation_no;
        proposalDate.value = String(result.proposal_date).substring(0, 10);
        status.value = result.status;
        customerName.value = result.customer_name;
        customerContact.value = result.customer_contact;
        customerMail.value = result.customer_mail;
        gstin.value = result.gstin;

        // Do not allow changing the primary key
        quotationNo.readOnly = true;

        submitBtn.textContent = "Update Quotation";

    } catch (error) {
        console.error("LOAD ERROR:", error);
        alert(error.message || "Unable to load quotation");
        window.location.href = "quotationlist.html";
    }
}

// Decide whether this is Create or Update mode
if (isEditMode) {
    loadQuotation();
} else {
    submitBtn.textContent = "Create Quotation";
}

// Submit form
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const quotationData = {
        quotation_no: quotationNo.value,
        proposal_date: proposalDate.value,
        status: status.value,
        customer_name: customerName.value,
        customer_contact: customerContact.value,
        customer_mail: customerMail.value,
        gstin: gstin.value
    };

    try {

        let url;
        let method;

        if (isEditMode) {
            url = `/quotation/${encodeURIComponent(selectedQuotationNo)}`;
            method = "PUT";
        } else {
            url = "/quotation";
            method = "POST";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(quotationData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(
            isEditMode
                ? "Quotation updated successfully!"
                : "Quotation created successfully!"
        );

        window.location.href = "quotationlist.html";

    } catch (error) {
        console.error("SAVE ERROR:", error);
        alert(error.message || "Unable to save quotation");
    }
});
