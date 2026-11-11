
async function getEnquiries() {

    try {

        const response = await fetch("/enquiries");

        if (!response.ok) {
            throw new Error("Unable to fetch enquiries");
        }

        const enquiries = await response.json();

        const tableBody = document.getElementById("enquiryTableBody");

        tableBody.innerHTML = "";

        enquiries.forEach(function(enquiry) {

            const row = document.createElement("tr");

            const values = [
                enquiry.enquiry_no,
                String(enquiry.enquiry_date).substring(0, 10),
                enquiry.company_name,
                enquiry.mobile_no,
                enquiry.leadsource,
                enquiry.enquiry_category
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
                updateEnquiry(enquiry.enquiry_no);
            });

            // Delete button
            const deleteButton = document.createElement("button");

            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", function() {
                deleteEnquiry(enquiry.enquiry_no);
            });

            actionCell.appendChild(updateButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);

            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error("FETCH ERROR:", error);

        alert("Unable to load enquiries");

    }

}


// UPDATE ENQUIRY
function updateEnquiry(enquiryNo) {

    window.location.href =
        "enquiry.html?mode=edit&enquiry_no=" +
        encodeURIComponent(enquiryNo);

}


// DELETE ENQUIRY
async function deleteEnquiry(enquiryNo) {

    const confirmDelete = confirm(
        "Are you sure you want to delete " + enquiryNo + "?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `/enquiry/${encodeURIComponent(enquiryNo)}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        alert("Enquiry deleted successfully!");

        getEnquiries();

    } catch (error) {

        console.error("DELETE ERROR:", error);

        alert(error.message || "Unable to delete enquiry");

    }

}


// Load enquiries when page opens
getEnquiries();
