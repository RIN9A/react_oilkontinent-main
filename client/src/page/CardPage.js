import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {fetchOneCard} from "../http/cardsAPI";
import Header from "../components/Header";
import Transactions from "../modules/Transactions";

const CardPage = () => {
    const [note, setNote] = useState({})
    const {id} = useParams()
    useEffect(() => {
        fetchOneCard(id).then(data => setNote(data))
    }, [])
    return (
        <>
            <Header title={`Транзакции по карте ${id}`}  />
            <Transactions cardNumber={id}/>
        </>
    );
};

export default CardPage;