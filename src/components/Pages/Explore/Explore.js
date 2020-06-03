import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import s from './Explore.module.scss';

class Explore extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className={s.container}>
                <aside className={[s.menu, s.sticky].join(' ')}>
                <br/><br/><br/><br/><br/>
                    {/* Aktualnosci */}
                </aside>
                <main className={s.feed}>
                    <div className={s['feed-wrapper']}>
                        <br/><br/><br/><br/><br/><br/>
                        {/* Posty / Z wszystkich kategorii  */}
                        Explore
                    </div>
                </main>
                <div className={[s.sidebar, s.sticky].join(' ')}>
                    <br/><br/><br/><br/><br/><br/>
                    {/* Jakies inne linki */}
                </div>
            </div>
        )
    }
}

export default withRouter(Explore);