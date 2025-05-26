import React, {useEffect, useState} from 'react';
import Payment from "./Payment";
import {toMoney} from "../utils/helpers";
import {fetchPayments} from "../http/paymentsAPI";

const Payments = () => {

    const [payments, setPayments] = useState(null)
    const [paymentsSum, setPaymentsSum] = useState(null)
    let odd = false

    useEffect(() => {
        fetchPayments().then(payments => {
            let sum = 0
            payments.map(payment => sum += +payment.value)
            setPaymentsSum(sum)
            setPayments(payments)
        })
    }, [])

    return (
        <div className='payments'>

            {/*<div className="form-field" style={{marginBottom: 30}}>*/}
            {/*    <label className="form__label">*/}
            {/*        № п/п*/}
            {/*    </label>*/}
            {/*    <div className="form-input">*/}
            {/*        <svg width="18" height="19" viewBox="0 0 18 19" fill="none"*/}
            {/*             xmlns="http://www.w3.org/2000/svg">*/}
            {/*            <circle cx="7" cy="7" r="6.5" stroke="#373737"></circle>*/}
            {/*            <path d="M11.5 12L17.5 18" stroke="#373737"></path>*/}
            {/*        </svg>*/}
            {/*        <input autoComplete="off" type="text" placeholder="" className="input input-search"/>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className="payment__top">
                <h6 className="payment__subtitle">
                    Сумма пополнений
                </h6>
                <span className="payment__amount">
                    {payments ? toMoney(paymentsSum) : 'Loading...' }
                </span>
            </div>

            <div>
                {
                    payments
                        ? payments.map(payment => {
                            odd = !odd
                            return <Payment key={payment.id} odd={odd} payment={payment}/>
                        })
                        : <div>Loading...</div>
                }
            </div>
        </div>
    );
};

export default Payments;