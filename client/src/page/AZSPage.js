import React from 'react';
import Header from "../components/Header";
import {Placemark, YMaps, Map} from "@pbe/react-yandex-maps";

const AzsPage = React.memo(() => {

    const defaultState = {
        center: [55.799446, 49.105988],
        zoom: 14,
        controls: ["zoomControl", "fullscreenControl"],
    };

    return (
        <>
            <Header title='АЗС локаторы' />
            <YMaps>
                <Map defaultState={defaultState} modules={["control.ZoomControl", "control.FullscreenControl"]} width={'100%'} height={'100%'} className='yamap'>
                    <Placemark geometry={[55.799446, 49.105988]} />
                </Map>
            </YMaps>
        </>
    );
});

export default AzsPage;