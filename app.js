const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { faker } = require('@faker-js/faker');  // Use Faker.js for generating random data


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize the SQLite database
const db = new sqlite3.Database('database.db');

db.serialize(() => {
    // db.run(`
    //     CREATE TABLE IF NOT EXISTS logs (
    //         id INTEGER PRIMARY KEY AUTOINCREMENT,
    //         LogDate TEXT,
    //         EmpNumber INTEGER,
    //         Status TEXT,
    //         OHRMID INTEGER
    //     )
    // `);
    db.run(`
        CREATE TABLE IF NOT EXISTS addData (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_num TEXT,
            log_date TEXT,
            device_desc TEXT,
            process_status TEXT,
            ohrm_id INTEGER
        )
    `);
});


// GET method to fetch data from the SQLite database
app.get('/api/Logs', (req, res) => {
    const { arrEmployeeNumber, dateFrom, dateTo } = req.query;

    // Start with a base query
    let query = `SELECT * FROM addData WHERE 1=1`;
    let queryParams = [];

    // Add filtering by employee_num if provided
    if (arrEmployeeNumber) {
        query += ` AND employee_num = ?`;
        queryParams.push(arrEmployeeNumber);
    }

    // Add filtering by date range if provided
    if (dateFrom && dateTo) {
        query += ` AND DATE(log_date) BETWEEN DATE(?) AND DATE(?)`;
        queryParams.push(dateFrom, dateTo);
    }

    db.all(query, queryParams, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});



app.post('/addData', (req, res) => {
    const { employee_num, log_date, device_desc, process_status, ohrm_id } = req.body;

    const query = `
        INSERT INTO addData (employee_num, log_date, device_desc, process_status, ohrm_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [employee_num, log_date, device_desc, process_status, ohrm_id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// PUT method to update data in the addData table based on the provided payload
app.put('/api/Logs', (req, res) => {
    const { id, process_status, ohrm_id } = req.body;

    // Only update the fields that are provided in the request body
    const query = `
        UPDATE addData
        SET process_status = ?, ohrm_id = ?
        WHERE id = ?
    `;

    db.run(query, [process_status, ohrm_id, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json({ message: "Record updated successfully" });
    });
});


// DELETE method to remove data from the addData table
app.delete('/addData/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM addData WHERE id = ?`;

    db.run(query, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json({ message: "Record deleted successfully" });
    });
});

// DELETE method to remove data from the logs table
app.delete('/logs/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM logs WHERE id = ?`;

    db.run(query, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.json({ message: "Log deleted successfully" });
    });
});

// DELETE method to delete a log from the addData table
app.delete('/delete-log/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM addData WHERE id = ?`;

    db.run(query, id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Log deleted successfully' });
    });
});
// DELETE method to delete all logs from the addData table
app.delete('/delete-all-logs', (req, res) => {
    const query = `DELETE FROM addData`;

    db.run(query, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'All logs deleted successfully' });
    });
});
// Default route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
