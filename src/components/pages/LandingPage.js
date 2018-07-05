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
        <section className="hero is-bold is-primary is-half">
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
              <br />
              <br />
              <Login />
            </div>
          </div>
        </section>
        <section className="section has-background-light">
          <div className="container has-text-centered">
            <h1 className="title is-2 has-text-primary">How it works</h1>
            <br />
            <br />
            <br />
            <div className="columns is-centered">
              <div className="column is-three-quarters">
                <div className="box">
                  <div className="column">
                    <span className="icon is-large">
                      <i
                        className="fab fa-facebook icon is-large"
                        style={{ color: "#3b5998" }}
                      />
                    </span>
                    <br />
                    <br />
                    <h1 className="title has-text-primary is-4">
                      Add Facebook Groups
                    </h1>
                    <p className="subtitle has-text-grey is-5">
                      You can add any Facebook group that you manage to Group
                      Points.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="columns is-centered">
              <div className="column is-three-quarters">
                <div className="box">
                  <div className="column">
                    <span className="icon is-large">
                      <i className="fas fa-link icon is-large has-text-info" />
                    </span>
                    <br />
                    <br />
                    <h1 className="title has-text-primary is-4">
                      Invite Group Members
                    </h1>
                    <p className="subtitle has-text-grey is-5">
                      After adding a group, you can invite members to join with
                      an invite link.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="columns is-centered">
              <div className="column is-three-quarters">
                <div className="box">
                  <div className="column">
                    <span className="icon is-large">
                      <i className="fas fa-star icon is-large has-text-warning" />
                    </span>
                    <br />
                    <br />
                    <h1 className="title has-text-primary is-4">Points</h1>
                    <p className="subtitle has-text-grey is-5">
                      If a group member writes or shares a post to your Facebook
                      group, that is helpful and relevant to the community, you
                      can reward that member with points.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="columns is-centered">
              <div className="column is-three-quarters">
                <div className="box">
                  <div className="column">
                    <span className="icon is-large">
                      <i className="fas fa-list icon is-large has-text-danger" />
                    </span>
                    <br />
                    <br />
                    <h1 className="title has-text-primary is-4">
                      Member Activity
                    </h1>
                    <p className="subtitle has-text-grey is-5">
                      A record of each rewarded member's post and the number of
                      points they have earned is stored and can be viewed by
                      other group members.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="columns is-centered">
              <div className="column is-three-quarters">
                <div className="box">
                  <div className="column">
                    <span className="icon is-large">
                      <i className="far fa-smile icon is-large has-text-info" />
                    </span>
                    <br />
                    <br />
                    <h1 className="title has-text-primary is-4">
                      Contribution Rating
                    </h1>
                    <p className="subtitle has-text-grey is-5">
                      Points are given to a member based on how helpful and
                      relevant that contribution is to the community. Members
                      can earn{" "}
                      <span className="has-text-primary">10 points</span> for a
                      good post,{" "}
                      <span className="has-text-primary">30 points</span> for a
                      great post and{" "}
                      <span className="has-text-primary">50 points</span> for an
                      excellent post.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="columns is-centered">
              <div className="column is-three-quarters">
                <div className="box">
                  <div className="column">
                    <span className="icon is-large">
                      <i className="fas fa-trophy icon is-large has-text-warning" />
                    </span>
                    <br />
                    <br />
                    <h1 className="title has-text-primary is-4">
                      Leaderboard
                    </h1>
                    <p className="subtitle has-text-grey is-5">
                      The leaderboard is there to showcase how members are
                      performing against each other and to challenge the members
                      to get ahead of each other by simply contributing to the
                      Facebook group.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="columns is-centered">
              <div className="column is-three-quarters">
                <div className="box">
                  <div className="column">
                    <span className="icon is-large">
                      <i className="fas fa-gift icon is-large has-text-danger" />
                    </span>
                    <br />
                    <br />
                    <h1 className="title has-text-primary is-4">
                      Valuable Rewards
                    </h1>
                    <p className="subtitle has-text-grey is-5">
                      Group admins can choose to reward a member with valuable
                      prizes depending on the number of points a member has
                      earned.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    )}
  </div>
);

export default LandingPage;
