
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { fetchAZS, fetchRelatedAZS, searchAZS } from '../http/AZSAPI';

const DriverAzsList = () => {
    const [azses, setAzses] = useState([]);
    const [input, setInput] = useState('');

  

    useEffect(() => {
        searchAZS(input).then(data => setAzses(data));
    }, [input]);

    return (
        <div style={{ padding: '20px' }}>
            {/* Поисковая строка */}
            <Form.Group controlId="searchAzs" style={{ marginBottom: '20px' }}>
                <Form.Label>Поиск АЗС</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Введите название или адрес АЗС..." 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </Form.Group>

            {/* Список АЗС */}
            <div style={{ display: 'grid', gap: '15px' }}>
                {azses.map((azs) => (
                    <div 
                        key={azs.id} 
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '5px',
                            padding: '15px',
                            backgroundColor: '#f9f9f9'
                        }}
                    >
                        <h5 style={{ marginBottom: '10px' }}>{azs.station}</h5>
                        <p style={{ marginBottom: '5px', color: '#555' }}>
                            <strong>Адрес:</strong> {azs.address}
                        </p>
                        
                        <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '10px',
                            marginTop: '10px'
                        }}>
                            <div>
                                <strong>АИ-92:</strong> {azs.ai92} ₽
                            </div>
                            <div>
                                <strong>АИ-95:</strong> {azs.ai95} ₽
                            </div>
                            <div>
                                <strong>ДТ:</strong> {azs.dt} ₽
                            </div>
                            <div>
                                <strong>СПБТ:</strong> {azs.spbt} ₽
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {azses.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                    АЗС не найдены. Попробуйте изменить параметры поиска.
                </p>
            )}
        </div>
    );
};

export default DriverAzsList;