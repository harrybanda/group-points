import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import logo from "../../logo.png";

import Login from "../Login";

const LandingPage = props => (
  <div>
    {props.user ? (
      <Redirect to="/admin/groups" />
    ) : (
      <Fragment>
        <section className="hero is-bold is-primary is-fullheight">
          <div className="hero-body">
            <div className="container has-text-centered">
              <div className="columns is-centered">
                <div className="column is-three-fifths">
                  <img src={logo} alt="GP" width="200" />
                  <br />
                  <br />
                  <br />
                  <h1 className="subtitle is-2">Boost community engagement</h1>
                  <h1 className="subtitle is-5">
                    Reward members for sharing knowledge
                  </h1>
                </div>
              </div>
              <Login />
            </div>
          </div>
        </section>
      </Fragment>
    )}
  </div>
);

export default LandingPage;
