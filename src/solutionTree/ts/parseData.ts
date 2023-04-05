import fs from 'fs';
import csvParser from 'csv-parser';

let separatorSymbol = ","; // добавить выбор между , и ;



export function parseCsv(way: string) : string[]{
    const results: string[] = [];

    fs.createReadStream(way)
        .pipe(csvParser({ separator: separatorSymbol}))
        .on('data', (it) => results.push(it))
        .on('end', () => {
        console.log(results);
        });

    return results;
} 


// добавить функцию, которая принимает строку для парса пути до targetValue