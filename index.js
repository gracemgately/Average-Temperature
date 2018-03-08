const parse = require('csv-parse');
const fs = require('fs');
const transform = require('stream-transform');

const fileToRead = fs.createReadStream('NNDC__03_08_18.txt'); 

const parser = parse({delimiter: ','});
parser.on('error', (err) => console.error(err));

class parseAndFindAverageTemp{
    constructor(){
        this.numRecords = 0;
        this.total = 0;
    }
    addToRecords(record){
        if (!isNaN(Number(record))) {
            this.total += Number(record);
            this.numRecords++; 
        }
    }
    getAverageTemp(){
        return this.total / this.numRecords;
    }
}

const recordsAndAverageTemp = new parseAndFindAverageTemp();

const transformer = transform((record) => recordsAndAverageTemp.addToRecords(record[3]), {parallel: 10});
transformer.on('error', (err) => console.error(err));

const stream = fileToRead.pipe(parser).pipe(transformer);
stream.on('finish', () => console.log(recordsAndAverageTemp.getAverageTemp()));

