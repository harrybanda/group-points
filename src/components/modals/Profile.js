import React, { Component, Fragment } from "react";
import moment from "moment";

import Loading from "../Loading";

class Profile extends Component {
  render() {
    const modalState = this.props.modalState;
    const closeModal = this.props.closeModal;
    const userData = this.props.userData;
    const postData = this.props.postData;
    let loading = this.props.loadingPostData;

    if (!modalState) {
      return null;
    }

    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-card" style={{ width: "400px" }}>
          <header className="modal-card-head">
            <p className="modal-card-title has-text-grey-dark">Profile</p>
            <button
              onClick={closeModal}
              className="delete"
              aria-label="close"
            />
          </header>
          <section className="modal-card-body">
            <div className="columns is-mobile is-centered">
              <div className="column has-text-centered">
                <figure
                  className="image is-64x64"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                >
                  <img
                    src={userData.photo}
                    alt="DP"
                    style={{ borderRadius: "50%" }}
                  />
                </figure>
                <br />
                <p className="title is-5 has-text-grey">{userData.username}</p>
                <p className="subtitle is-6 has-text-primary">
                  {userData.points + " Points"}
                </p>
              </div>
            </div>
            <hr className="is-marginless" />
            <br />
            <p className="has-text-grey">Activity</p>
            <br />

            {loading ? (
              <div className="has-text-centered">
                <div style={{ paddingTop: "25px" }}>
                  <Loading />
                </div>
              </div>
            ) : (
              <Fragment>
                {!Array.isArray(postData) || !postData.length ? (
                  <div className="has-text-centered">
                    <p
                      className="subtitle is-5 has-text-grey-light"
                      style={{
                        paddingTop: "25px"
                      }}
                    >
                      No Activity
                    </p>
                  </div>
                ) : (
                  <Fragment>
                    {postData
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((data, index) => (
                        <div
                          key={index}
                          className="box"
                          style={{ padding: "0px 10px 0px 10px" }}
                        >
                          <div className="columns is-mobile is-vcentered">
                            <div className="column">
                              <p className="title is-6 has-text-grey">
                                Earned{" "}
                                <span className="has-text-primary">
                                  {data.points}
                                </span>{" "}
                                points
                              </p>
                              <p className="subtitle is-7 has-text-grey-light">
                                {moment(data.timestamp).fromNow()}
                              </p>
                            </div>
                            <div className="column">
                              <a
                                className="button is-link is-pulled-right is-rounded is-small"
                                href={data.link}
                                target="_blank"
                              >
                                <span className="icon">
                                  <i className="fab fa-facebook" />
                                </span>
                                <span>View Post</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                  </Fragment>
                )}
              </Fragment>
            )}
            <br />
          </section>
        </div>
      </div>
    );
  }
}

export default Profile;
