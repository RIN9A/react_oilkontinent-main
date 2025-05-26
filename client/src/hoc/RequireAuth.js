import {Navigate, useLocation} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {check} from "../http/userAPI";
import {Spinner} from "react-bootstrap";

export const RequireAuth = observer(({children, role=null}) => {
    const {user} = useContext(Context)
    const location = useLocation()

    const [loading, setLoading] = useState(true)
    useEffect(() => {
        check().then(data => {
            user.setUser(data)
            user.setIsAuth(true)
        })
            .finally(() => setLoading(false))
    }, []);

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    if (!user.isAuth)
        return <Navigate to='/login' state={{from: location.pathname}}/>

    if (role && user.user?.permissions?.role !== role) {
        return <Navigate to='/' state={{from: location.pathname}}/>
    }

    return children
})