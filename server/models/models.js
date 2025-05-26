const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: ''},
    inn: {type: DataTypes.STRING, defaultValue: ''},
    phoneNumber: {type: DataTypes.STRING, defaultValue: ''},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    permissions: {type: DataTypes.JSON, default: null}
}, {timestamps: false})

const File = sequelize.define('file', {
    id: {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    filepath: {type: DataTypes.STRING},
    filename: {type: DataTypes.STRING, defaultValue: null},
    form: {type: DataTypes.STRING}
})

const Card = sequelize.define('card', {
    number: {type: DataTypes.STRING, primaryKey: true},
    shadowNumber: {type: DataTypes.STRING, defaultValue: null},
    pin: {type: DataTypes.STRING, defaultValue: null},
    department: {type: DataTypes.SMALLINT},
    limits: {type: DataTypes.JSONB},
    userId: {type: DataTypes.BIGINT},
    // driverId: {type: DataTypes.BIGINT},
    holder: {type: DataTypes.STRING},
    supplier: {type: DataTypes.STRING},
    active: {type: DataTypes.BOOLEAN},
    limitsChanged: {type: DataTypes.DATE}   ,
    limitsSet: {type: DataTypes.DATE},
    entered: {type: DataTypes.DATE, defaultValue: null},
}, {timestamps: false})

const Contract = sequelize.define('contract', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, defaultValue: ''},
    costs: {type: DataTypes.JSONB},
    cards: {type: DataTypes.JSONB},
    department: {type: DataTypes.SMALLINT},
    dateStart : {type: DataTypes.DATE},
    dateEnd   : {type: DataTypes.DATE},
    amount    : {type: DataTypes.FLOAT},
    inUsed: {type: DataTypes.BOOLEAN, defaultValue: true}
}, {timestamps: false})

const Payment = sequelize.define('payment', {
    id:         {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    date:       {type: DataTypes.DATEONLY},
    department: {type: DataTypes.SMALLINT, allowNull: true},
    value:      {type: DataTypes.BIGINT},
}, {timestamps: false})

const Driver = sequelize.define('driver', {
    id:         {type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    name:       {type: DataTypes.STRING},
}, {timestamps: false})

const Transaction = sequelize.define('transaction', {
    date:       {type: DataTypes.DATE, allowNull: false, primaryKey: true},
    card:       {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    oil:        {type: DataTypes.STRING, allowNull: false},
    oilChanged: {type: DataTypes.STRING, allowNull: false},
    cost:       {type: DataTypes.FLOAT, allowNull: false},
    costAZS:    {type: DataTypes.FLOAT, allowNull: false},
    value:      {type: DataTypes.FLOAT, allowNull: false},
    station:    {type: DataTypes.STRING, allowNull: false},
    company:    {type: DataTypes.STRING, allowNull: false},
    userId:     {type: DataTypes.BIGINT, allowNull: false},
    department: {type: DataTypes.SMALLINT, allowNull: true },
    dateAdded:  {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
}, {timestamps: false})

const TempTransaction = sequelize.define('tempTransaction', {
    date:       {type: DataTypes.DATE,    allowNull: false, primaryKey: true},
    card:       {type: DataTypes.STRING,  allowNull: false, primaryKey: true},
    station:    {type: DataTypes.STRING,  allowNull: false},
    value:      {type: DataTypes.FLOAT,  allowNull: false},
    dateAdded:  {type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW},
}, {timestamps: false})

const AZSCost = sequelize.define('AZSCost', {
    address:    {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    terminals:  {type: DataTypes.STRING, allowNull: false, primaryKey: true},
    station:    {type: DataTypes.STRING, allowNull: false},
    region:     {type: DataTypes.STRING, allowNull: false},
    city:       {type: DataTypes.STRING, allowNull: false},
    brand:      {type: DataTypes.STRING, allowNull: false},
    ai92:       {type: DataTypes.FLOAT,    allowNull: true},
    ai92_date:  {type: DataTypes.DATEONLY, allowNull: true},
    ai95:       {type: DataTypes.FLOAT,    allowNull: true},
    ai95_date:  {type: DataTypes.DATEONLY, allowNull: true},
    dt:         {type: DataTypes.FLOAT,    allowNull: true},
    dt_date:    {type: DataTypes.DATEONLY, allowNull: true},
    spbt:       {type: DataTypes.FLOAT,    allowNull: true},
    spbt_date:  {type: DataTypes.DATEONLY, allowNull: true}
}, {timestamps: false})



User.hasMany(Contract)
Contract.belongsTo(User)

User.hasMany(Payment)
Payment.belongsTo(User)

User.hasMany(File)
File.belongsTo(User)

User.hasMany(Driver)
Driver.belongsTo(User)

module.exports = {
    User, Card, Contract, Payment, Driver, Transaction, File, AZSCost, TempTransaction
}
