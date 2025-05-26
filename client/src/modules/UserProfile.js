import React, { useEffect, useReducer, useState } from 'react';
import { fetchDriver, fetchUser, updateUser } from "../http/userAPI";
import { useParams } from "react-router-dom";
import FieldChanger from "../UI/FieldChanger";
import FilenameChanger from "../components/FilenameChanger";
import { toMoney } from "../utils/helpers";


const fieldReducer = (state, action) => {

    updateUser(state.userId, {
        [action.name]: action.value
    })

    return {
        ...state,
        [action.name]: action.value
    }
}

const UserProfile = () => {
    const { id } = useParams();
    const [field, setField] = useReducer(fieldReducer, { userId: id }, val => val);
    const [user, setUser] = useState(null)
    const [contracts, setContracts] = useState([])
    const [files, setFiles] = useState([])

    useEffect(() => {
        fetchUser(id).then(data => {
            setUser(data[0])
            setContracts(data[1] || [])
            setFiles(data[2] || [])
        })
    }, [])
    return (
        <div>
            {
                user &&
                <>
                    <div className='profile__block' style={{ marginTop: 10 }}>
                        <FieldChanger value={field.users_name || user.name || user.email} setField={setField} table_field='users_name'>
                            <p>ФИО: {field.users_name || user.name || user.email} <span className='small'>Изменить</span></p>
                        </FieldChanger>
                    </div>

                    {user.companyName &&
                        <div className='profile__block' style={{ marginTop: 10 }}>
                            <FieldChanger value={field.companyName || user.companyName} setField={setField} table_field='users_companyName'>
                                <p>Название компании: {field.companyName || user.companyName} <span className='small'>Изменить</span></p>
                            </FieldChanger>
                        </div>
                    }
                    {user.departmentName &&
                        <div className='profile__block' style={{ marginTop: 10 }}>
                            <FieldChanger value={field.departmentName || user.departmentName} setField={setField} table_field='users_departmentName'>
                                <p>Название отдела: {field.departmentName || user.departmentName} <span className='small'>Изменить</span></p>
                            </FieldChanger>
                        </div>
                    }

                    <div className='profile__block' style={{ marginTop: 10 }}>
                        <FieldChanger value={field.users_inn || user.inn || 'Не указан'} setField={setField} table_field='users_inn'>
                            <p>ИНН: {field.users_inn || user.inn || 'Не указан'} <span className='small'>Изменить</span></p>
                        </FieldChanger>
                    </div>

                    <div className='profile__block' style={{ marginTop: 10 }}>
                        <FieldChanger value={field.users_phoneNumber || user.phoneNumber || 'Не указан'} setField={setField} table_field='users_phoneNumber'>
                            <p>Номер для связи: {field.users_phoneNumber || user.phoneNumber || 'Не указан'} <span className='small'>Изменить</span></p>
                        </FieldChanger>
                    </div>
                </>

            }
            {
                user?.permissions?.role === "driver" &&
                contracts?.map(contract =>
                    <div key={contract.id} style={{ display: "flex", gap: 20, background: '#d3d3d3', padding: 20, borderRadius: 12, marginTop: 10 }}>
                        <div className='profile__block'>Контракт: {contract.name}</div>

                        {contract.contactphone}

                        {contract?.costs?.discount &&
                            <div className='profile__block'>Скидка: {contract.costs.discount.replaceAll('%', '')}%</div>
                            // Временная мера с %
                        }
                        {
                            files?.length > 0 &&
                            files.map((file, index) =>
                                <div className='profile__block' key={index}>
                                    <FilenameChanger file={file} index={index} />
                                </div>
                            )
                        }

                        {
                            contract &&
                            Object.keys(contract?.costs).filter(el => el !== 'discount').map(el =>
                                <p key={el} className='small'>{el}: <span style={{ color: 'black', marginLeft: 5 }}> {toMoney(contract.costs[el])}</span></p>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
};

export default UserProfile;