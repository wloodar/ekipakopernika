import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ReadMore from '@crossfield/react-read-more';
import { createUrl } from '../../../functions/ImageUrl';
import axios from 'axios';
import $ from 'jquery';
import s from './About.module.scss';

class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // people: [
            //     {
            //         id: 1,
            //         name: "Dominika Tomkowicz",
            //         description: "Od zawsze lubiłam książki. Już jako mała dziewczynka byłamciekawa, co kryje się pod ich grubymi okładkami. Teraz sięgam po literackie wkażdej wolnej chwili. Są dla mnie lekarstwem na wszystko, dzięki nim się relaksuję, a pocudownym relaksie najlepsze jest dobre jedzenie. Często wcielam się w rolę kucharza ipróbuję stworzyć małe arcydzieła, daje mi to niesamowitą satysfakcję. Staram się teżpamiętać o regularnym uprawianiu sportu, choć mój ulubiony jest dość nietypowy. Odszóstej klasy szkoły podstawowej gram w szachy. Potrafię się wtedy skupić i zmusić mojeszare komórki do wytężonej pracy."
            //     },
            //     {
            //         id: 2,
            //         name: "Filadelfia Grabowska",
            //         description: "Od dawna pasjonuję się fotografią, co sprawiło, że razem zchłopakiem stworzyliśmy firmę Xartus Pictures, zajmującą się robieniem zdjęć oraz filmówz różnego rodzaju wydarzeń oraz uroczystości. W wolnym czasie uwielbiam aktywnośćfizyczną, na przykład jazdę na rowerze i lekkoatletykę. Dawniej należałam do klubuNadwiślanin Chełmno i miałam na swym koncie wiele osiągnięć sportowych, m.in. brałamudział w mistrzostwach Polski. Jestem miłośniczką podróży. Przed pandemią, w prawiekażdy wolny weekend, odwiedzałam różne, ciekawe miejsca."
            //     },
            //     {
            //         id: 3,
            //         name: "Tomasz Gajewski",
            //         description: "Bardzo lubię gotować, a także piec ciasta. Interesuję się równieżogrodnictwem, mam sporo roślin w domu, bo nie posiadam ogrodu. Interesuje mnierównież moda, lubię patrzeć na różne wybitne prace wielu projektantów. Lubię takżerysować, lecz dopiero się uczę i moje prace nie są wybitne."
            //     }
            // ]
            people: []
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_GLOBAL_API_URL}/about/all`).then(result => {
            if (result.data.status === 1) {
                this.setState({ people: result.data.people });   
            }
        })
    }

    render() {
        const { people } = this.state;
        return (
            <div className={s.wrap}>
                <div className={s.header} id="about-header">
                    <div className={s.header__box}>
                        {/* <h5>O nas</h5> */}
                        <p>Strona Ekipy Kopernika prezentuje efekty pracy młodych ludzi, którzy chcą się podzielić z innymi pasjami, zainteresowaniami oraz pokazać związek między dawną i współczesną kulturą. Naszym celem jest zachęcenie społeczności Zespołu Szkół Ogólnokształcących nr 1 <br/>w Chełmnie do dzielenia się swoimi doświadczeniami, do prezentowania całemu światu efektów własnej twórczości oraz do pokazywania tego, co "tam komu w duszy gra, co kto w swoich widzi snach".</p>
                    </div>
                    <div className={s.header__more} onClick={() => {$("html, body").animate({ scrollTop: $("#about-header").offset().top + $("#about-header").height() - 100 + "px" }, 1000)}}>
                        <p>Poznaj nas</p>
                        <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 70 70"><desc>Made with illustrio</desc><g><g fill="none" fillRule="evenodd" stroke="none"><polygon fill="none" points="2.083 .038 8.925 6.88 15.768 .038 17.85 2.12 8.925 11.045 0 2.12" transform="translate(26.075 29.458)" stroke="none"></polygon></g></g></svg>
                    </div>
                </div>
                <div className={s.people}>
                    <div className={s.people__header}>
                        <h5 className="bs-header">Nasza ekipa</h5>
                    </div>
                    <div className={s.people__grid}>
                            {people.map((val, key) => <div key={key} className={s.person}>
                                <div className={s.person__image}>
                                <LazyLoadImage
                                src={createUrl(val.image, "_medium")} // use normal <img> attributes as props
                                effect="blur"
                            />
                            </div>
                            <div className={s.person__details}>
                                <h5>{val.name}</h5>
                                {/* <p>{val.description}</p> */}
                                <ReadMore
                                    initialHeight={200}
                                    readMore={props => (
                                        <button onClick={props.onClick}>{props.open ? 'Ukryj tekst' : 'Czytaj więcej'}</button>
                                    )}
                                    >
                                    <p>
                                        {val.description}
                                    </p>
                                </ReadMore>
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(About);