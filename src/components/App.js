import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { app } from "../client";

import "bulma/css/bulma.css";
import "@fortawesome/fontawesome";
import "@fortawesome/fontawesome-free-regular";
import "@fortawesome/fontawesome-free-solid";
import "@fortawesome/fontawesome-free-brands";

import LandingPage from "./pages/LandingPage";
import GroupsPage from "./pages/GroupsPage";
import ManagePage from "./pages/ManagePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import GroupLandingPage from "./pages/GroupLandingPage";
import Loading from "./Loading";

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: {},
      loading: true
    };
  }

  componentDidMount() {
    this.authListener();
  }

  authListener() {
    app.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user: user,
          loading: false
        });
      } else {
        this.setState({
          user: null,
          loading: false
        });
      }
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <section className="hero has-background-white-ter is-fullheight">
          <div className="hero-body">
            <div className="container has-text-centered">
              <Loading />
              <p className="has-text-grey">loading</p>
            </div>
          </div>
        </section>
      );
    }
    return (
      <Router>
        <Fragment>
          <Route
            exact
            path="/"
            render={props => <LandingPage user={this.state.user} />}
          />
          <Route
            exact
            path="/admin/groups"
            render={props => <GroupsPage user={this.state.user} />}
          />
          <Route
            exact
            path="/:groupid"
            render={({ user, match }) => (
              <GroupLandingPage user={this.state.user} params={match.params} />
            )}
          />
          <Route
            exact
            path="/:groupid/manage"
            render={({ user, match }) => (
              <ManagePage user={this.state.user} params={match.params} />
            )}
          />
          <Route
            exact
            path="/:groupid/home"
            render={({ user, match }) => (
              <LeaderboardPage user={this.state.user} params={match.params} />
            )}
          />
        </Fragment>
      </Router>
    );
  }
}

export default App;
