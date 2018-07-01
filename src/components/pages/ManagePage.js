import React, { Fragment, Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { app, database } from "../../client";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import { ServerValue } from "@firebase/database";

import "react-toastify/dist/ReactToastify.min.css";

import Reward from "../modals/Reward";
import Profile from "../modals/Profile";
import Header from "../Header";
import Loading from "../Loading";
import GroupNotFound from "../GroupNotFound";

const cellStyle = {
  textAlign: "center",
  verticalAlign: "middle"
};

const Loader = () => (
  <section className="hero has-background-white-ter is-fullheight">
    <div className="hero-body">
      <div className="container has-text-centered">
        <Loading />
        <p className="has-text-grey">loading</p>
      </div>
    </div>
  </section>
);

class ManagePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shareLink: "http://localhost:3000/" + this.props.params.groupid,
      groupid: this.props.params.groupid,
      groupName: "",
      rewardModalState: false,
      profileModalState: false,
      members: [],
      enteredURL: "",
      selectedMember: "",
      selectedMemberData: {},
      postData: [],
      groupExists: false,
      isAdmin: false,
      isMember: false,
      loadingAdminCheck: true,
      loadingGroupCheck: true,
      loadingMemberCheck: true,
      search: "",
      selectedPoints: "",
      loadingPostData: true,
      loadingMembers: true
    };
  }

  notifyCopied = () => {
    toast("👍 Copied!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false
    });
  };

  notifyRewarded = () => {
    toast("🏆 Rewarded!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false
    });
  };

  checkMember() {
    const self = this;
    const memberId = app.auth().currentUser.uid;
    const memberRef = database
      .ref("groups")
      .child(this.state.groupid)
      .child("members")
      .child(memberId);

    memberRef.once("value", function(snapshot) {
      if (snapshot.exists()) {
        self.setState(
          { isMember: true, loadingMemberCheck: false },
          function() {
            self.checkAdmin();
          }
        );
      } else {
        self.setState({ isMember: false, loadingMemberCheck: false });
      }
    });
  }

  checkAdmin = () => {
    const self = this;
    const memberId = app.auth().currentUser.uid;
    const memberRef = database
      .ref("members")
      .child(memberId)
      .child("groups")
      .child(this.state.groupid);

    memberRef.on("value", snapshot => {
      const admin = snapshot.val().admin;
      self.setState({ isAdmin: admin, loadingAdminCheck: false }, function() {
        if (admin) {
          this.getGroupDetails();
          this.getGroupMembers();
        }
      });
    });
  };

  checkGroup = () => {
    const self = this;
    const groupRef = database.ref("groups").child(this.state.groupid);

    groupRef.once("value", function(snapshot) {
      if (snapshot.exists()) {
        self.setState(
          { groupExists: true, loadingGroupCheck: false },
          function() {
            this.checkMember();
          }
        );
      } else {
        self.setState({ groupExists: false, loadingGroupCheck: false });
      }
    });
  };

  getMemberCount() {
    let count = 0;
    const groupRef = database
      .ref("groups")
      .child(this.state.groupid)
      .child("members")
      .orderByChild("admin")
      .equalTo(false);
    groupRef.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        count++;
      });
    });
    return count;
  }

  handleReward = e => {
    this.toggleRewardModal();
    this.setState({ selectedMember: e });
  };

  openProfile = e => {
    this.toggleProfileModal();
    this.setState({ selectedMemberData: e }, function() {
      this.getPostData(e);
    });
  };

  toggleRewardModal = () => {
    this.setState((prev, props) => {
      const newState = !prev.rewardModalState;
      return {
        rewardModalState: newState
      };
    });
  };

  toggleProfileModal = () => {
    this.setState((prev, props) => {
      const newState = !prev.profileModalState;
      return {
        profileModalState: newState,
        postData: [],
        loadingPostData: true
      };
    });
  };

  handleURLChange = event => {
    this.setState({ enteredURL: event.target.value });
  };

  handleRateChange = event => {
    this.setState({ selectedPoints: event.target.value });
  };

  handleRewardFormSubmit = event => {
    event.preventDefault();
    this.toggleRewardModal();
    this.notifyRewarded();

    const self = this;
    let points = 0;
    const memberId = this.state.selectedMember;
    const groupID = this.state.groupid;
    const link = this.state.enteredURL;
    const selectedPoints = Number(this.state.selectedPoints);
    const memberRef = database
      .ref("members")
      .child(memberId)
      .child("groups")
      .child(groupID);

    const groupRef = database
      .ref("groups")
      .child(groupID)
      .child("members")
      .child(memberId);

    const postRef = database
      .ref("posts")
      .child(groupID)
      .child(memberId);

    memberRef
      .once("value", function(snapshot) {
        points = snapshot.val().points + selectedPoints;

        memberRef.update({
          points: points
        });

        groupRef.update({
          points: points
        });

        postRef.push({
          link: link,
          points: selectedPoints,
          createdAt: ServerValue.TIMESTAMP
        });

        self.getGroupMembers();
      })
  };

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  getGroupMembers = () => {
    let newArray = [];

    const groupMemberRef = database
      .ref("groups")
      .child(this.state.groupid)
      .child("members")
      .orderByChild("admin")
      .equalTo(false);

    groupMemberRef.on("value", snap => {
      if (snap.exists()) {
        groupMemberRef.on("child_added", snapshot => {
          database
            .ref("members")
            .child(snapshot.key)
            .on("value", snap => {
              newArray.push({
                id: snapshot.key,
                username: snap.val().username,
                photo: snap.val().photo,
                points: snapshot.val().points
              });
              this.setState({
                members: this.removeDuplicates(newArray, "id"),
                loadingMembers: false
              });
            });
        });
      } else {
        this.setState({ loadingMembers: false });
      }
    });
  };

  getGroupDetails = () => {
    const groupsRef = database.ref("groups").child(this.state.groupid);
    groupsRef.on("value", snapshot => {
      const groupName = snapshot.val().name;
      this.setState({
        groupName
      });
    });
  };

  updateSearch = event => {
    this.setState({ search: event.target.value });
  };

  getPostData(e) {
    const self = this;
    let newArray = [];
    const memberId = e.id;
    const groupID = this.state.groupid;
    const postRef = database
      .ref("posts")
      .child(groupID)
      .child(memberId);

    postRef.once("value", function(snapshot) {
      if (snapshot.exists()) {
        postRef.on("child_added", snap => {
          newArray.push({
            id: snap.key,
            link: snap.val().link,
            timestamp: snap.val().createdAt,
            points: snap.val().points
          });
          self.setState({
            postData: newArray,
            loadingPostData: false
          });
        });
      } else {
        self.setState({ loadingPostData: false });
      }
    });
  }

  goToLb = () => {
    this.setState({ redirectToLb: true });
  };

  handleDeleteActivity = e => {
    const userID = this.state.selectedMemberData.id;
    const userPoints = this.state.selectedMemberData.points;
    const groupID = this.state.groupid;
    const subVal = e.points;
    const id = e.id;

    const groupMemberRef = database
      .ref("groups")
      .child(groupID)
      .child("members")
      .child(userID);

    const memberGroupRef = database
      .ref("members")
      .child(userID)
      .child("groups")
      .child(groupID);

    const postRef = database
      .ref("posts")
      .child(groupID)
      .child(userID)
      .child(id);

    let afterSub = userPoints - subVal;

    groupMemberRef.update({
      points: afterSub
    });

    memberGroupRef.update({
      points: afterSub
    });

    let selectedMemberData = { ...this.state.selectedMemberData };
    selectedMemberData.points = afterSub;
    this.setState({ selectedMemberData });

    postRef.remove();

    this.getGroupMembers();

    if (afterSub === 0) {
      this.setState({ postData: [] });
    } else {
      this.getPostData(this.state.selectedMemberData);
    }
  };

  componentDidMount() {
    if (this.props.user) {
      this.checkGroup();
    }
  }

  componentWillUnmount() {
    database.ref("groups").off();
  }

  render() {
    if (this.props.user) {
      if (this.state.loadingGroupCheck) {
        return <Loader />;
      }
      if (!this.state.groupExists) {
        return <GroupNotFound />;
      } else {
        if (this.state.loadingMemberCheck) {
          return <Loader />;
        }
        if (!this.state.isMember) {
          return <Redirect to={"/" + this.state.groupid + "/"} />;
        } else {
          if (this.state.loadingAdminCheck) {
            return <Loader />;
          }
          if (!this.state.isAdmin) {
            return <Redirect to={"/" + this.state.groupid + "/"} />;
          } else {
            const search = this.state.search;
            let filtered = this.state.members.filter(member => {
              return member.username.search(new RegExp(search, "i")) !== -1;
            });
            return (
              <Fragment>
                <Header user={this.props.user} isGroups={false} />
                <section
                  className="section has-background-white-ter"
                  style={{ minHeight: "91vh" }}
                >
                  <div className="container">
                    <div className="container">
                      <div className="columns is-centered">
                        <div className="column is-half">
                          <div className="box">
                            <div>
                              <label className="has-text-primary title is-4">
                                {this.state.groupName}
                              </label>
                            </div>
                            <hr
                              style={{
                                marginTop: "10px",
                                marginBottom: "10px"
                              }}
                            />
                            <span className="has-text-grey-light">
                              Invite link
                            </span>
                            <br />
                            <div className="columns">
                              <div className="column">
                                <div className="field has-addons">
                                  <div className="control is-expanded">
                                    <input
                                      className="input is-small"
                                      type="text"
                                      value={this.state.shareLink}
                                      readOnly
                                    />
                                  </div>
                                  <div className="control">
                                    <CopyToClipboard
                                      text={this.state.shareLink}
                                    >
                                      <button
                                        className="button is-small"
                                        onClick={this.notifyCopied}
                                      >
                                        <span className="icon">
                                          <i className="fas fa-link" />
                                        </span>
                                        <span>Copy</span>
                                      </button>
                                    </CopyToClipboard>
                                  </div>
                                </div>
                              </div>
                              <div className="column">
                                <div className="field is-grouped is-grouped-right">
                                  <p className="control">
                                    <a
                                      className="button is-link is-small"
                                      target="_blank"
                                      href={
                                        "https://www.facebook.com/groups/" +
                                        this.state.groupid
                                      }
                                    >
                                      <span className="icon">
                                        <i className="fab fa-facebook" />
                                      </span>
                                      <span>Open Group</span>
                                    </a>
                                  </p>
                                  <p className="control">
                                    <Link
                                      to={"/" + this.state.groupid + "/home"}
                                      className="button is-primary is-small"
                                    >
                                      <span className="icon">
                                        <i className="fas fa-trophy" />
                                      </span>
                                      <span>Leaderboard</span>
                                    </Link>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="column is-one-quarter">
                          <div
                            className="box has-text-centered"
                            style={{
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center"
                            }}
                          >
                            <div>
                              <h1 className="title has-text-primary">
                                {this.getMemberCount()}
                              </h1>
                              <h2 className="subtitle is-5 has-text-grey">
                                Members
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="container">
                      <div className="columns is-centered">
                        <div className="column is-three-quarters">
                          <div className="box" style={{ height: "100%" }}>
                            <div className="columns">
                              <div className="column">
                                <label className="has-text-primary title is-5">
                                  Members
                                </label>
                              </div>
                              <div className="column is-one-third">
                                <p className="control has-icons-left">
                                  <input
                                    type="text"
                                    className="input"
                                    placeholder="Find a member"
                                    value={search}
                                    onChange={this.updateSearch}
                                  />
                                  <span className="icon is-left">
                                    <i className="fas fa-search" />
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="table-container">
                              {this.state.loadingMembers ? (
                                <div className="has-text-centered">
                                  <div
                                    className="subtitle is-5 has-text-grey-light"
                                    style={{
                                      paddingTop: "25px"
                                    }}
                                  >
                                    <Loading />
                                  </div>
                                </div>
                              ) : (
                                <Fragment>
                                  {!Array.isArray(this.state.members) ||
                                  !this.state.members.length ? (
                                    <div className="has-text-centered">
                                      <p
                                        className="subtitle is-4 has-text-grey-light"
                                        style={{
                                          paddingTop: "25px",
                                          paddingBottom: "25px"
                                        }}
                                      >
                                        No Members
                                      </p>
                                    </div>
                                  ) : (
                                    <table className="table is-bordered is-hoverable is-fullwidth table-container">
                                      <thead>
                                        <tr>
                                          <th
                                            style={cellStyle}
                                            className="has-text-grey"
                                          >
                                            Photo
                                          </th>
                                          <th
                                            style={cellStyle}
                                            className="has-text-grey"
                                          >
                                            Name
                                          </th>
                                          <th
                                            style={cellStyle}
                                            className="has-text-grey"
                                          >
                                            Points
                                          </th>
                                          <th
                                            className="has-text-grey"
                                            style={cellStyle}
                                            colSpan="2"
                                          >
                                            Actions
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {filtered
                                          .sort((a, b) => b.points - a.points)
                                          .map((data, index) => (
                                            <tr key={index}>
                                              <td
                                                style={cellStyle}
                                                className="has-text-grey"
                                              >
                                                <img
                                                  className="is-small"
                                                  src={data.photo}
                                                  alt="DP"
                                                  style={{
                                                    borderRadius: "50%"
                                                  }}
                                                />
                                              </td>
                                              <td
                                                style={cellStyle}
                                                className="has-text-grey"
                                              >
                                                {data.username}
                                              </td>
                                              <td
                                                style={cellStyle}
                                                className="has-text-grey"
                                              >
                                                {data.points}
                                              </td>
                                              <td style={cellStyle}>
                                                <a
                                                  className="button is-primary"
                                                  onClick={() =>
                                                    this.handleReward(data.id)
                                                  }
                                                >
                                                  <span className="icon">
                                                    <i className="far fa-star" />
                                                  </span>
                                                  <span>Reward</span>
                                                </a>
                                              </td>
                                              <td style={cellStyle}>
                                                <a
                                                  className="button"
                                                  onClick={() =>
                                                    this.openProfile(data)
                                                  }
                                                >
                                                  <span>View</span>
                                                </a>
                                              </td>
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  )}
                                </Fragment>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <Reward
                  closeModal={this.toggleRewardModal}
                  modalState={this.state.rewardModalState}
                  handleChange={this.handleURLChange}
                  handleFormSubmit={this.handleRewardFormSubmit}
                  value={this.enteredURL}
                  selectValue={this.selectedPoints}
                  handleRateChange={this.handleRateChange}
                />
                <Profile
                  closeModal={this.toggleProfileModal}
                  modalState={this.state.profileModalState}
                  userData={this.state.selectedMemberData}
                  postData={this.state.postData}
                  loadingPostData={this.state.loadingPostData}
                  isManage={true}
                  handleDeleteActivity={this.handleDeleteActivity}
                />
                <ToastContainer
                  position="top-center"
                  autoClose={3000}
                  hideProgressBar
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnVisibilityChange={false}
                  pauseOnHover={false}
                />
              </Fragment>
            );
          }
        }
      }
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default ManagePage;
