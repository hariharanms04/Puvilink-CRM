
const form = document.getElementById("invoiceForm");

const invoiceNo = document.getElementById("invoice_no");
const invoiceDate = document.getElementById("invoice_date");
const customerName = document.getElementById("customer_name");
const customerContact = document.getElementById("customer_contact");
const customerMail = document.getElementById("customer_mail");
const gstin = document.getElementById("gstin");
const submitBtn = document.getElementById("submitBtn");

// Read URL parameters
const params = new URLSearchParams(window.location.search);

const mode = params.get("mode");
const selectedInvoiceNo = params.get("invoice_no");

const isEditMode = mode === "edit" && selectedInvoiceNo;

// Load existing invoice for editing
async function loadInvoice() {
    try {
        const response = await fetch(
            `/invoice/${encodeURIComponent(selectedInvoiceNo)}`
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        invoiceNo.value = result.invoice_no;
        invoiceDate.value = String(result.invoice_date).substring(0, 10);
        customerName.value = result.customer_name;
        customerContact.value = result.customer_contact;
        customerMail.value = result.customer_mail;
        gstin.value = result.gstin;

        // Do not allow changing the primary key
        invoiceNo.readOnly = true;

        submitBtn.textContent = "Update Invoice";

    } catch (error) {
        console.error("LOAD ERROR:", error);
        alert(error.message || "Unable to load invoice");
        window.location.href = "invoices.html";
    }
}

// Decide whether this is Create or Update mode
if (isEditMode) {
    loadInvoice();
} else {
    submitBtn.textContent = "Create Invoice";
}

// Submit form
form.addEventListener("submit", async function(event) {

    event.preventDefault();

    const invoiceData = {
        invoice_no: invoiceNo.value,
        invoice_date: invoiceDate.value,
        customer_name: customerName.value,
        customer_contact: customerContact.value,
        customer_mail: customerMail.value,
        gstin: gstin.value
    };

    try {

        let url;
        let method;

        if (isEditMode) {
            url = `/invoice/${encodeURIComponent(selectedInvoiceNo)}`;
            method = "PUT";
        } else {
            url = "/invoice";
            method = "POST";
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(invoiceData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert(
            isEditMode
                ? "Invoice updated successfully!"
                : "Invoice created successfully!"
        );

        window.location.href = "invoices.html";

    } catch (error) {
        console.error("SAVE ERROR:", error);
        alert(error.message || "Unable to save invoice");
    }
});
