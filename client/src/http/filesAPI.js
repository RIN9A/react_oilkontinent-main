import {$authHost} from "./index";

export const updateFile = async (id, filename) => {
    const {data} = await $authHost.post(`api/file/update/${id}`, {filename})
    return data
}
export const createFiles = async (formData, filename) => {
    const {data} = await $authHost.post(`api/file/create/${filename}`, formData)
    return data
}