import React, { useContext, useEffect, useState } from 'react';
import { fetchCards } from "../../http/cardsAPI";
import RowCard from "./RowCard";
import { Context } from "../../index";
import { fetchContract } from "../../http/ContractsAPI";
import { observer } from "mobx-react-lite";
import { Form } from "react-bootstrap";

const Cards = observer(({ userId }) => {
    const [cards, setCards] = useState(null);
    const [filteredCards, setFilteredCards] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [prevActiveDropdown, setPrevActiveDropdown] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { user } = useContext(Context);
    const [oilTypes, setOilTypes] = useState([]);
        const isAdminOrManager = user?.user?.permissions.role === 'admin' || user?.user?.permissions.role === 'manager'

    useEffect(() => {
        if (isAdminOrManager && userId ==="all") {
            fetchCards('all').then(data => {
                setCards(data);
                setFilteredCards(data);
            });
        } else {
            fetchCards(userId).then(data => {
                setCards(data);
                setFilteredCards(data);
            });
        }
        fetchContract().then(data => {
             if (data && data.length > 0 && data[0].costs) {
            const oils = Object.keys(data[0].costs).filter(oil => oil !== 'discount')
            setOilTypes(oils)
        } else {
            setOilTypes([]) 
            console.warn("Нет доступных контрактов или поле 'costs' отсутствует.")
        }
        });
    }, [userId]);

    useEffect(() => {
        if (activeDropdown === prevActiveDropdown && activeDropdown) {
            activeDropdown.classList.remove('open');
            activeDropdown?.children[1]?.classList.remove('active');
            setActiveDropdown(null);
        } else {
            setPrevActiveDropdown(activeDropdown);
        }
    }, [activeDropdown]);

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredCards(cards);
        } else {
            const filtered = cards.filter(card =>
                card.number.toLowerCase().includes(query) ||
                (card.holder && card.holder.toLowerCase().includes(query)) ||
                (card.user_email && card.user_email.toLowerCase().includes(query))
            );
            setFilteredCards(filtered);
        }
    };


    return (
        <div>
            {/* Секция поиска */}
            <div className="search-section mb-4">
                <Form.Control
                    type="text"
                    placeholder="Поиск по номеру карты..."
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{ maxWidth: '400px' }}
                />
            </div>

            {/* Секция со списком карт */}
            <div className="all-cards-section">
                {filteredCards !== null ? (
                    filteredCards.length ? (
                        <div className="table-section table-section-cards">
                            <table className="table table-cards">
                                <thead className="table__head">
                                    <tr>
                                        <th scope="col">№ карты</th>
                                        <th scope="col">Держатель</th>
                                        <th scope="col">Тип ограничения</th>
                                        <th scope="col">Доступные виды топлива</th>
                                        <th scope="col">Л/день</th>
                                        <th scope="col">Л/месяц</th>
                                        <th scope="col">Срок действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCards.map(card =>
                                        <RowCard
                                        userRole={user?.user?.permissions?.role}
                                            key={card.number}
                                            card={card}
                                            oilTypes={oilTypes}
                                            activeDropdown={activeDropdown}
                                            setActiveDropdown={setActiveDropdown}
                                            showUserId={isAdminOrManager}
                                        />
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center mt-3">
                            {searchQuery ? "Карты не найдены" : "Нет карт"}
                        </div>
                    )
                ) : (
                    <div className="text-center mt-3">Загрузка...</div>
                )}
            </div>
        </div>
    );
});

export default Cards;