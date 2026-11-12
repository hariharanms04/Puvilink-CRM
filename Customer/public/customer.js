
const form = document.getElementById("customerForm");

const customerCode = document.getElementById("customerCode");
const customerType = document.getElementById("customerType");
const customerName = document.getElementById("customerName");
const customerContact = document.getElementById("customerContact");
const customerMail = document.getElementById("customerMail");
const gstin = document.getElementById("gstin");

const submitBtn = document.getElementById("submitBtn");

// Get edit mode from URL
const params = new URLSearchParams(window.location.search);

const mode = params.get("mode");
const code = params.get("customer_code");

// Load existing customer details for update
if (mode === "edit" && code) {

    fetch(`/customer/${code}`)
        .then(response => response.json())
        .then(data => {

            customerCode.value = data.customer_code;
            customerType.value = data.customer_type;
            customerName.value = data.customer_name;
            customerContact.value = data.customer_contact;
            customerMail.value = data.customer_mail;
            gstin.value = data.gstin;

            customerCode.readOnly = true;

            submitBtn.textContent = "Update Customer";

        })
        .catch(error => {
            console.error("Error loading customer:", error);
            alert("Unable to load customer details");
        });

}

// Save or Update Customer
form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const customer = {
        customer_code: customerCode.value,
        customer_type: customerType.value,
        customer_name: customerName.value,
        customer_contact: customerContact.value,
        customer_mail: customerMail.value,
        gstin: gstin.value
    };

    let url = "/customer";
    let method = "POST";

    if (mode === "edit") {
        url = `/customer/${code}`;
        method = "PUT";
    }

    try {

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customer)
        });

        const result = await response.json();

        if (response.ok) {

            alert(result.message);

            window.location.href = "customers.html";

        } else {

            alert(result.message || "Something went wrong");

        }

    } catch (error) {

        console.error("Error:", error);
        alert("Server connection failed");

    }

});
