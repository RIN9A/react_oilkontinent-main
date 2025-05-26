import React, { useContext, useEffect, useState } from 'react';
import Header from "../components/Header";
import { Container, Card, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import Cards from "../components/Tables/Cards";
import { Context } from "../index";
import {useParams} from "react-router-dom";
import UserProfile from "../modules/UserProfile";
import { createCard } from '../http/cardsAPI';
import { fetchUser } from '../http/userAPI';

function getRole(role){
   if (role === 'driver') return 'Водитель'
   if (role === 'manager') return 'Менеджер'
   if (role === 'admin') return 'Администратор'
}

const CardsPage = () => {
    const {id} = useParams();
    const { user } = useContext(Context);
    const [pageUser, setPageUser] = useState("");


    useEffect(() => {
        fetchUser(id).then(data => {
            console.log(data[0])
            setPageUser(data[0]);
        })
    }, []);

    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [newCard, setNewCard] = useState({
        number: '',
        shadowNumber: '',
        pin: '',
        holder: '',
        supplier: '',
        department: '',
        userId: id,
    });


    const handleAddCard = async () => {
        try {
            const postData = {
                number: newCard.number,
                 shadowNumber: newCard.shadowNumber,
                 pin: newCard.pin,
                 holder: pageUser?.name,
                 supplier: newCard.supplier,
                 department: newCard.department,
                 userId: id,
            }
            await createCard(postData);
            setShowAddCardModal(false);
            setNewCard({
                number: '',
                shadowNumber: '',
                pin: '',
                holder: '',
                supplier: '',
                department: '',
                userId: id,
            });
        } catch (error) {
            console.error('Ошибка добавления карты', error);
        }
    };
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        setNewCard(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isAdminOrManager = user?.user?.permissions.role === 'admin' || user?.user?.permissions.role === 'manager';

    if(!pageUser) return <p>Загрузка...</p>
    return (
        <>
            <Header title={'Страница пользователя с ID: ' + id + ` ${getRole(pageUser?.permissions?.role)}`}  />
              {isAdminOrManager && pageUser?.permissions?.role === "driver" && (
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <Button 
                        variant="primary" 
                        onClick={() => setShowAddCardModal(true)}
                    >
                        Добавить карту
                    </Button>
                </div>
            )}
            {
            pageUser.permissions.role === "driver" &&
            <Cards userId={id}/>
}
            <UserProfile/>

                        <Modal show={showAddCardModal} onHide={() => setShowAddCardModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить новую карту</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Номер карты*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="number"
                                        value={newCard.number}
                                        onChange={handleCardInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Shadow номер</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="shadowNumber"
                                        value={newCard.shadowNumber}
                                        onChange={handleCardInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>PIN</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pin"
                                        value={newCard.pin}
                                        onChange={handleCardInputChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Держатель карты</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="holder"
                                        value={pageUser.name}
                                        // onChange={handleCardInputChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Компания</Form.Label>
                            <Form.Control
                                type="text"
                                name="supplier"
                                value={newCard.supplier}
                                onChange={handleCardInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Номер отделения</Form.Label>
                            <Form.Control
                                type="number"
                                name="department"
                                value={newCard.department}
                                onChange={handleCardInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddCardModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleAddCard}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    );
};

export default CardsPage;