const {toDBString} = require("../../utils/helpers");

function prepareTransactions(text){
    return text.split('\n').reduce((acc, transaction) => {
        if (!transaction) return acc + ''

        transaction = transaction.split('|')
        return acc +
           `(${transaction[0] ? toDBString(transaction[0])  : 'null'},` +   // date
            `${transaction[1] ? toDBString(transaction[1])  : 'null'},` +   // card
            `${transaction[2] ? toDBString(transaction[2])  : 'null'},` +   // oil
            `${transaction[3] ? toDBString(transaction[3])  : 'null'},` +   // oil changed
            `${transaction[4] ? transaction[4]              : 'null'},` +   // cost
            `${transaction[5] ? transaction[5]              : 'null'},` +   // cost AZS
            `${transaction[6] ? transaction[6]              : 'null'},` +   // value
            `${transaction[7] ? toDBString(transaction[7])  : 'null'},` +   // station
            `${transaction[8] ? toDBString(transaction[8])  : 'null'},` +   // company
            `${transaction[9] ? toDBString(transaction[9])  : 'null'},` +   // supplier
            `${transaction[10] ? transaction[10]            : 'null'}))`   // department
    },'').slice(0, -1)
}

module.exports = {
    prepareTransactions
}