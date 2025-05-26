import React, {useState} from 'react';
import {createFiles} from "../http/filesAPI";
import {Spinner} from "react-bootstrap";


const FileUpload = React.memo(({text, className, formName}) => {

    const [drag, setDrag] = useState(false)
    const [isDropped, setIsDropper] = useState(false)

    function dragStartHandler(e) {
        e.preventDefault()
        setDrag(true)
    }
    function dragLeaveHandler(e) {
        e.preventDefault()
        setDrag(false)
    }

    async function onDropHandler(e) {
        e.preventDefault()
        try {
            setIsDropper(true)
            const files = [...e.dataTransfer.files]
            let formData = new FormData()

            for (let i = 0; i < files.length; i++) {
                formData.append("file_data", files[i])
            }
            formData.append('form', formName)

            if (files.length) {
                const file = await createFiles(formData, formName)
                console.log(file)
            }
        } catch (e) {
            console.log(e.message)
        }

        setIsDropper(false)
        setDrag(false)
    }

    return (drag
        ?
        <div
            className={className + ' drop-area'}
            onDragStart={e => dragStartHandler(e)}
            onDragLeave={e => dragLeaveHandler(e)}
            onDragOver={e => dragStartHandler(e)}
            onDrop={e => onDropHandler(e)}
        >
            <p>Отпустите файлы чтобы загрузить их</p>
            {isDropped &&  <Spinner size="sm" animation="grow"/>}
        </div>
        :
        <div
            className={className}
            onDragStart={e => dragStartHandler(e)}
            onDragLeave={e => dragLeaveHandler(e)}
            onDragOver={e => dragStartHandler(e)}
        >
            <p>{text}</p>
        </div>)
})

export default FileUpload;