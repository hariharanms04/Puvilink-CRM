
const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();
const PORT = 3000;

// Middleware to receive JSON data
app.use(express.json());

// Serve frontend files from Public folder
app.use(express.static(path.join(__dirname, "Public")));

// Test backend
app.get("/test", (req, res) => {
    res.send("Enquiry Backend is Working!");
});

// Save enquiry into PostgreSQL
app.post("/enquiry", async (req, res) => {
    console.log("Enquiry API called!");
    console.log("Received data:", req.body);

    try {
        const {
            ENQUIRY_NO,
            ENQUIRY_DATE,
            COMPANY_NAME,
            MOBILE_NO,
            LEADSOURCE,
            ENQUIRY_CATEGORY
        } = req.body;

        // Check required fields
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

        // SQL query
        const query = `
            INSERT INTO enquiry (
                enquiry_no,
                enquiry_date,
                company_name,
                mobile_no,
                leadsource,
                enquiry_category
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


// Get all enquiries from PostgreSQL
app.get("/enquiries", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM enquiry ORDER BY enquiry_date DESC"
        );

        res.status(200).json(result.rows);

    } catch (error) {

        console.error("FETCH ERROR:", error);

        res.status(500).json({
            message: "Unable to retrieve enquiries"
        });

    }

});


 // Get one enquiry using enquiry number
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

        res.status(200).json(result.rows[0]);

    } catch (error) {

        console.error("FETCH ERROR:", error);

        res.status(500).json({
            message: "Unable to retrieve enquiry"
        });

    }

});

 
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
            SET
                enquiry_date = $1,
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
 
app.delete("/enquiry/:enquiry_no", async (req, res) => {

    try {

        const { enquiry_no } = req.params;

        const query = `
            DELETE FROM enquiry
            WHERE enquiry_no = $1
            RETURNING *;
        `;

        const result = await pool.query(query, [enquiry_no]);

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


// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
