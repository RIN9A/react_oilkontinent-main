import React, {useEffect, useState} from 'react';
import FileUpload from "../components/FileUpload";
import {fetchTempTransactions} from "../http/TransactionsAPI";
import Table from "../components/Table";
import RowTempTransaction from "../components/Tables/RowTempTransaction";
import Title from "../components/Title";
import SearchBarPPR from "../components/SearchBarPPR";
import Header from "../components/Header";

const Admin = () => {
    const [tempTransactions, setTempTransactions] = useState([])
    const [groupedTransactions, setGroupedTransactions] = useState([])
    const [updated, setUpdated] = useState(0)
    //
    useEffect(()=>{
        fetchTempTransactions().then(data => {
            setTempTransactions(data);

            const places = new Map()
            data.map(tr =>  {
                const {station} = tr

                if (places.has(station))
                    places.set(station, places.get(station) + 1)
                else
                    places.set(station, 1)
            });
            setGroupedTransactions([...places])
        })
    },[updated])

    return (
        <>
            <Header title='Админ панель'/>
            {/* <FileUpload text='Загрузите эксель заправки из ППР перенеся сюда файл' className='upload-xlsx-ppr gray-bordered' formName='xls-ppr' /> */}

            <div style={{margin: '40px 0'}}>
                { groupedTransactions.map((place, i) => <SearchBarPPR key={"station-"+i} address={place[0]} countMatches={place[1]} changed={setUpdated}/>)}
            </div>

            <Title title='Нераспределенные транзакции'/>
            <Table
                rows={tempTransactions}
                rowComponent={<RowTempTransaction/>}
                headers={['№ карты','Дата заправки', 'АЗС', 'Сумма']}
                style={{minWidth: 740}}
            />
        </>

    )
};

export default Admin;