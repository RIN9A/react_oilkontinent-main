import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "../Dropdown";
import TextInput from "../../UI/TextInput";
import NumberInput from "../../UI/NumberInput";
import TimeInput from "../../UI/TimeInput";
import DateInput from "../../UI/DateInput";
import { updateCard } from "../../http/cardsAPI";

function getOilType(oilType) {
  const oilTypes = {
    'dt': 'ДТ',
    'ai92': 'АИ-92',
    'ai95': 'АИ-95',
    'spbt': 'СПБТ'
  };
  return oilTypes[oilType] || oilType;
}

const limitsType = [
  "Только в будние",
  "С 6:00 до 22:00",
  "Отсутствует",
  "Заблокирована"
]

function getDate(dateSting) {
  if (dateSting === "") {
    const date = new Date();
    let newDate = new Date(new Date(date).setMonth(date.getMonth() + 3));
    return newDate.toISOString().slice(0, 10).split('-').reverse().join('.')
  }
  return new Date(dateSting).toISOString().slice(0, 10).split('-').reverse().join('.')
}

const RowCard = ({ card, oilTypes, setActiveDropdown, activeDropdown, userRole }) => {
  const { limits = {}, number } = card;

  const isAdminOrManager = userRole === "admin" || userRole === "manager";
  const [limitType, setLimitType] = useState(limits?.type || "Отсутствует");
  const [limitDay, setLimitDay] = useState(limits?.limitDay || 0);
  const [typeOil, setTypeOil] = useState(limits.typeOil || [])
  const [limitMonth, setLimitMonth] = useState(limits?.limitMonth || 0);
  const [timeStart, setTimeStart] = useState(limits?.timeStart || "");
  const [timeEnd, setTimeEnd] = useState(limits?.timeEnd || "");
  const [expireAt, setExpireAt] = useState(limits?.validUntil || "");
  const [holder, setHolder] = useState(card?.holder || "");
  const [availableOilTypes, setAvailableOilTypes] = useState([
    { id: 'ai92', name: 'АИ-92', selected: false },
    { id: 'ai95', name: 'АИ-95', selected: false },
    { id: 'dt', name: 'ДТ', selected: false },
    { id: 'spbt', name: 'СПБТ', selected: false }
  ]);

  useEffect(() => {
    setAvailableOilTypes(prevTypes =>
      prevTypes.map(type => ({
        ...type,
        selected: typeOil.includes(type.id)
      }))
    );
  }, [typeOil]);

  const handleOilTypeChange = (id) => {
    setAvailableOilTypes(prevTypes =>
      prevTypes.map(type =>
        type.id === id ? { ...type, selected: !type.selected } : type
      )
    );

    const newSelectedTypes = availableOilTypes
      .map(type => type.id === id ? { ...type, selected: !type.selected } : type)
      .filter(type => type.selected)
      .map(type => type.id);

    setTypeOil(newSelectedTypes);
  };

  const previousValues = useRef({ limitType, typeOil, limitDay, limitMonth, timeStart, timeEnd, expireAt, holder });

  useEffect(() => {
    if (!isAdminOrManager) return;
    const hasChanged =
      previousValues.current.limitType !== limitType ||
      previousValues.current.typeOil !== typeOil ||
      previousValues.current.limitDay !== limitDay ||
      previousValues.current.limitMonth !== limitMonth ||
      previousValues.current.expireAt !== expireAt ||
      previousValues.current.holder !== holder;

    if (hasChanged) {
      const newLimits = {
        limitType,
        typeOil,
        limitDay,
        limitMonth,
        validUntil: expireAt,
      };


      updateCard(limitType, typeOil, limitDay, limitMonth, holder, number, expireAt).then(() =>
        console.log("Card updated:", newLimits)
      );

      previousValues.current = { limitType, typeOil, limitDay, limitMonth, expireAt, holder };
    }

    if (activeDropdown) {
      activeDropdown.classList.remove("open");
      activeDropdown?.children[1]?.classList.remove("active");
      setActiveDropdown(null);
    }
  }, [limitType, limitDay, limitMonth, expireAt, typeOil, holder]);

  const renderOilTypesSelector = () => {
    if (!isAdminOrManager || limitType === "Заблокирована") {
      return <span>{typeOil.map(type => getOilType(type)).join(', ')}</span>;
    }

    return (
      <Dropdown
        title={typeOil.length > 0 ? typeOil.map(type => getOilType(type)).join(', ') : "Выберите топливо"}
        onClickSet={() => { }}
        activeDropdown={activeDropdown}
        setActiveDropdown={setActiveDropdown}
        customContent={
          <div style={{ padding: '10px', minWidth: '200px' }}>
            {availableOilTypes.map(type => (
              <div key={type.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`oil-type-${type.id}`}
                  checked={type.selected}
                  onChange={() => handleOilTypeChange(type.id)}
                />
                <label className="form-check-label" htmlFor={`oil-type-${type.id}`}>
                  {type.name}
                </label>
              </div>
            ))}
          </div>
        }
      />
    );
  };


  return (
    <tr>
      <td>
        <Link to={`/cards/${number}`} className="table__wrap">
          {number}
        </Link>
      </td>
      <td>
        {holder}
      </td>

      {/* Тип ограничения */}
      <td>
        {isAdminOrManager ?
          <Dropdown
            title={limitType}
            onClickSet={setLimitType}
            activeDropdown={activeDropdown}
            setActiveDropdown={setActiveDropdown}
            options={limitsType}
          />
          :
          limitType

        }
      </td>
      <td>
        {renderOilTypesSelector()}
      </td>
      <td>
        {isAdminOrManager && limitType !== "Заблокирована" ?
          <NumberInput value={limitDay} setValue={setLimitDay} />
          :
          <span>{limitDay}</span>
        }
        <span> л</span>
      </td>

      <td>
        {isAdminOrManager && limitType !== "Заблокирована" ?
          <NumberInput value={limitMonth} setValue={setLimitMonth} />
          :
          limitMonth
        }
        <span> л</span>
      </td>
      {/* Срок действия */}
      <td>
        {isAdminOrManager && limitType !== "Заблокирована" ?
          <DateInput value={expireAt} setValue={setExpireAt} />
          :
          getDate(expireAt)
        }
      </td>
    </tr>
  );
};
export default RowCard;
