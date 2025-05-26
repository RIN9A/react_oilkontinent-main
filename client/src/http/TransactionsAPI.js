import {$authHost} from './index'

export const createTransaction = async (transactions) => {
    const {data} = await $authHost.post('api/transactions', transactions)
    return data
}
export const fetchTransactions = async (filter, cardNumber) => {
    const filterDateFrom = filter.filterDateFrom || null
    const filterDateTo = filter.filterDateTo || null
    const filterSort = filter.filterSort || null
    const filterOil = filter.filterOil || null
    const card = cardNumber || null

    const {data} = await $authHost.get('api/transactions', { params: {filterDateFrom, filterDateTo, filterSort, filterOil, card}})
    return data
}
export const fetchOneTransaction = async (id) => {
    const {data} = await $authHost.get('api/transactions/' + id)
    return data
}
export const fetchTempTransactions = async () => {
    const {data} = await $authHost.get('api/transactions/temp')
    return data
}