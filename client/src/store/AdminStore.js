import {makeAutoObservable} from "mobx";

export default class AdminStore {
    constructor() {
        makeAutoObservable(this)
    }
    setTempTransactions(transactions) {
    }
    get noteFoundPlaces() {
    }
    get tempTransactions() {
    }
}