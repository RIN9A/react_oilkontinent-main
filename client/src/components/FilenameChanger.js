import React, {useState} from 'react';
import {updateFile} from "../http/filesAPI";

const FilenameChanger = ({file, index}) => {
    const [filename, setFilename] = useState(file.filename || `файл ${++index}`)
    const [change, setChange] = useState(true)

    function handlerChangeFilename(e){
        const newFilename = e.target.value
        setFilename(newFilename)

        // updateFile(file.id, newFilename).then(data => console.log(data))
    }

    return (
        <div>
            {
                change
                    ?
                    <>
                        <a href={process.env.REACT_APP_API_URL + file.filepath}>{filename}</a>
                        <span className='small' onClick={() => setChange(false)}>Изменить</span>
                    </>
                    :
                    <>
                        <input type="text" value={filename} onChange={e => handlerChangeFilename(e)}/>
                        <span className='small' onClick={() => setChange(true)}>Назад</span>
                    </>
            }
        </div>
    );
};

export default FilenameChanger;