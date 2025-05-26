const XLSX = require("xlsx");

export default function exportXLSX(data, filename='temp'){
    const now = new Date();
    const wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "kaidstor",
        Subject: "Отчёт",
        Author: "Kaidstor",
        CreatedDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
    };

    wb.SheetNames.push("Отчёт");
    wb.Sheets["Отчёт"] = XLSX.utils.aoa_to_sheet(data);
    // wb.Sheets["Отчёт"] = XLSX.utils.json_to_sheet(data);
    let objectMaxLength = [];

    const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

    for (let i = 0; i < data.length; i++) {
        let value = data[i];
        for (let j = 0; j < value.length; j++) {
            const cell = value[j];
            const number_val = Number(cell);
            if (!isNaN(cell) && cell && j != 0) {
                const position = letter[j] + (i + 1);
                wb.Sheets["Отчёт"][position] = {
                    t: 'n',
                    v: number_val,
                    s: { alignment: { horizontal: 'left' } }
                }
            }
            const cellStr = cell.toString()
            objectMaxLength[j] =
                objectMaxLength[j] >= cellStr.length ?
                    objectMaxLength[j] :
                    cellStr.length + 1;
        }
    }
    console.log(objectMaxLength)
    wb.Sheets["Отчёт"]["!cols"] = objectMaxLength.map(el => { return { wch: el } });
    XLSX.writeFile(wb, filename + '.xls');
}