import {$authHost, $host} from './index'

export const fetchContract = async () => {
    const {data} = await $authHost.get('api/contracts/info')
    return data
}