import React from 'react';
import {toMoney} from "../utils/helpers";

const Payment = ({payment, odd}) => {
    const isPositive = payment.value > 0
    return (
        <div className={'payment__row ' + (odd && 'odd')}>
            <h6 className="payment__subtitle">
                {
                    isPositive
                    ? 'Пополнение'
                    : 'Вывод'
                }
            </h6>
            <span className='payment__date'>
                {payment.date}
            </span>
            <span className={'payment__amount + ' + (isPositive ? 'payment__amount-green' : 'payment__amount-red')}>
                {toMoney(payment.value)}
            </span>
        </div>
    );
};

export default Payment;