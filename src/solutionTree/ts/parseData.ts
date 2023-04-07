// import fs from 'fs';

// import * as readline from 'readline';


// export function readCsvFile(way: string): Promise<string[]> {
//     return new Promise<string[]>((resolve, reject) => {
//         const fileStream = fs.createReadStream(way);
//         const lines: string[] = [];
//         const rl = readline.createInterface({
//         input: fileStream,
//         crlfDelay: Infinity
//         });
    
//         rl.on('line', (line) => {
//         lines.push(line);
//         });
    
//         rl.on('close', () => {
//         resolve(lines);
//         });
    
//         rl.on('error', (err) => {
//         reject(err);
//         });
//     });
//     }
