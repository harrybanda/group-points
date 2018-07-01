import React, { Fragment, Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { app, database } from "../../client";
import axios from "axios";

import Profile from "../modals/Profile";
import LbListItem from "../LbListItem";
import Header from "../Header";
import Loading from "../Loading";
import GroupNotFound from "../GroupNotFound";
import NotMember from "../NotMember";

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

class LeaderboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupid: this.props.params.groupid,
      groupName: "",
      groupExists: false,
      isAdmin: false,
      isMember: false,
      loadingAdminCheck: true,
      loadingGroupCheck: true,
      loadingMemberCheck: true,
      members: [],
      myPoints: "",
      profileModalState: false,
      postData: [],
      selectedMemberData: {},
      position: "",
      ordinal: "",
      loadLeaderboard: true,
      loadingPostData: true
    };
  }

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

  openProfile = e => {
    this.toggleProfileModal();
    this.setState({ selectedMemberData: e }, function() {
      this.getPostData(e);
    });
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

  goToManage = () => {
    this.setState({ redirectToManage: true });
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
        this.getGroupDetails();
        this.getGroupMembers();
        this.getPoints();
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

  getGroupDetails = () => {
    const groupsRef = database.ref("groups").child(this.state.groupid);
    groupsRef.on("value", snapshot => {
      const groupName = snapshot.val().name;
      this.setState({
        groupName
      });
    });
  };

  addMemberToGroup = () => {
    const memberId = app.auth().currentUser.uid;
    const groupId = this.state.groupid;

    const memberRef = database
      .ref("members")
      .child(memberId)
      .child("groups")
      .child(groupId);

    const groupMemberRef = database
      .ref("groups")
      .child(groupId)
      .child("members")
      .child(memberId);

    groupMemberRef.update({
      admin: false,
      points: 0
    });
    memberRef.update({
      admin: false,
      points: 0
    });

    this.checkMember();
  };

  updateMember() {
    app
      .auth()
      .getRedirectResult()
      .then(result => {
        if (result.user) {
          const data = result.user;
          const ref = database.ref("members").child(data.uid);
          ref.update({
            username: data.displayName,
            email: data.email,
            photo: data.photoURL
          });
        }
        if (result.credential) {
          const token = result.credential.accessToken;
          axios
            .get(
              `https://graph.facebook.com/me?access_token=${token}&fields=groups,first_name`
            )
            .then(result => {
              let firstname = result.data.first_name;
              localStorage.setItem("firstname", firstname);
              let groupsData = result.data.groups.data;
              localStorage.setItem("groups", JSON.stringify(groupsData));
            })
            .catch(error => console.log(error));
        }
      });
  }

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  getPoints = () => {
    const memberId = app.auth().currentUser.uid;
    const groupId = this.state.groupid;
    const memberRef = database
      .ref("members")
      .child(memberId)
      .child("groups")
      .child(groupId);
    memberRef.on("value", snapshot => {
      const points = snapshot.val().points;
      this.setState({
        myPoints: points
      });
    });
  };

  getIndex(value, arr, prop) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][prop] === value) {
        return i + 1;
      }
    }
    return "";
  }

  getGetOrdinal(n) {
    var s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  }

  getGroupMembers = () => {
    let newArray = [];

    const groupMemberRef = database
      .ref("groups")
      .child(this.state.groupid)
      .child("members")
      .orderByChild("points")
      .startAt(10);

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
              this.setState(
                {
                  members: this.removeDuplicates(newArray, "id")
                },
                function() {
                  this.setState(
                    {
                      position: this.getIndex(
                        app.auth().currentUser.uid,
                        this.state.members,
                        "id"
                      ),
                      loadLeaderboard: false
                    },
                    function() {
                      this.setState({
                        ordinal: this.getGetOrdinal(this.state.position)
                      });
                    }
                  );
                }
              );
            });
        });
      } else {
        this.setState({ loadLeaderboard: false });
      }
    });
  };

  componentDidMount() {
    this.cancelSource = axios.CancelToken.source();
    if (this.props.user) {
      this.updateMember();
      this.checkGroup();
      this.getGroupMembers();
    }
  }

  componentWillUnmount() {
    this.cancelSource.cancel();
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
          return (
            <NotMember
              groupID={this.state.groupid}
              addMember={this.addMemberToGroup}
            />
          );
        } else {
          if (this.state.loadingAdminCheck) {
            return <Loader />;
          }
          return (
            <Fragment>
              <Header user={this.props.user} isGroups={false} />
              <section
                className="section has-background-white-ter"
                style={{ minHeight: "91vh" }}
              >
                <div className="container">
                  <div className="columns is-centered">
                    <div className="column is-half">
                      <p
                        className="has-text-primary"
                        style={{ padding: "5px" }}
                      >
                        Leaderboard
                      </p>
                      <table style={{ width: "100%" }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: "5px" }}>
                              {!this.state.isAdmin ? (
                                <div className="box has-text-centered has-background-primary">
                                  <p className="title is-5 has-text-white ">
                                    {this.state.groupName}
                                  </p>
                                  <div className="columns is-mobile is-vcentered">
                                    <div className="column has-text-centered">
                                      <h1>
                                        <span className="subtitle is-3 has-text-white">
                                          {this.state.position}
                                        </span>
                                        <span className="subtitle is-5 has-text-white">
                                          {this.state.ordinal}
                                        </span>
                                      </h1>
                                    </div>
                                    <div className="column has-text-centered">
                                      <figure
                                        className="image is-64x64"
                                        style={{
                                          marginLeft: "auto",
                                          marginRight: "auto"
                                        }}
                                      >
                                        <img
                                          src={this.props.user.photoURL}
                                          alt="DP"
                                          style={{
                                            borderRadius: "50%",
                                            border: "3px solid #fff"
                                          }}
                                        />
                                      </figure>
                                    </div>
                                    <div className="column has-text-centered">
                                      <h1>
                                        <span className="subtitle is-3 has-text-white">
                                          {this.state.myPoints}
                                        </span>
                                        <span className="subtitle is-5 has-text-white">
                                          pts
                                        </span>
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="box has-text-centered has-background-primary">
                                  <p className="title is-5 has-text-white ">
                                    {this.state.groupName}
                                  </p>
                                  <div className="columns is-vcentered">
                                    <div className="column has-text-centered">
                                      <Link
                                        to={
                                          "/" + this.state.groupid + "/manage"
                                        }
                                        className="button"
                                      >
                                        Manage
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>

                          {this.state.loadLeaderboard ? (
                            <tr>
                              <td className="has-text-centered">
                                <div style={{ paddingTop: "25px" }}>
                                  <Loading />
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <Fragment>
                              {!Array.isArray(this.state.members) ||
                              !this.state.members.length ? (
                                <tr>
                                  <td className="has-text-centered">
                                    <p
                                      className="subtitle is-4 has-text-grey-light"
                                      style={{ paddingTop: "25px" }}
                                    >
                                      No Members
                                    </p>
                                  </td>
                                </tr>
                              ) : (
                                <Fragment>
                                  {this.state.members
                                    .sort((a, b) => b.points - a.points)
                                    .map((data, index) => (
                                      <tr key={index}>
                                        <td style={{ padding: "5px" }}>
                                          <LbListItem
                                            data={data}
                                            index={index}
                                            openProfile={this.openProfile}
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                </Fragment>
                              )}
                            </Fragment>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
              <Profile
                closeModal={this.toggleProfileModal}
                modalState={this.state.profileModalState}
                userData={this.state.selectedMemberData}
                postData={this.state.postData}
                loadingPostData={this.state.loadingPostData}
                isManage={false}
              />
            </Fragment>
          );
        }
      }
    } else {
      return <Redirect to={"/" + this.state.groupid} />;
    }
  }
}

export default LeaderboardPage;
