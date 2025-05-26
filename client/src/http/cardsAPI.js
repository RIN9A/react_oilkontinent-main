import {$authHost} from './index'

export const createCard = async (note) => {
    const {data} = await $authHost.post('api/cards', note)
    return data
}


export const numberCards = async () => {
    const {data} = await $authHost.get('/api/cards/number')
    return data;
}

export const updateCard = async (limitType, typeOil, limitDay, limitMonth, holder, cardNumber, validUntil) => {
    const {data} = await $authHost.post('api/cards/update', {limitType, typeOil, limitDay, limitMonth, cardNumber, holder, validUntil})
    return data
}
export const fetchCards = async (userId, like) => {
    const {data} = await $authHost.get('api/cards', { params: {userId, like}})
    return data
}
export const fetchOneCard = async (id) => {
    const {data} = await $authHost.get('api/cards/' + id)
    return data
}