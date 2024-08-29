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

const employeeNumbers = [
    "EMABO05", "EMDAK02", "EMDAR01", "EMDEE01", "EMDEE10", "EMDEM01", 
    "EMDIB01", "EMDIB02", "EMDIB03", "EMABU01", "EMDKH01", "EMDOM01", 
    "EMEL-02", "EMELH02", "EMELI01", "EMELS03", "EMEZZ02", "EMEZZ04", 
    "EMFAK02", "EMFAR05", "EMFAR08", "EMFAR09", "EMFAR10", "EMFAR11", 
    "EMFAR12", "EMFLA01", "EMFLA02", "EMGAM01", "EMGAM02", "EMGHA02", 
    "EMGHA08", "EMGHA09", "EMGHA11", "EMGHO01", "EMHAC01", "EMHAI03", 
    "EMHAI04", "EMABU07", "EMHAI05", "EMHAJ01", "EMHAJ02", "EMHAK02", 
    "EMHAM05", "EMHAM13", "EMHAS01", "EMHAS02", "EMHAT01", "EMABU08", 
    "EMHAW03", "EMHAW04", "EMHAZ03", "EMHMA02", "EMHMA03", "EMHOB01", 
    "EMHOB02", "EMHOB03", "EMHOU01", "EMHOU02", "EMHOU03", "EMIMR02", 
    "EMISM01", "EMABU10", "EMJAA02", "EMJAL03", "EMJAM01", "EMJAR03", 
    "EMJAR04", "EMJAR07", "EMABU11", "EMJAW01", "EMJAW02", "EMJEO01", 
    "EMJIC03", "EMJRA02", "EMKAA01", "EMKAD01", "EMKAS07", "EMABD01", 
    "EMABU12", "EMKAW03", "EMKAW04", "EMKES02", "EMKHA02", "EMKHA05", 
    "EMKHA08", "EMKHU01", "EMKIW01", "EMKOU01", "EMKRA01", "EMKRA02", 
    "EMLAH01", "EMLAY01", "EMACH02", "EMMAR02", "EMMEN01", "EMMOH04", 
    "EMACH03", "EMMOU02", "EMMUH01", "EMMUS01", "EMNAJ02", "EMNAM01", 
    "EMNAS02", "EMNAS03", "EMNAS11", "EMNAS15", "EMNOU01", "EMNOU03", 
    "EMOBE01", "EMOKA01", "EMOMR01", "EMONS01", "EMADE01", "EMOUK02", 
    "EMPAD01", "EMPRE01", "EMQAM01", "EMRAH01", "EMRAH04", "EMADN01", 
    "EMRES01", "EMRID02", "EMRIH02", "EMRME01", "EMSAA03", "EMSAF01", 
    "EMSAL01", "EMSAL06", "EMSAL08", "EMSAM04", "EMSAT01", "EMSAY01", 
    "EMSBE02", "EMSHA04", "EMSHA08", "EMSHA09", "EMSHE02", "EMSHE04", 
    "EMSHI01", "EMSHI02", "EMSHO01", "EMSHO03", "EMSHR01", "EMAHM01", 
    "EMSKA01", "EMSKA02", "EMSKA03", "EMSRE01", "EMSUN01", "EMSUS01", 
    "EMABD05", "EMAHM02", "EMTAH03", "EMTAH05", "EMTAK01", "EMTAN02", 
    "EMTAO01", "EMTAR01", "EMUMA01", "EMUME01", "EMVAR01", "EMWAI01", 
    "EMWAQ01", "EMAKI04", "EMWEH01", "EMYAD02", "EMYOU01", "EMYOU04", 
    "EMYOU06", "EMYOU07", "EMZAH02", "EMALA01", "EMZAK01", "EMZAL01", 
    "GMFOU01", "GMFOU02", "GMFOU03", "GMFOU04", "GMFOU05", "GMFOU06", 
    "GMFOU07", "GMFOU08", "GMFOU09", "GMFOU10", "EMKAS08", "EMKHA09", 
    "EMFAT01", "EMACH05", "EMMER04", "EMABA03", "EMALB02", "EMFAZ01", 
    "EMHAM14", "EMHAM15", "EMESM01", "EMWIZ01", "EMMOH05", "EMDAH03", 
    "EMALZ02", "EMALD02", "EMKAW05", "EMELM01", "EMDEM02", "EMABD09", 
    "EMALI10", "EMALG01", "EMKAR03", "EMAHM03", "EMZEI06", "EMARI01", 
    "EMRAM03", "EMMAK02", "EMIMR03", "EMHUS02", "EMJAW03", "EMISS03", 
    "EMMOS01", "EMDAR04", "EMTAH06", "EMYAS03", "EMAKA01", "EMABD06", 
    "EMNAS17", "EMTAH07", "EMBOU01", "EMZAH05", "EMALK06", "EMBAY02", 
    "EMELA05", "EMSEB01", "EMALH04", "EMGHA17", "EMZAH01", "EMKOU02", 
    "EMBOU02", "EMAYA02", "EMSAL09", "EMALI01", "EMMOH01", "EMALH05", 
    "EMABU14", "EMHAY03", "EMHOT01", "EMNEH01", "EMEL-07", "EMFAK08", 
    "EMGHA18", "EMGHA19", "EMTAL02", "EMAHM04", "EMLAH03", "EMSLI01", 
    "EMRAH05", "EMPUL01", "EMALI05", "EMHIJ03", "EMFAR13", "EMYAM01", 
    "EMISM02", "EMFLA04", "EMMAL01", "EMHOU04", "EMALI11", "EMHAM17", 
    "EMHAM18", "EMALI06", "EMSAY03", "EMATW08", "EMABE02", "EMSAM05", 
    "EMBIT03", "EMHOB09", "EMALA07", "EMDEE12", "EMALI09", "EMSAL10", 
    "EMZAH06", "EMBIT04", "EMMES02", "EMHAC02", "EMSHA10", "EMDEE13", 
    "EMKAI01", "EMSHA11", "EMAHM05", "EMKAM02", "EMISM03", "EMKAW06", 
    "EMBIT05", "EMHAW05", "EMHUN01", "EMBOR01", "EMCHE03", "EMHMA04", 
    "EMAYO05", "EMNAJ03", "EMBIL01", "EMKEN02", "EMNAS19", "EMSAG01", 
    "EMAHM06", "EMABU15", "EMALK04", "EMSHA12", "EMYOU08", "EMYOU09", 
    "EMALR01", "EMFTO03", "EMALS13", "EMKHR02", "EMABU16", "EMMAN04", 
    "EMABD07", "EMALK05", "EMMER05", "EMALN01", "EMIBR03", "EMISM04", 
    "EMKRA03", "EMEL-08", "EMYAS04", "EMTAH08", "EMJAR08", "EMALL01", 
    "EMKAS09", "EMSAL12", "EMHAS04", "EMALS14", "EMAJA01", "EMNAS20", 
    "EMSAL13", "EMMER06", "EMALM03", "EMELS04", "EMALM06", "EMALM04", 
    "EMALS04", "EMALS05", "EMALS07", "EMALS08", "EMALS09", "EMALS10", 
    "EMANG01", "EMARU01", "EMARU02", "EMASK02", "EMABE01", "EMATM01", 
    "EMATW01", "EMATW03", "EMAWA03", "EMAWA05", "EMAWA06", "EMAYO02", 
    "EMABO01", "EMAYO03", "EMAYO04", "EMAZI02", "EMBAC03", "EMBAR01", 
    "EMBAR02", "EMBAR04", "EMABO03", "EMBAY01", "EMBER01", "EMBIN01", 
    "EMBIT02", "EMCHA01", "EMCHO01", "EMCHO02"
    // Continue for all other employee numbers if needed...
];

