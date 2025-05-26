import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Container, Form, Row } from "react-bootstrap";
import { ADMIN_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import { check, login } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Auth = observer(() => {
    const navigate = useNavigate()
    const { user } = useContext(Context)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await check();
                user.setUser(data);
                user.setIsAuth(true);
                navigate('/');
            } catch (e) {
                console.log("Пользователь еще не авторизован");
            }
        };

        checkAuth();
    }, []);


    const click = async () => {
        try {
            const data = await login(email, password)

            user.setUser(data)
            user.setIsAuth(true)
            const url = data.permissions.role === "admin"? "/" + ADMIN_ROUTE : "/"
            navigate(url);
        }
        catch (e) {
            alert(e.response?.data?.message || 'Ошибка входа');
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight }}
        >
            <Card style={{ width: 500 }} className="p-4">
                <h2 className="m-auto">Авторизация</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-4"
                        placeholder="Введите ваш email..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-2"
                        placeholder="Введите ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        autoComplete="on"
                    />
                    <Row className="d-flex justify-content-between mt-3 ps-3 pe-3">
                        <Button
                            className="col-12"
                            variant={"outline-success"}
                            onClick={click}
                        >
                            Войти
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;