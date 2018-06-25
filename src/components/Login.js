import React, { Component, Fragment } from "react";
import { app, provider } from "../client";

class Login extends Component {
  state = {
    loading: false
  };

  authWithFacebook = () => {
    this.setState({loading: true})
    app
      .auth()
      .signInWithRedirect(provider)
      .then(result => {})
      .catch(error => console.log(error));
  };

  render() {
    return (
      <Fragment>
        <button
          className={
            this.state.loading
              ? "button is-link is-rounded is-medium is-loading"
              : "button is-link is-rounded is-medium"
          }
          onClick={this.authWithFacebook}
        >
          <span className="icon">
            <i className="fab fa-facebook" />
          </span>
          <span>Login with facebook</span>
        </button>
      </Fragment>
    );
  }
}

export default Login;