function generateDates(startDate, numberOfDays) {
    const dates = [];
    
    for (let i = 0; i < numberOfDays; i++) {
        // Generate the first timestamp for the day
        let morningTime = new Date(startDate);
        morningTime.setDate(startDate.getDate() + i);
        morningTime.setHours(9, 0, 0); // Set time to 09:00
        dates.push(morningTime.toISOString().slice(0, 16)); // Store date in the required format

        // Generate the second timestamp for the day
        let afternoonTime = new Date(startDate);
        afternoonTime.setDate(startDate.getDate() + i);
        afternoonTime.setHours(14, 0, 0); // Set time to 14:00
        dates.push(afternoonTime.toISOString().slice(0, 16)); // Store date in the required format
    }

    return dates;
}

// Example usage:
const startDate = new Date("2025-03-01");
const numberOfDays = 150; // Adjust the number of days as needed
const dates = generateDates(startDate, numberOfDays);

function insertSequentialData() {
    for (let i = 0; i < employeeNumbers.length; i++) {
        const employee_num = employeeNumbers[i];
        
        // Insert two records for each employee number using the dates generated
        for (let j = 0; j < dates.length; j++) {
            const log_date = dates[j];  
            const device_desc = faker.commerce.productName(); // Random device description
            const process_status = "Unprocessed";
            const ohrm_id = faker.datatype.number({ min: 1, max: 1000 }); // Random OHRM ID

            db.run(
                `INSERT INTO addData (employee_num, log_date, device_desc, process_status, ohrm_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [employee_num, log_date, device_desc, process_status, ohrm_id],
                function (err) {
                    if (err) {
                        console.error("Error inserting data:", err.message);
                    } else {
                        console.log("Inserted data with ID:", this.lastID);
                    }
                }
            );
        }
    }
}

// Call this function to insert data
insertSequentialData();



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
