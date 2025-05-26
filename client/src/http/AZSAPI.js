import {$authHost} from "./index";

export const fetchAZS = async (inputValue) => {
    const {data} = await $authHost.get('api/azs', { params: {inputValue}})
    return data
}
export const searchAZS = async (inputValue) => {
    const {data} = await $authHost.get('api/azs/search', { params: {inputValue}})
    return data
}
export const fetchRelatedAZS = async (inputValue) => {
    const {data} = await $authHost.get('api/azs/related', {params: {inputValue}})
    return data
}

export const createAZS = async(body) => {
    const {data} = await $authHost.post('/api/azs/new', body);
    return data;
}
export const updateAZS = async (AZSId, bankAddress) => {
    const {data} = await $authHost.post('api/azs', { AZSId, bankAddress })
    return data
}

export const updatePricesAZS = async(AZSId, editedPrices) => {
    const {data} = await $authHost.put('/api/azs', {AZSId, editedPrices});
    return data;
}