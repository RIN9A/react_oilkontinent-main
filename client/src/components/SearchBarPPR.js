import React, {useEffect, useRef, useState} from 'react';
import {fetchAZS, updateAZS} from "../http/AZSAPI";
import {observer} from "mobx-react-lite";

const SearchBarPPR = observer(({address, countMatches, azs=null, changed}) => {
    const [input, setInput] = useState(azs?.address || '')
    const [chosen, setChosen] = useState(false)
    const [results, setResults] = useState([])

    const isMounted = useRef(false);

    useEffect(() => {
        if (isMounted.current){
            fetchAZS(input).then(data => setResults(data))
        } else {
            isMounted.current = true;
        }
    }, [input])

    const handleClick = (target) => {
        setInput(target.innerText )
        setChosen(target.dataset.id)
        setResults([])
    }
    const saveDecision = () => {
        updateAZS(chosen, address).then(data => {
            alert(data?.message)
            if (data.finished)
                changed(chosen)
        })

        setChosen(false)
    }

    return (
        <div className='gray-bordered tempTransactionsBlock'>
            <p>{address} {countMatches && <>({countMatches} шт.)</>}</p>
            <div style={{position: 'relative', display: 'flex', gap: 10}}>
                <input
                    className={`inputAZS ${results.length > 0 && 'active'}`}
                    type="text" value={input} onChange={e => setInput(e.target.value)}
                />
                {
                    results.length > 0 &&
                    <div className='azs_list'>
                        {results.map(azs =>
                            <div
                                key={azs.id}
                                data-id={azs.id}
                                onClick={e => handleClick(e.currentTarget)}>{azs.address}, {azs.city}, {azs.brand}
                            </div>)}
                    </div>
                }
                {
                    chosen &&
                        <button className='tempTransactionsButton' onClick={saveDecision}>Сохранить</button>
                }
            </div>

        </div>
    );
});

export default SearchBarPPR;