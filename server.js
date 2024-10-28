const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 5503;

app.use(express.static('public'));

// Route to get the parsed CSV data
app.get('/data', (req, res) => {
    let excelData = [];
    fs.createReadStream('sample.csv')
        .pipe(csv())
        .on('data', (row) => {
            // Ensure the row has a valid name and score (numeric)
            if (row.name && row.score && !isNaN(row.score)) {
                excelData.push({ name: row.name, score: parseInt(row.score, 10) });
            } else {
                console.error('Invalid row:', row); // Log invalid rows
            }
        })
        .on('end', () => {
            res.json(excelData); // Send valid data to the frontend
        });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
