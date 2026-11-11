
async function getQuotations() {

    try {

        const response = await fetch("/quotations");

        if (!response.ok) {
            throw new Error("Unable to fetch quotations");
        }

        const quotations = await response.json();

        const tableBody = document.getElementById("quotationTable");

        tableBody.innerHTML = "";

        quotations.forEach(function(quotation) {

            const row = document.createElement("tr");

            const values = [
                quotation.quotation_no,
                String(quotation.proposal_date).substring(0, 10),
                quotation.status,
                quotation.customer_name,
                quotation.customer_contact,
                quotation.customer_mail,
                quotation.gstin
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
                updateQuotation(quotation.quotation_no);
            });

            // Delete button
            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                deleteQuotation(quotation.quotation_no);
            });

            actionCell.appendChild(updateButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error("FETCH ERROR:", error);

        alert("Unable to load quotations");

    }

}


// UPDATE QUOTATION
function updateQuotation(quotationNo) {

    window.location.href =
        "quotation.html?mode=edit&quotation_no=" +
        encodeURIComponent(quotationNo);

}


// DELETE QUOTATION
async function deleteQuotation(quotationNo) {

    const confirmDelete = confirm(
        "Are you sure you want to delete " + quotationNo + "?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `/quotation/${encodeURIComponent(quotationNo)}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert("Quotation deleted successfully!");

        getQuotations();

    } catch (error) {

        console.error("DELETE ERROR:", error);

        alert(error.message || "Unable to delete quotation");

    }

}


// Load quotations when page opens
getQuotations();
