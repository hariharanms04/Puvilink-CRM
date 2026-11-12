
const customerTableBody = document.getElementById("customerTableBody");

// Get all customers
async function getCustomers() {

    try {

        const response = await fetch("/customers");

        const customers = await response.json();

        customerTableBody.innerHTML = "";

        customers.forEach(customer => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${customer.customer_code}</td>
                <td>${customer.customer_type}</td>
                <td>${customer.customer_name}</td>
                <td>${customer.customer_contact}</td>
                <td>${customer.customer_mail}</td>
                <td>${customer.gstin}</td>
                <td>
                    <button onclick="editCustomer('${customer.customer_code}')">
                        Update
                    </button>

                    <button onclick="deleteCustomer('${customer.customer_code}')">
                        Delete
                    </button>
                </td>
            `;

            customerTableBody.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading customers:", error);

    }

}

// Update Customer
function editCustomer(code) {

    window.location.href =
        `customer.html?mode=edit&customer_code=${encodeURIComponent(code)}`;

}

// Delete Customer
async function deleteCustomer(code) {

    const confirmDelete = confirm("Are you sure you want to delete this customer?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`/customer/${encodeURIComponent(code)}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {

            alert(result.message);

            getCustomers();

        } else {

            alert(result.message || "Unable to delete customer");

        }

    } catch (error) {

        console.error("Error deleting customer:", error);

    }

}

// Load customers when page opens
getCustomers();
