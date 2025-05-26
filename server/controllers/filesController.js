const {File} = require("../models/models")
const ApiError = require('../error/ApiError')
const {getInfoJWT, isAdmin} = require("../utils/helpers")
const XLSX = require("xlsx");
const fs = require('fs')
const sequelize = require("../db");
const {repeatValues} = require("./helpers/filesContollerHelper");
path = require('path')

function toValidDatetime(date){
    if (!date) return 'null'
    const [day, month, year] = date.split('.')

    return `'${year}-${month}-${day}'`
}
const readExcel = async (file) => {
    return new Promise(async (resolve, reject) => {
        fs.readFile('static/' + file.filename, function(err, buffer){
            if (err) {
                console.log(err.message)
                reject(err.message)
                return
            }
            const wb = XLSX.read(buffer, { type: "buffer" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);


            const queryValues = data.slice(2).reduce((acc,row) => {
                if (!row.__EMPTY_8?.trim()) return acc + ''

                return acc +
                    `('${row.__EMPTY_4.replaceAll("'", '"') }',` +
                    `'${row.__EMPTY_6 }',` +
                    `'${row.__EMPTY_7 }',` +
                    `'${row.__EMPTY_8.replaceAll("'", '"') }',` +
                    `'${row.__EMPTY_9.replaceAll("'", '"') }',` +
                     `${row.__EMPTY_15 ? row.__EMPTY_15 : 'null' },` +
                     `${toValidDatetime(row.__EMPTY_16)},` +
                     `${row.__EMPTY_17 ? row.__EMPTY_17 : 'null' },` +
                     `${toValidDatetime(row.__EMPTY_18)},` +
                     `${row.__EMPTY_19 ? row.__EMPTY_19 : 'null' },` +
                     `${toValidDatetime(row.__EMPTY_20)},` +
                     `${row.__EMPTY_21 ? row.__EMPTY_21 : 'null' },` +
                     `${toValidDatetime(row.__EMPTY_22)}, DEFAULT, CURRENT_TIMESTAMP + interval '5 hours'),`
            }, '').slice(0, -1)

            sequelize.query('INSERT INTO public."AZSCosts"(' +
                'terminals, region, city, address, brand, ai92, ai92_date, ai95, ai95_date, dt, dt_date, spbt, spbt_date, id, "updatedAt") ' +
                'VALUES' + queryValues +
                ' ON CONFLICT (address, terminals) DO UPDATE ' +
                'SET ' +
                    'ai92      = excluded.ai92,' +
                    'ai95      = excluded.ai95,' +
                    'dt        = excluded.dt,' +
                    'spbt      = excluded.spbt,' +
                    'ai92_date = excluded.ai92_date,' +
                    'ai95_date = excluded.ai95_date,' +
                    'dt_date   = excluded.dt_date,' +
                    'spbt_date = excluded.spbt_date,' +
                   '"updatedAt"= CURRENT_TIMESTAMP  + interval \'5 hours\';'
            ).then(async () => {
                const [AZSes] = await sequelize.query(`
                    SELECT 
                        jsonb_object_agg(id, json_build_object(\'terminals\', terminals, \'updatedAt\', "updatedAt")) as "matches", 
                        address,
                        city, 
                        brand
                    FROM "AZSCosts" 
                    GROUP BY address, city, brand HAVING COUNT(*) > 1;
                `)

                for (let azs of AZSes)
                    for (let [updatedAt, terminals] of repeatValues(azs.matches))
                        await sequelize.query(`DELETE FROM "AZSCosts" WHERE "updatedAt" = '${updatedAt}' AND terminals='${terminals}'`)

                return resolve('ppr file successfully updated')
            }).catch((e) => {
                resolve(e.message)
            })
        })
    });
};

class filesController {

    async createPPRXLS(req, res, next) {
        try{
            const { form } = req.body

            console.log(req.files)
            const {id} = getInfoJWT(req.headers)

            const files = []
            for(let file of req.files){
                // Если надо будет оригинальное имя
                //originalname: 'vlcsnap-2021-03-03-20h20m11s729.png'
                try{
                    const new_file = await File.create({form, filepath: file.filename, userId: id})
                    files.push(new_file)
                }
                catch(e){
                    console.log(e)
                    return {message: 'Ошибка при сохранении файла в базу данных'}
                }

                try{
                    const result = await readExcel(file)
                    return res.json({message: result})
                }
                catch(e){
                    console.log(e.message)
                }
            }
            return res.json({...files, message: 'Файл не был обработан. Причина в логах'})
        }
        catch(e){
            next(ApiError.badRequest('Что-то пошло не так: ' + e.message))
        }
    }
    async create(req, res, next) {
        try{
            const files = []
            for(let file of req.files){
                // Если надо будет оригинальное имя
                //originalname: 'vlcsnap-2021-03-03-20h20m11s729.png'
                const new_file = await File.create({noteId, filepath: file.filename})
                files.push(new_file)
            }
            return res.json(files)
        }
        catch(e){
            next(ApiError.badRequest('Что-то пошло не так'))
        }
    }
    async update(req, res) {
        if (!isAdmin(req)) return res.json({message: 'У вас недостаточно прав'})
        const {filename} = req.body
        const {id} = req.params


        await sequelize.query(`UPDATE files SET filename='${filename}' WHERE id = ${id}`)
    }
    async getAll(req, res) {
        const files = await File.findAll()
        return res.json(files)
    }
    async getOne(req, res) {

    }
}

module.exports = new filesController()