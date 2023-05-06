import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import store from './redux/store';
import jwt_decode from 'jwt-decode';
import { setCurrentUser, logoutUser } from './redux/actions/authentication';
import setAuthToken from './redux/functions/setAuthToken';
import ScrollToTop from './functions/ScrollToTop';
import './sass/App.scss';

import { AppLayout, UploadLayout } from './components/Layouts';
import { Explore, ExactPost, Categories, CategoriesDetails, Events, EventDetails, About, Upload } from './components/Pages';

const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
  <ScrollToTop>
    <Route {...rest} render={props => (
      <Layout>
        <Component {...props} />
      </Layout>
    )} />
  </ScrollToTop>  
)



if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded, {}));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      window.location.href = '/login';
  }
}


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
        <Router history={createBrowserHistory()}>
          <Switch>
              <AppRoute exact path="/" layout={AppLayout} component={Explore}/>
              <AppRoute exact path="/kategorie" layout={AppLayout} component={Categories}/>
              <AppRoute exact path="/kategorie/:name" layout={AppLayout} component={CategoriesDetails}/>
              <AppRoute exact path="/wydarzenia" layout={AppLayout} component={Events}/>
              <AppRoute exact path="/wydarzenia/example" layout={AppLayout} component={EventDetails}/>
              <AppRoute exact path="/onas" layout={AppLayout} component={About}/>

              <AppRoute exact path="/dodaj" layout={AppLayout} component={Upload}/>

              <AppRoute path="/:shortid" layout={AppLayout} component={ExactPost}/>
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;
