import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._contracts = {}
        makeAutoObservable(this)
    }
    setContract(contracts) {
        this._contracts = contracts
    }
    get contract() {
        return this._contracts
    }
}