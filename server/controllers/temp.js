// const fs = require('fs');
// const XLSX = require("xlsx");
// fs.readdir('../static/', (err, files) => {
//     console.log(files)
//     files.forEach(file => {
//         console.log(file);
//     });
// });
// fs.readFile('../static/' + '4589f200-97dc-4e97-b1d4-0fc930f7b1be.xls', function(err, buffer){
//     if (err) reject(err.message)
//     console.log()
//     const wb = XLSX.read(buffer, { type: "buffer" });
//     const wsname = wb.SheetNames[0];
//     const ws = wb.Sheets[wsname];
//     const data = XLSX.utils.sheet_to_json(ws);
//     console.log(data);
// })