import React from 'react';
import { Link } from 'react-router-dom';
import s from './NotFound.module.scss';

function NotFound(props) {

    return (
        <>
            <div className={s.box}>
                <h2 className="bs-header">Przepraszamy, ta strona jest niedostępna</h2>
                <p>Kliknięty link mógł być uszkodzony lub strona mogła zostać usunięta. <Link to="/">Powróć do #EkipaKopernika</Link></p>
            </div>
        </>
    )
}



export default NotFound;