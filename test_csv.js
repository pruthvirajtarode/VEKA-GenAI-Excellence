const fs = require('fs');

const DataEngine = class {
    parseCSV(csvText) {
        let lines = csvText.trim().split('\n');
        
        while (lines.length > 0 && (!lines[0].includes(',') || lines[0].includes('SYNTHETIC TRAINING DATA'))) {
            lines.shift();
        }
        
        if (lines.length === 0) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });
            rows.push(row);
        }
        
        return { headers, rows };
    }
}

const engine = new DataEngine();
const csvText = fs.readFileSync('data/synthetic/maintenance-log.csv', 'utf8');
const parsed = engine.parseCSV(csvText);
console.log('Headers:', parsed.headers);
console.log('First row:', parsed.rows[0]);
console.log('Total rows:', parsed.rows.length);
