import {makeAutoObservable} from "mobx";

export default class CardsStore {
    constructor() {
        this._filter = []
        this._cards = []
        makeAutoObservable(this)
    }
    setFilter(filter) {
        this._filter = filter
        console.log(filter)
    }
    setCards(cards) {
        this._cards = cards
        console.log(cards)
    }
    get cards() {
        return this._cards
    }
    get filter() {
        return this._filter
    }
}