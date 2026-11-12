
const express = require("express");
const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, ".env")
});

const pool = require("./Enquiry/db");
const quotationPool = require("./Quotation/db");
const invoicePool = require("./invoice/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve frontend files locally from the public folder
app.use(express.static(path.join(__dirname, "public")));


// Test backend
app.get("/test", (req, res) => {
    res.send("CRM Backend is Working!");
});

// CREATE ENQUIRY
app.post("/enquiry", async (req, res) => {
    try {
        const {
            ENQUIRY_NO,
            ENQUIRY_DATE,
            COMPANY_NAME,
            MOBILE_NO,
            LEADSOURCE,
            ENQUIRY_CATEGORY
        } = req.body;

        if (
            !ENQUIRY_NO ||
            !ENQUIRY_DATE ||
            !COMPANY_NAME ||
            !MOBILE_NO ||
            !LEADSOURCE ||
            !ENQUIRY_CATEGORY
        ) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const query = `
            INSERT INTO enquiry (
                enquiry_no, enquiry_date, company_name,
                mobile_no, leadsource, enquiry_category
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;

        const values = [
            ENQUIRY_NO,
            ENQUIRY_DATE,
            COMPANY_NAME,
            MOBILE_NO,
            LEADSOURCE,
            ENQUIRY_CATEGORY
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
            message: "Enquiry saved successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("DATABASE ERROR:", error);

        res.status(error.code === "23505" ? 409 : 500).json({
            message: error.code === "23505"
                ? "Enquiry number already exists"
                : "Unable to save enquiry"
        });
    }
});

// READ ALL ENQUIRIES
app.get("/enquiries", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM enquiry ORDER BY enquiry_date DESC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error("FETCH ERROR:", error);
        res.status(500).json({
            message: "Unable to retrieve enquiries"
        });
    }
});

// READ ONE ENQUIRY
app.get("/enquiry/:enquiry_no", async (req, res) => {
    try {
        const { enquiry_no } = req.params;

        const result = await pool.query(
            "SELECT * FROM enquiry WHERE enquiry_no = $1",
            [enquiry_no]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Enquiry not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("FETCH ERROR:", error);
        res.status(500).json({
            message: "Unable to retrieve enquiry"
        });
    }
});

// UPDATE ENQUIRY
app.put("/enquiry/:enquiry_no", async (req, res) => {
    try {
        const { enquiry_no } = req.params;

        const {
            ENQUIRY_DATE,
            COMPANY_NAME,
            MOBILE_NO,
            LEADSOURCE,
            ENQUIRY_CATEGORY
        } = req.body;

        if (
            !ENQUIRY_DATE ||
            !COMPANY_NAME ||
            !MOBILE_NO ||
            !LEADSOURCE ||
            !ENQUIRY_CATEGORY
        ) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const query = `
            UPDATE enquiry
            SET enquiry_date = $1,
                company_name = $2,
                mobile_no = $3,
                leadsource = $4,
                enquiry_category = $5
            WHERE enquiry_no = $6
            RETURNING *;
        `;

        const values = [
            ENQUIRY_DATE,
            COMPANY_NAME,
            MOBILE_NO,
            LEADSOURCE,
            ENQUIRY_CATEGORY,
            enquiry_no
        ];

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Enquiry not found"
            });
        }

        res.json({
            message: "Enquiry updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({
            message: "Unable to update enquiry"
        });
    }
});

// DELETE ENQUIRY
app.delete("/enquiry/:enquiry_no", async (req, res) => {
    try {
        const { enquiry_no } = req.params;

        const result = await pool.query(
            "DELETE FROM enquiry WHERE enquiry_no = $1 RETURNING *",
            [enquiry_no]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Enquiry not found"
            });
        }

        res.json({
            message: "Enquiry deleted successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({
            message: "Unable to delete enquiry"
        });
    }
});


// GET ALL QUOTATIONS
app.get("/quotations", async (req, res) => {
    try {
        const result = await quotationPool.query(
            "SELECT * FROM quotation ORDER BY proposal_date DESC"
        );

        res.status(200).json(result.rows);

    } catch (error) {
        console.error("QUOTATION FETCH ERROR:", error);
        res.status(500).json({
            message: "Unable to retrieve quotations"
        });
    }
});


// READ ONE QUOTATION
app.get("/quotation/:quotation_no", async (req, res) => {
    try {
        const { quotation_no } = req.params;

        const result = await quotationPool.query(
            "SELECT * FROM quotation WHERE quotation_no = $1",
            [quotation_no]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Quotation not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("FETCH ERROR:", error);
        res.status(500).json({
            message: "Unable to retrieve quotation"
        });
    }
});


// CREATE QUOTATION
app.post("/quotation", async (req, res) => {
    try {
        const {
            quotation_no,
            proposal_date,
            status,
            customer_name,
            customer_contact,
            customer_mail,
            gstin
        } = req.body;

        if (
            !quotation_no ||
            !proposal_date ||
            !status ||
            !customer_name ||
            !customer_contact ||
            !customer_mail ||
            !gstin
        ) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const query = `
            INSERT INTO quotation (
                quotation_no,
                proposal_date,
                status,
                customer_name,
                customer_contact,
                customer_mail,
                gstin
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            quotation_no,
            proposal_date,
            status,
            customer_name,
            customer_contact,
            customer_mail,
            gstin
        ];

        const result = await quotationPool.query(query, values);

        res.status(201).json({
            message: "Quotation created successfully!",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("QUOTATION DATABASE ERROR:", error);

        res.status(error.code === "23505" ? 409 : 500).json({
            message: error.code === "23505"
                ? "Quotation number already exists"
                : "Unable to create quotation"
        });
    }
});


// UPDATE QUOTATION
app.put("/quotation/:quotation_no", async (req, res) => {
    try {
        const { quotation_no } = req.params;

        const {
            proposal_date,
            status,
            customer_name,
            customer_contact,
            customer_mail,
            gstin
        } = req.body;

        if (
            !proposal_date ||
            !status ||
            !customer_name ||
            !customer_contact ||
            !customer_mail ||
            !gstin
        ) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const query = `
            UPDATE quotation
            SET proposal_date = $1,
                status = $2,
                customer_name = $3,
                customer_contact = $4,
                customer_mail = $5,
                gstin = $6
            WHERE quotation_no = $7
            RETURNING *;
        `;

        const values = [
            proposal_date,
            status,
            customer_name,
            customer_contact,
            customer_mail,
            gstin,
            quotation_no
        ];

        const result = await quotationPool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Quotation not found"
            });
        }

        res.json({
            message: "Quotation updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("UPDATE ERROR:", error);
        res.status(500).json({
            message: "Unable to update quotation"
        });
    }
});


// DELETE QUOTATION
app.delete("/quotation/:quotation_no", async (req, res) => {
    try {
        const { quotation_no } = req.params;

        const result = await quotationPool.query(
            "DELETE FROM quotation WHERE quotation_no = $1 RETURNING *",
            [quotation_no]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Quotation not found"
            });
        }

        res.json({
            message: "Quotation deleted successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("DELETE ERROR:", error);
        res.status(500).json({
            message: "Unable to delete quotation"
        });
    }
});


// CREATE INVOICE
app.post("/invoice", async (req, res) => {
    try {
        const {
            invoice_no,
            invoice_date,
            customer_name,
            customer_contact,
            customer_mail,
            gstin
        } = req.body;

        const result = await invoicePool.query(
            `INSERT INTO invoice
            (invoice_no, invoice_date, customer_name,
             customer_contact, customer_mail, gstin)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                invoice_no,
                invoice_date,
                customer_name,
                customer_contact,
                customer_mail,
                gstin
            ]
        );

        res.status(201).json({
            message: "Invoice created successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("INVOICE ERROR:", error);
        res.status(error.code === "23505" ? 409 : 500).json({
            message: error.code === "23505"
                ? "Invoice number already exists"
                : "Unable to create invoice"
        });
    }
});


// GET ALL INVOICES
app.get("/invoices", async (req, res) => {
    try {
        const result = await invoicePool.query(
            "SELECT * FROM invoice ORDER BY invoice_date DESC"
        );
        res.json(result.rows);

    } catch (error) {
        console.error("FETCH INVOICE ERROR:", error);
        res.status(500).json({
            message: "Unable to fetch invoices"
        });
    }
});


// GET ONE INVOICE
app.get("/invoice/:invoice_no", async (req, res) => {
    try {
        const { invoice_no } = req.params;

        const result = await invoicePool.query(
            "SELECT * FROM invoice WHERE invoice_no = $1",
            [invoice_no]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("FETCH SINGLE INVOICE ERROR:", error);
        res.status(500).json({
            message: "Unable to fetch invoice"
        });
    }
});


// UPDATE INVOICE
app.put("/invoice/:invoice_no", async (req, res) => {
    try {
        const { invoice_no } = req.params;

        const {
            invoice_date,
            customer_name,
            customer_contact,
            customer_mail,
            gstin
        } = req.body;

        const result = await invoicePool.query(
            `UPDATE invoice
            SET invoice_date = $1,
                customer_name = $2,
                customer_contact = $3,
                customer_mail = $4,
                gstin = $5
            WHERE invoice_no = $6
            RETURNING *`,
            [
                invoice_date,
                customer_name,
                customer_contact,
                customer_mail,
                gstin,
                invoice_no
            ]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.json({
            message: "Invoice updated successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("UPDATE INVOICE ERROR:", error);
        res.status(500).json({
            message: "Unable to update invoice"
        });
    }
});


// DELETE INVOICE
app.delete("/invoice/:invoice_no", async (req, res) => {
    try {
        const { invoice_no } = req.params;

        const result = await invoicePool.query(
            "DELETE FROM invoice WHERE invoice_no = $1 RETURNING *",
            [invoice_no]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.json({
            message: "Invoice deleted successfully",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("DELETE INVOICE ERROR:", error);
        res.status(500).json({
            message: "Unable to delete invoice"
        });
    }
});

// Start common server
app.listen(PORT, () => {
    console.log(`CRM Server running at http://localhost:${PORT}`);
});