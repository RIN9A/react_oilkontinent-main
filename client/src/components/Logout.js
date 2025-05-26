import React, {useContext} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Logout = observer(() => {
    const {user} = useContext(Context)

    user.isAuth = false

    return (
        <div>
            Выход
        </div>
    );
});

export default Logout;