import {makeAutoObservable} from "mobx";

export default class TransactionsStore {
    constructor() {
        this._transactions = []
        makeAutoObservable(this)
    }
    setFilter(filter) {
        this._filter = filter
        console.log(filter)
    }
    setTransactions(transactions) {
        this._transactions= transactions
    }
    get all() {
        return this._transactions
    }
    get filter() {
        return this._filter
    }
}