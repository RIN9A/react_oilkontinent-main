import {makeAutoObservable} from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._balance = 0

        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }
    setUser(user) {
        this._user = user
    }
    setBalance(balance) {
        this._balance = balance
    }
    get isAuth() {
        return this._isAuth
    }
    get user() {
        return this._user
    }
    get balance() {
        return this._balance
    }
}