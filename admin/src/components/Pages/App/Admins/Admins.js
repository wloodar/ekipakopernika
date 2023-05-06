import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import cs from 'classnames';
import PropTypes from 'prop-types';
import axios from 'axios';
import uuidBase62 from 'uuid-base62';
import bs from '../AppPages.module.scss';
import Icon from '../../../Icons/Base';
import { removeDiacritics } from '../../../../functions/RemoveDialect';

class Admins extends Component {

    constructor(props) {
        super(props);
        this.state = {
            waiting: true,
            users: [],
            displayed_users: [],
            search_user: '',
        };

        this.searchUsers = this.searchUsers.bind(this);

        if (this.props.auth.user.role !== "superadmin") {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        axios.get(process.env.REACT_APP_GLOBAL_ADMIN_API_URL + "/users/all").then(res => {
            this.setState({
                waiting: false,
                users: res.data,
                displayed_users: res.data
            })
        });
    }

    searchUsers(event) {
        let searcjQery = removeDiacritics(event.target.value.toLowerCase()),
        displayedContacts = this.state.users.filter((el) => {
            let name = removeDiacritics(el.first_name.toLowerCase()) + removeDiacritics(el.last_name.toLowerCase());
            return name.indexOf(searcjQery) !== -1;
        })
        this.setState({
            [event.target.name]: event.target.value,
            displayed_users: displayedContacts
        })
    }

    render() {
        const { users, displayed_users } = this.state;
        return (
            <>
            <header>
                <div className="nbs-header">
                    <h3>Administratorzy</h3>
                    <p>Twórz nowe konta, edytuj, monitoruj działania administratorów</p>
                </div>
            </header>
            <div className={bs.container}>
                <div className="card card__apadding--common card__action--common" style={{ height: "100%" }}>
                    <Link to="/admins/create"><Icon name="plus"/><p>Stwórz konto</p></Link>
                </div>
                <div className={cs(bs['right-col'], "card card__apadding--common")}>
                    <div className="card-form__search card-form__search--fwidth">
                        <input
                            type="text"
                            name="search_user"
                            placeholder="Szukaj osoby"
                            onChange={this.searchUsers}
                            value={this.state.search_user}
                        />
                    </div>
                    <div className={bs['right-col__list']}>
                        <ul>     
                            {displayed_users.map((val, key) => this.props.auth.user.uuid === val.uuid ? null : <li className={bs['right-col-u__row']} key={key}>
                                <Link to={"/admins/user/" + uuidBase62.encode(val.uuid)}>
                                    <div className={cs(bs['right-col-u__image'], "user-icon", val.role === "superadmin" ? 'bs-gradient--turquoise' : 'bs-gradient--pink')}>
                                        <span>{val.first_name.charAt(0)}</span>
                                    </div>
                                    <div className={bs[['right-col-u__name']]}>
                                        <h5>{val.first_name + " " + val.last_name} {val.blocked ? <> - <span> <Icon name="lock"/> Zablokowany / a</span></> : null}</h5>
                                        <p>{val.email}</p>
                                    </div>
                                    <div className={bs['right-col-u__role']}>
                                        <p className={val.role === "superadmin" ? 'bs-gradient--turquoise' : 'bs-gradient--pink'}>{val.role === "superadmin" ? "Super - Admin" : "Admin"}</p>
                                    </div>
                                </Link>
                            </li>)}                    
                        </ul>
                    </div>
                </div>
            </div> 
            </>
        )   
    }
}

Admins.propTypes = {
    auth: PropTypes.object,
    location: PropTypes.object,
    history: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default withRouter(connect(mapStateToProps)(Admins));
