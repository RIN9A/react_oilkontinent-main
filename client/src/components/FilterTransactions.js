import React, {useContext, useEffect, useState} from 'react';
import Dropdown from "./Dropdown";
import Filter from "./Filter";
import {firstMonthDay, lastMonthDay} from "../utils/helpers";
import {fetchContract} from "../http/ContractsAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const FilterTransactions = observer(({setFilter, download}) => {
    const {contracts} = useContext(Context)

    const [oilTypes, setOilTypes] = useState([])
    const [activeDropdown, setActiveDropdown] = useState(null)

    const [filterDateFrom, setFilterDateFrom] = useState(firstMonthDay());
    const [filterDateTo, setFilterDateTo] = useState(lastMonthDay());
    const [filterSort, setFilterSort] = useState('Не выбрано');
    const [filterOil, setFilterOil] = useState('Не выбрано');

    useEffect(() => {
        if(activeDropdown) {
            activeDropdown.classList.remove('open')
            activeDropdown?.children[1]?.classList.remove('active')
            setActiveDropdown(null)
        }
        setFilter({filterDateFrom, filterDateTo, filterSort, filterOil})
    }, [filterDateFrom, filterDateTo, filterSort, filterOil])

   useEffect(() => {
    fetchContract().then(data => {
        contracts.setContract(data)
        console.log("Contracts", data)

        if (data && data.length > 0 && data[0].costs) {
            const oils = Object.keys(data[0].costs).filter(oil => oil !== 'discount');
            setOilTypes(oils)
        } else {
            setOilTypes([]); 
            console.warn("Нет доступных контрактов или поле 'costs' отсутствует.")
        }
    }).catch(err => {
        console.error("Ошибка при загрузке контрактов:", err)
    })
}, [])

    const setDateHandler = (from, value) => {
        if (from){
            if (new Date(value) > new Date(filterDateTo)){
                console.log('Значение не может быть больше даты конца поиска')
                setFilterDateTo(value)
            }
            setFilterDateFrom(value)
        }
        else{
            if (new Date(value) < new Date(filterDateFrom)){
                console.log('Значение не может быть больше даты начала поиска')
                setFilterDateFrom(value)
            }
            setFilterDateTo(value)
        }
    }

    return (
        <Filter download={download}>
            <input className='filter__dropdown-toggle' type="date" value={filterDateFrom} onChange={(e) => setDateHandler(true, e.target.value)}/>
            <input className='filter__dropdown-toggle' type="date" value={filterDateTo} onChange={(e) => setDateHandler(false, e.target.value) }/>
            <Dropdown
                title={filterSort}
                onClickSet={setFilterSort}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                options={['По убыванию', 'По возрастанию']}
            />
            {
                oilTypes.length > 0 &&
                <Dropdown
                    title={filterOil}
                    onClickSet={setFilterOil}
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                    options={['Не выбрано', ...oilTypes]}
                />
            }
        </Filter>
    );
});

export default FilterTransactions;