/**
 * VEKA GenAI Excellence - Data Engine
 * Manages the loading and querying of VEKA synthetic datasets
 */

class DataEngine {
    constructor() {
        this.datasets = {};
        this.loaded = false;
        
        // VEKA specific datasets based on the prompt
        this.registry = {
            'finance-ops': { url: 'data/synthetic/VEKA_FINANCE_OPERATIONS_TRAINING.csv', type: 'csv' },
            'production-maintenance': { url: 'data/synthetic/VEKA_PRODUCTION_MAINTENANCE_TRAINING.csv', type: 'csv' },
            'sales-distribution': { url: 'data/synthetic/VEKA_SALES_DISTRIBUTION_TRAINING.csv', type: 'csv' },
            'vendor-ledger': { url: 'data/synthetic/vendor-ledger.csv', type: 'csv' },
            'maintenance-log': { url: 'data/synthetic/maintenance-log.csv', type: 'csv' },
            'shift-notes': { url: 'data/synthetic/shift-notes.txt', type: 'txt' },
            'sales-buyer-profiles': { url: 'data/synthetic/sales-buyer-profiles.json', type: 'json' }
        };
    }

    async loadDataset(id) {
        if (this.datasets[id]) return this.datasets[id];
        
        const metadata = this.registry[id];
        if (!metadata) throw new Error(`Dataset ${id} not found in registry`);

        try {
            const response = await fetch(metadata.url);
            if (!response.ok) throw new Error(`Failed to fetch ${metadata.url}`);
            
            const text = await response.text();
            let parsedData = null;

            if (metadata.type === 'csv') {
                parsedData = this.parseCSV(text);
            } else if (metadata.type === 'json') {
                parsedData = JSON.parse(text);
            } else {
                parsedData = text; // text or unknown types
            }

            this.datasets[id] = {
                metadata,
                data: parsedData,
                raw: text
            };

            return this.datasets[id];
        } catch (e) {
            console.error(`Failed to load dataset ${id}`, e);
            throw e;
        }
    }

    parseCSV(csvText) {
        // Basic CSV parser
        let lines = csvText.trim().split('\n');
        
        // Skip warning banners at the top of the CSV file
        while (lines.length > 0 && (!lines[0].includes(',') || lines[0].includes('SYNTHETIC TRAINING DATA'))) {
            lines.shift();
        }
        
        if (lines.length === 0) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            // Simple split by comma (doesn't handle quotes properly, but sufficient for basic data)
            const values = lines[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });
            rows.push(row);
        }
        
        return { headers, rows };
    }

    getDataset(id) {
        return this.datasets[id] || null;
    }
}

window.dataEngine = new DataEngine();
