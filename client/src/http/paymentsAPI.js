import {$authHost} from './index'

export const createPayment = async (payment) => {
    const {data} = await $authHost.post('api/payments', payment)
    return data
}
export const fetchPayments = async () => {
    const {data} = await $authHost.get('api/payments')
    return data
}