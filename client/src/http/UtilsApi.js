import {$authHost, $host} from './index'
import jwtDecode from "jwt-decode";

export const fetchCompanies = async () => {
    const {data} = await $authHost.get('/api/utils/companies');
    return data;
}

export const fetchDepartments = async () => {
    const {data} = await $authHost.get('/api/utils/departments');
    return data;
}