import * as fs from 'fs/promises'; 
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
    console.error('CSVファイルのパスを引数に設定してください。');
    process.exit(1);
}

rl.question('Attributesを記入しているのは何列目からですか？一番最初の列を0番とします。', async (attributeFieldsStartIndex) => {
    rl.close();
    try {
        let csvData = await fs.readFile(csvFilePath, 'utf8');

        // 不可視文字を検出し、ログに出力
        const invisCharsRegex = /[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\ufff9-\ufffb]/g;
        let match;
        while ((match = invisCharsRegex.exec(csvData)) !== null) {
            console.log(`不可視文字 ${match[0]} が位置 ${match.index} で検出されました。`);
        }

        // 不可視文字を削除
        csvData = csvData.replace(invisCharsRegex, '');

        const jsonMetadata = csvToJson(csvData, Number(attributeFieldsStartIndex));
        const outputDir = path.join(path.dirname(csvFilePath), path.basename(csvFilePath, '.csv'));
        await fs.mkdir(outputDir, { recursive: true });
        await Promise.all(jsonMetadata.map((metadata, index) => {
            const outputPath = path.join(outputDir, `${index + 1}`);
            return fs.writeFile(outputPath, JSON.stringify(metadata, null, 2));
        }));
        console.log(`出力されました。パス: ${outputDir}`);
    } catch (err) {
        console.error('エラー: CSVファイルの処理で問題がありました。', err);
    }
});
