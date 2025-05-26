import React, { useContext, useEffect, useState } from 'react';
import Header from "../components/Header";
import Transactions from "../modules/Transactions";
import { balance } from "../http/userAPI";
import { toMoney } from "../utils/helpers";
import { Context } from '../index';
import { numberCards } from '../http/cardsAPI';

const IndexPage = () => {
    const [uBalance, setUBalance] = useState('0');
    const [uAmount, setUAmount] = useState('0');
    const [uCountCards, setUCountCards] = useState('0');
    const [uCountDrivers, setUCountDrivers] = useState('0');

    const { user } = useContext(Context);
    const isDriver = user?.user?.permissions.role === "driver";
    useEffect(() => {
        // balance().then(data => {
        //     setUBalance(toMoney(data.balance))
        //     setUAmount(toMoney(data.amount))
        //     setUCountCards(data.countCards)
        //     setUCountDrivers(data.countDrivers)
        // })

        if(isDriver) {
            balance().then(data => {
                setUBalance(toMoney(data.balance))
                setUAmount(toMoney(data.amount))
            })
        }

        numberCards().then(data => {
            setUCountCards(data.countCards);
            setUCountDrivers(data.countDrivers);
        })
    }, [])

    return (
        <>
            <Header title='Главная' />
            <div className='dashboard'>
                <div className='dashboard__inner'>
                    {isDriver ?
                        <div className='dashboard__block'>
                            <h6 className='dashboard__title'>Баланс</h6>
                            <div className='dashboard__row'>
                                <div className='dashboard__col'>
                                    <div className='dashboard__item'>
                                        <div className='dashboard__text'>Доступные средства:</div>
                                        <div className='dashboard__value'>{uBalance}</div>
                                    </div>
                                    <div className='dashboard__item'>
                                        <div className='dashboard__text'>Остаток по договору:</div>
                                        <div className='dashboard__value'>{uAmount}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className='dashboard__block'>
                            <h6 className='dashboard__title'>Карты</h6>
                            <div className='dashboard__row'>
                                <div className='dashboard__col'>
                                    <div className='dashboard__item'>
                                        <div className='dashboard__text'>Всего карт: </div>
                                        <div className='dashboard__value'>{uCountCards}шт.</div>
                                    </div>
                                    <div className='dashboard__item'>
                                        <div className='dashboard__text'>Всего держателей: </div>
                                        <div className='dashboard__value'>{uCountDrivers}шт.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Transactions title='Последние транзакции' />
        </>
    );
};

export default IndexPage;