
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;

        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }

        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    }
}
function toMoney(value){
    if (!value) return '0,00 ₽'
    value = Math.round(value * 100)
    const fractional = Math.abs(Math.floor(value % 100))
    const integer = (Math.floor(value / 100)).toString()

    let result = ''
    for (let i = 0; i < integer.length; i++) {
        result = integer.at(-i -1) + (i % 3 === 0 && i ? ' ': '') + result
    }

    return result + ',' + fractional + ' ₽'
}
function firstMonthDay(){
    const date = new Date()
    const year = date.getFullYear()
    const month = addZeroLeft(date.getMonth() + 1)
    return `${year}-${month}-01`
}
function lastMonthDay(){
    const date = new Date()
    const year = date.getFullYear()
    const month = addZeroLeft(date.getMonth() + 1)
    const day = addZeroLeft(new Date(year, +month, 0).getDate())
    return `${year}-${month}-${day}`
}
function addZeroLeft(date){
    date = date.toString()
    if (date.length == 1) return '0' + date
    else return date
}

function floatDev(event){
    const value = event.target.value.replace(/[^0-9.]/g, '');

    let newValue = ''
    let havePoint = false
    for(let char of value){
        if (char === '.' && !havePoint){
            newValue += char
            havePoint = true
        }
        else if(char !== '.'){
            newValue += char
        }
    }

    if (newValue)
        if (newValue[0] == '.') newValue = '0' + newValue

    return newValue
}

module.exports = {
    toMoney,
    firstMonthDay,
    lastMonthDay,
    debounce,
    floatDev
}