import React from 'react';
import {Route, Routes} from 'react-router-dom'
import {adminRoutes, authRoutes, managerRoutes, publicRoutes} from "../routes";
import Layout from "./Layout";
import {RequireAuth} from "../hoc/RequireAuth";
import IndexPage from "../page/IndexPage";


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<RequireAuth><IndexPage/></RequireAuth>}/>

                {adminRoutes.map(({path, Component}) =>
                    <Route key={path} path={path}
                           element={<RequireAuth role='admin' >{Component}</RequireAuth>}
                    />
                )}

                {managerRoutes.map(({path, Component}) => 
                <Route key={path} path={path}
                element={<RequireAuth role='manager'>{Component}</RequireAuth>}
                />    
            
            )

                }
                {authRoutes.map(({path, Component}) =>
                    <Route key={path} path={path}
                           element={<RequireAuth>{Component}</RequireAuth>}
                    />
                )}

                {publicRoutes.map(({path, Component}) =>
                    <Route key={path} path={path}
                           element={Component}
                    />
                )}
            </Route>
        </Routes>
    );
};

export default AppRouter;