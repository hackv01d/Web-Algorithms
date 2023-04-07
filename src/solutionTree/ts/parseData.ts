// import fs from 'fs';
// import csvParser from 'csv-parser';
// import * as readline from 'readline';

// let separatorSymbol = ","; // добавить выбор между , и ;



// export function parseCsv(way: string) : string[][]{
//     const results: string[][] = [];

//     fs.createReadStream(way)
//         .pipe(csvParser({ separator: separatorSymbol}))
//         .on('data', (row: string[]) => {
//             results.push(row);
//           })
//         .on('end', () => { return results;
//         });
//         return results;
    
//     }
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
// // export async function parseCsv(way: string, separatorSymbol: string) : Promise<string[][]>{
// //     const results: string[][] = [];

// //     return new Promise((resolve, reject) => {
// //         fs.createReadStream(way)
// //             .pipe(csvParser({ separator: separatorSymbol}))
// //             .on('data', (it) => results.push(it))
// //             .on('end', () => {
// //                 console.log(results);
// //                 resolve(results);
// //             })
// //             .on('error', (err) => {
// //                 reject(err);
// //             });
// //     });
// // }