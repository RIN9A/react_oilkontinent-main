import {$authHost, $host} from './index'
import jwtDecode from "jwt-decode";

export const registration = async (formData) => {
    const { data } = await $authHost.post('api/user/registration', formData)
    return data
}
export const fetchUsers = async () => {
    return await $authHost.post('api/user/users')
}
export const fetchUser = async (id) => {
    const {data} = await $authHost.post('api/user/' + id)
    return data
}

export const fetchDrivers = async() => {
    return await $authHost.get('api/user/drivers');
}
export const updateUser = async (id, fields) => {
    const {data} = await $authHost.post('api/user/update/' + id, {fields})
    return data
}
export const updatePassword = async (password) => {
    const {message} = await $authHost.post('api/user/password', {password})
    return message
}
export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}
export const check = async () => {
    const {data} = await $authHost.post('api/user/auth')
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const balance = async () => {
    const {data} = await $authHost.post('api/user/balance')
    return  data
}
