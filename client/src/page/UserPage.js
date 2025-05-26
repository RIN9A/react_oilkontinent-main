import React, {useEffect, useState} from 'react';
import {Button, Container, Row} from "react-bootstrap";
import {fetchContract} from "../http/ContractsAPI";
import TextInput from "../UI/TextInput";
import {updatePassword} from "../http/userAPI";

const UserPage = () => {
    const [contract, setContract] = useState({})
    const [password, setPassword] = useState('')
    useEffect(() => {
        fetchContract().then((data) => {
            setContract(data[0])
        })
    }, [])

    const changePassword = async () => {
        const message = await updatePassword(password)
        console.log(message)
    }


    return (
        <Container>
            <Row style={{marginTop: 30, display: "flex", flexDirection: "column", gap: 20}}>
                <div style={{borderRadius: 10, padding: 10, background: '#d3d3d3', width: "fit-content"}}>Контракт: {contract.name}</div>
                {contract?.costs?.discount &&
                    <div style={{borderRadius: 10, padding: 10, background: '#d3d3d3', width: "fit-content"}}>Скидка: {contract.costs.discount}%</div>
                }
                <div style={{borderRadius: 10, padding: 10, background: '#d3d3d3', width: "fit-content"}}>
                    Изменить пароль
                    <input
                        style={{marginLeft: 10}}
                        className='input'
                        type='text'
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                    />
                    <Button onClick={changePassword}>Сохранить</Button>
                </div>
            </Row>
        </Container>
    );
}

export default UserPage;