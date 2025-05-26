import React, {useEffect, useState} from 'react';
import {createAZS, fetchRelatedAZS, updateAZS, updatePricesAZS} from "../http/AZSAPI";
import SearchBarPPR from "./SearchBarPPR";
import SearchBar from "./SearchBar";
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const PprFilter = () => {

    const [azses, setAzses] = useState([])
    const [input, setInput] = useState('')
    const [showAddAzsModal, setShowAddAzsModal] = useState(false);
    const [showEditPricesModal, setShowEditPricesModal] = useState(false);
    const [selectedAzs, setSelectedAzs] = useState(null);
    const [newAzs, setNewAzs] = useState({
        street: '',
        number: '',
        terminals: '',
        station: '',
        region: '',
        city: '',
        brand: '',
        ai92: '',
        ai95: '',
        dt: '',
        spbt: ''
    });

        const [editedPrices, setEditedPrices] = useState({
        ai92: '',
        ai95: '',
        dt: '',
        spbt: ''
    });


    useEffect(()=>{
        fetchRelatedAZS(input).then(data => setAzses(data))
    }, [input]);

    const handleAddAzs = async () => {
        try {
            const azsData = {
                ...newAzs,
                address: `ул. ${newAzs.street}, ${newAzs.number}`
            };


            createAZS(azsData).then(data => {
                setAzses([...azses, data]);
                setShowAddAzsModal(false);
                setNewAzs({
                    street: '',
                    number: '',
                    terminals: '',
                    station: '',
                    region: '',
                    city: '',
                    brand: '',
                    ai92: '',
                    ai95: '',
                    dt: '',
                    spbt: ''
                });

            })
        } catch (error) {
            console.error('Error adding AZS:', error);
        }
    };

     const handleEditPrices = (azs) => {
        setSelectedAzs(azs);
        setEditedPrices({
            ai92: azs.ai92,
            ai95: azs.ai95,
            dt: azs.dt,
            spbt: azs.spbt
        });
        setShowEditPricesModal(true);
    };

    const handleSavePrices = async () => {
        try {
            const updatedAzs = await updatePricesAZS(selectedAzs.id, editedPrices);
            setAzses(azses.map(azs => 
                azs.id === selectedAzs.id ? {...azs, ...updatedAzs} : azs
            ));
            setShowEditPricesModal(false);
        } catch (error) {
            console.error('Error updating prices:', error);
        }
    };

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        setEditedPrices(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAzs(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleBrandChange = (e) => {
        const brand = e.target.value;

        setNewAzs(prev => ({
            ...prev,
            brand,
            station: prev.city && brand ? `АЗС ${brand}, г.${prev.city}` : prev.station
        }));
    };

    const handleCityChange = (e) => {
    const city = e.target.value;
    setNewAzs(prev => ({
        ...prev,
        city,
        station: prev.brand && city ? `АЗС ${prev.brand}, г.${city}` : prev.station
    }));
};

    return (
        <>
         <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', marginBottom: '10px' }}>
            <Button 
                    variant="primary" 

                    onClick={() => setShowAddAzsModal(true)}
                    style={{
                        placeSelf: "flex-end"
                     }}
                >
                    Добавить АЗС
                </Button>
            <SearchBar title='Поиск по связанным АЗС' input={input} setInput={setInput}/>
             
            </div>
            <div style={{margin: '40px 0'}}>
                { azses.map((azs, i) => (
                      <div key={i+"-"+azs.address} onClick={() => handleEditPrices(azs)} style={{cursor: 'pointer'}}>
                <SearchBarPPR key={i+"-"+azs.address} address = {azs.station} azs={azs}/>
                </div>
                ))}
            </div>

             <Modal show={showAddAzsModal} onHide={() => setShowAddAzsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Добавить новую АЗС</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                         <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Регион</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="region"
                                        value={newAzs.region}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Город</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={newAzs.city}
                                        onChange={handleCityChange}
                                        
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Улица</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="street"
                                        value={newAzs.street}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Номер здания</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="number"
                                        value={newAzs.number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                           
                           
                        </Row>
                    

                        <Row>
                             <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Бренд*</Form.Label>
                                    <Form.Select
                                        name="brand"
                                        value={newAzs.brand}
                                        onChange={handleBrandChange}
                                        required
                                    >
                                        <option value="">Выберите бренд</option>
                                        <option value="Лукойл">Лукойл</option>
                                        <option value="Татнефть">Татнефть</option>
                                        <option value="Газпромнефть">Газпромнефть</option>
                                        <option value="ТАИФ-НК">ТАИФ-НК</option>
                                        <option value="Роснефть">Роснефть</option>

                                        <option value="Shell">Shell</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Название станции*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="station"
                                        value={newAzs.station}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="АЗС Лукойл, г.Казань"
                                    />
                                </Form.Group>
                            </Col>
                             <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Терминалы (через ", ")</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="terminals"
                                        value={newAzs.terminals}
                                        onChange={handleInputChange}
                                        placeholder="ТК-123, ТК-456"
                                    />
                                </Form.Group>
                            </Col>
                            
                        </Row>

                       
                        <h5 className="mt-4">Цены на топливо</h5>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>АИ-92</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="ai92"
                                        value={newAzs.ai92}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>АИ-95</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="ai95"
                                        value={newAzs.ai95}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>ДТ</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="dt"
                                        value={newAzs.dt}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="mb-3">
                                    <Form.Label>СПБТ</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="spbt"
                                        value={newAzs.spbt}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddAzsModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleAddAzs}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
               <Modal show={showEditPricesModal} onHide={() => setShowEditPricesModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование цен для {selectedAzs?.station}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <h5>Текущие цены</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>АИ-92</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedAzs?.ai92 || ''}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>АИ-95</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedAzs?.ai95 || ''}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>ДТ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedAzs?.dt || ''}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>СПБТ</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedAzs?.spbt || ''}
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5 className="mt-4">Новые цены</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>АИ-92</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="ai92"
                                        value={editedPrices.ai92}
                                        onChange={handlePriceChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>АИ-95</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="ai95"
                                        value={editedPrices.ai95}
                                        onChange={handlePriceChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>ДТ</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="dt"
                                        value={editedPrices.dt}
                                        onChange={handlePriceChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>СПБТ</Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.01"
                                        name="spbt"
                                        value={editedPrices.spbt}
                                        onChange={handlePriceChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditPricesModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleSavePrices}>
                        Сохранить изменения
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
export default PprFilter;