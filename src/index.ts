import * as fs from 'fs';
import * as readline from 'readline';
import Papa from 'papaparse';
import * as path from 'path';

interface Attribute {
    trait_type: string;
    value: string;
}

interface Metadata {
    [key: string]: string | Attribute[];
}

function csvToJson(csv: string, attributeFieldsStartIndex: number): Metadata[] {
    const results: Metadata[] = [];
    Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (result: Papa.ParseResult<{ [key: string]: string }>) => {
            const headers = result.meta.fields as string[];
            result.data.forEach((row: { [key: string]: string }) => {
                const metadata: Metadata = {};
                const attributes: Attribute[] = [];
                headers.forEach((header, index) => {
                    if (index < attributeFieldsStartIndex) {
                        metadata[header] = row[header];
                    } else {
                        attributes.push({
                            trait_type: header,
                            value: row[header]
                        });
                    }
                });
                if (attributes.length > 0) {
                    metadata['attributes'] = attributes;
                }
                results.push(metadata);
            });
        }
    });
    return results;
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const csvFilePath = process.argv[2];

if (!csvFilePath) {
    console.error('Please provide the path to the CSV file as a command line argument.');
    process.exit(1);
}

rl.question('Enter the column index where the attributeFields start (0-based): ', (attributeFieldsStartIndex) => {
    rl.close();
    fs.readFile(csvFilePath, 'utf8', (err, csvData) => {
        if (err) {
            console.error('Failed to read CSV file:', err);
            return;
        }
        const jsonMetadata = csvToJson(csvData, Number(attributeFieldsStartIndex));
        const outputPath = path.join(path.dirname(csvFilePath), 'output.json');
        fs.writeFile(outputPath, JSON.stringify(jsonMetadata, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Failed to write JSON file:', writeErr);
                return;
            }
            console.log(`JSON metadata has been written to ${outputPath}`);
        });
    });
});
