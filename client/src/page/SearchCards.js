import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchCards } from "../http/cardsAPI";
import Header from "../components/Header";

const SearchCards = () => {
    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const {pathname} = useLocation();
    const url = pathname !== "/drivers-cards" ? "/users/" : "/users/drivers/"


    useEffect(() => {
        fetchCards('all').then((data) => {
            setCards(data);
            setFilteredCards(data);
        });
    }, []);

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
        <>
            <Header title='Все карты' />
            <div style={{ marginTop: 30, display: "flex", justifyContent: "center", padding: 12, background: '#d3d3d3', borderRadius: 12 }}>
                <input
                    style={{ padding: 12, borderRadius: 12, outline: "none", width: '100%', maxWidth: 900 }}
                    type="text"
                    placeholder="Поиск по номеру карты, держателю или email"
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            <div className="table-section table-section-cards" style={{ marginTop: 20 }}>
                <table className="table table-cards">
                    <thead className="table__head">
                        <tr>
                            <th scope="col">№ карты</th>
                            <th scope="col">Держатель</th>
                            <th scope="col">Email пользователя</th>
                            <th scope="col">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCards.map(card => (
                            <tr key={card.number}>
                                <td>{card.number}</td>
                                <td>{card.holder || '-'}</td>
                                <td>{card.user_email || '-'}</td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Link to={`/cards/${card.number}`} className="btn btn-sm btn-primary">Детали</Link>
                                        {card.userId && <Link to={`${url}${card.userId}`} className="btn btn-sm btn-secondary">Пользователь</Link> 
                                        }
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredCards.length === 0 && (
                    <div className="text-center mt-3">
                        {searchQuery ? "Карты не найдены" : "Нет карт"}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchCards;