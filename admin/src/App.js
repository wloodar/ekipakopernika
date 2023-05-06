import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, BrowserRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import $ from 'jquery';
import setAuthToken from './redux/setAuthToken';
import { setCurrentUser, logoutUser } from './redux/actions/authentication';
import ScrollToTop from './functions/ScrollToTop';
import store from './redux/store';
import './sass/App.scss';
import { socket, connectPromise } from './socket.js';

import AppLayout from './components/layout/App/AppLayout';
import { Dashboard, Profile, Inbox, Admins, AdminsDetails, AdminsCreate, Events, ExactEvent, Categories, Publications, PublicationsPending, PublicationsNew, ViewPost, About } from './components/Pages/App';

connectPromise(0).then(
  res => {
      socket.on('connect', () => {
          // alert('Połączono ponownie');
          window.location.reload();
      });
  
      socket.io.on('connect_error', function(err) {
          // alert('Wystąpił problem z połączeniem z serwerem');
      });
  }
)

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded, {}));

  if (socket !== null) {
      socket.emit("ADMIN_ACTIVE", {adminuuid: decoded.uuid});
  }

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      window.location.href = '/';
  }
}

axios.interceptors.response.use(response => { 
    if (response.data.message !== undefined && response.data.message === "Twoje konto zostało zablokowane.") {
        alert('Twoje konto zostało zablokowane.');
        return Promise.reject({blocked: true});
    } else {
        return response;
    }
});

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <ScrollToTop>
    <Route {...rest} render={props => (
      <Layout>
        <Component {...props} />
      </Layout>
    )} />
  </ScrollToTop>
)

class App extends Component {

  constructor() {
      super();
      this.state = {
          socket: null
      };
  }

  render() {

    return(
      <Provider store={store}>
        <Router history={createBrowserHistory({ basename: "/admin" })}>
        {/* <BrowserRouter history={createBrowserHistory()} basename={"http://localhost:3001/admin34528"}> */}
          <Switch>
            <AppRoute exact path="/" layout={AppLayout} component={Dashboard}/>
            <AppRoute exact path="/profile" layout={AppLayout} component={Profile}/>
            <AppRoute exact path="/inbox" layout={AppLayout} component={Inbox}/>
            <AppRoute exact path="/admins" layout={AppLayout} component={Admins}/>
            <AppRoute path="/admins/user/:id" layout={AppLayout} component={AdminsDetails}/>
            <AppRoute exact path="/admins/create" layout={AppLayout} component={AdminsCreate}/>
            <AppRoute exact path="/events" layout={AppLayout} component={Events}/>
            <AppRoute exact path="/events/:seourl" layout={AppLayout} component={ExactEvent}/>
            <AppRoute exact path="/categories" layout={AppLayout} component={Categories}/>
            <AppRoute exact path="/publications" layout={AppLayout} component={Publications}/>
            <AppRoute exact path="/publications/new" layout={AppLayout} component={PublicationsNew}/>
            <AppRoute exact path="/publications/pending" layout={AppLayout} component={PublicationsPending}/>
            <AppRoute exact path="/publications/:id/view" layout={AppLayout} component={ViewPost}/>
            <AppRoute exact path="/about" layout={AppLayout} component={About}/>
          </Switch>
        </Router>
        {/* </BrowserRouter> */}
      </Provider>
    )
  }
}

export default App;
