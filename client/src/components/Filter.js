import React from 'react';

const Filter = ({download, children}) => {
    return (
        <div className="content-header">
            <div className="content-header__left">
                <div className="filter">
                    <span className="filter__txt">
                        Фильтры
                    </span>
                    {children}
                </div>
            </div>
            {
                download &&
                    <div className="content-header__right">
                        <div className="btn__light-outline" onClick={() => download()}>
                            Скачать отчет
                        </div>
                    </div>
            }

        </div>
    );
};

export default Filter;