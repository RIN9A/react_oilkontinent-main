import React, {useEffect} from 'react';

const DropdownCard = ({title, onClickSet, options}) => {
    return (
        <div className="filter__item">
            <div className="filter__dropdown">
                <div className="filter__dropdown-toggle js-toggle">
                    <span className="filter__dropdown-title">{title}</span>
                </div>
                <div className="filter__dropdown-content">
                    <ul className="filter__dropdown-list">
                        <li className="filter__dropdown-item">
                            {
                                options.map(option =>
                                    <button key={option} type="button" className="filter__dropdown-value" onClick={() => onClickSet(option)}>
                                        {option}
                                    </button>
                                )
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DropdownCard;