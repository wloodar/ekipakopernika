import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import s from './Events.module.scss';

import EventCover from './example.jpg';

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            events: [1,1]
        };

        this.props.history.push('/');
    }

    render() {
        return (
            <main className={s.main}>
                <div className={s.events__container}>
                    <div className={s.main__header}>
                        <h3 className="bs-header">Najświeższe wydarzenia</h3>
                    </div>
                    <div className={s['events__wrapper']}>
                        {this.state.events.map((val, key) => 
                            <div className={s.event}>
                                <Link to="/wydarzenia/example"></Link>
                                <div className={s.event__inner}>
                                    <div className={s.event__image}>
                                        <img src={EventCover}/>
                                    </div>
                                    <div className={s.event__name}>
                                        <h5>Organizacja wymiany Polsko - Francuskiej</h5>
                                    </div>
                                    <div className={s.event__date}>
                                        <span>Piątek, 29 maj o 12:00</span>
                                    </div>
                                    <div className={s.event__btn}>
                                        <span>Więcej</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={s.main__header}>
                        <h3 className="bs-header">Ostatnie aktualności</h3>
                    </div>
                </div>
            </main>
        )
    }
}

Events.propTypes = {
    auth: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Events));

// import React, { Component } from 'react';
// import { withRouter, Link } from 'react-router-dom';
// import s from './Events.module.scss';

// import EventCover from './example.jpg';

// class Events extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//             events: [1,1,1]
//         };
//     }

//     render() {
//         return (
//             <main className={s.main}>
//                 <div className={s.news}>
//                     <div className={s.title}>
//                         <h3 className="bs-title">Aktualności</h3>
//                     </div>
//                     <div className={s.news__container}>
//                         <p>Tutaj bedą aktualności ze wszytskich wydarzeń poukładane od najnowszych</p>
//                     </div>
//                 </div>
//                 <div className={s.events__container}>
//                     <div className={s.title}>
//                         <h3 className="bs-title">Wydarzenia</h3>
//                     </div>
//                     <div className={s['events__wrapper']}>
//                         {this.state.events.map((val, key) => 
//                             <div className={s.event}>
//                                 <Link to="/wydarzenia/example">
//                                     <div className={s.event__cover}>
//                                         <img src={EventCover}/>
//                                         <div className={s['event__cover--overlay']}></div>
//                                     </div>
//                                     <div className={s['event-i']}>
//                                         <div className={s['event-i__inner']}>
//                                             <div className={s['event-i__date']}>
//                                                 <p>Piątek, 29 maj o 12:00</p>
//                                             </div>
//                                             <div className={s['event-i__name']}>
//                                                 <h5>Organizacja wymiany Polsko - Francuskiej</h5>
//                                             </div>
//                                             <div className={s['event-i__place']}>
//                                                 <p>Paryż, Francja</p>
//                                             </div>
//                                             <div className={s['event-i__more']}>
//                                                 <p>Dowiedz się więcej</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>
//         )
//     }
// }

// export default withRouter(Events);