import React, {useContext, useEffect, useState} from 'react';
import RowTransaction from "../components/Tables/RowTransaction";
import {Context} from "../index";
import {fetchTransactions} from "../http/TransactionsAPI";
import {observer} from "mobx-react-lite";
import Table from "../components/Table";
import Title from "../components/Title";
import FilterTransactions from "../components/FilterTransactions";
import exportXLSX from "../utils/exportXLSX";

const Transactions = observer(({title, cardNumber=null}) => {
    const {transactions} = useContext(Context)
    const [excelTransactions, setExcelTransactions] = useState([])
    const [filter, setFilter] = useState({})

    const loadTransactions = (currentFilter) => {
        fetchTransactions(currentFilter, cardNumber).then(data => {
            transactions.setTransactions(data)

            const eXtransactions = [['№ карты', 'Дата заправки', 'АЗС', 'Марка бензина', 'Цена, л', 'Литраж', 'Сумма']]
            for (let transaction of data){
                eXtransactions.push([
                    transaction.card,
                    transaction.date,
                    transaction.station,
                    transaction.oilChanged,
                    transaction.cost,
                    transaction.value,
                    Math.round(transaction.value * transaction.cost * 100) / 100
                ])
            }
            setExcelTransactions(eXtransactions)
        })
    }

    // Load initial data
    useEffect(() => {
        loadTransactions({})
    }, [])

    // Handle filter changes
    useEffect(() => {
        if (Object.keys(filter).length) {
            loadTransactions(filter)
        }
    }, [filter])

    return (
        <div>
            {title && <Title title={title}/> }
            {<FilterTransactions setFilter={setFilter} download={() => {
                exportXLSX(excelTransactions)
            }}/>}

            {transactions.all.length > 0 ?
                <Table
                    rowComponent={<RowTransaction/>}
                    rows={transactions.all}
                    headers={['№ карты','Дата заправки', 'АЗС', 'Марка бензина', 'Цена, л', 'Литраж', 'Сумма']}
                />
                :
                <div style={{margin: '20px auto'}}>Транзакций нет</div>
            }
        </div>
    );
});

export default Transactions;