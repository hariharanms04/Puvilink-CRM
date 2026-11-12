
async function getInvoices() {

    try {

        const response = await fetch("/invoices");

        if (!response.ok) {
            throw new Error("Unable to fetch invoices");
        }

        const invoices = await response.json();

        const tableBody = document.getElementById("invoiceTableBody");

        tableBody.innerHTML = "";

        invoices.forEach(function(invoice) {

            const row = document.createElement("tr");

            const values = [
                invoice.invoice_no,
                String(invoice.invoice_date).substring(0, 10),
                invoice.customer_name,
                invoice.customer_contact,
                invoice.customer_mail,
                invoice.gstin
            ];

            values.forEach(function(value) {

                const cell = document.createElement("td");

                cell.textContent = value ?? "";

                row.appendChild(cell);

            });

            // Update button
            const actionCell = document.createElement("td");

            const updateButton = document.createElement("button");

            updateButton.textContent = "Update";

            updateButton.addEventListener("click", function() {
                updateInvoice(invoice.invoice_no);
            });

            // Delete button
            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                deleteInvoice(invoice.invoice_no);
            });

            actionCell.appendChild(updateButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error("FETCH ERROR:", error);

        alert("Unable to load invoices");

    }

}


// UPDATE INVOICE
function updateInvoice(invoiceNo) {

    window.location.href =
        "invoice.html?mode=edit&invoice_no=" +
        encodeURIComponent(invoiceNo);

}


// DELETE INVOICE
async function deleteInvoice(invoiceNo) {

    const confirmDelete = confirm(
        "Are you sure you want to delete " + invoiceNo + "?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `/invoice/${encodeURIComponent(invoiceNo)}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert("Invoice deleted successfully!");

        getInvoices();

    } catch (error) {

        console.error("DELETE ERROR:", error);

        alert(error.message || "Unable to delete invoice");

    }

}


// Load invoices when page opens
getInvoices();
