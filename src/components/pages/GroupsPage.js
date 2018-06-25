import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import { app, database } from "../../client";
import axios from "axios";

import GroupBox from "../GroupBox";
import AddGroup from "../modals/AddGroup";
import Header from "../Header";
import Loading from "../Loading";
import { ServerValue } from "@firebase/database";

class GroupsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addedGroups: [],
      selectedGroup: { id: "default", name: "" },
      modalState: false,
      groupExists: false,
      loading: true,
      loadingButton: false
    };
  }

  toggleModal = () => {
    this.setState((prev, props) => {
      const newState = !prev.modalState;
      return {
        modalState: newState,
        selectedGroup: { id: "default", name: "" },
        groupExists: false,
        loadingButton: false
      };
    });
  };

  handleSelectChange = event => {
    this.setState({
      selectedGroup: {
        id: event.target.value,
        name: event.target.options[event.target.selectedIndex].text
      },
      groupExists: false,
      loadingButton: false
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    this.setState({ loadingButton: true });

    const self = this;
    const memberId = app.auth().currentUser.uid;
    const groupId = this.state.selectedGroup.id;
    const groupRef = database.ref("groups").child(groupId);
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

    groupRef.once("value", function(snapshot) {
      if (snapshot.exists()) {
        self.setState({ groupExists: true });
      } else {
        groupRef
          .set({
            name: self.state.selectedGroup.name,
            createdAt: ServerValue.TIMESTAMP
          })
          .then(() => {
            groupMemberRef.update({
              admin: true
            });
            memberRef.update({
              admin: true
            });
            self.toggleModal();
          });
      }
    });
  };

  saveUserData(userId, name, email, imageUrl) {
    const ref = database.ref("members").child(userId);
    ref.update({
      username: name,
      email: email,
      photo: imageUrl
    });
  }

  getManagedGroups() {
    app
      .auth()
      .getRedirectResult()
      .then(result => {
        if (result.user) {
          const data = result.user;
          this.saveUserData(
            data.uid,
            data.displayName,
            data.email,
            data.photoURL
          );
        }
        if (result.credential) {
          const token = result.credential.accessToken;
          axios
            .get(
              `https://graph.facebook.com/me?access_token=${token}&fields=groups,first_name`
            )
            .then(result => {
              let groupsData = result.data.groups.data;
              let firstname = result.data.first_name;
              localStorage.setItem("groups", JSON.stringify(groupsData));
              localStorage.setItem("firstname", firstname);
            })
            .catch(error => console.log(error));
        }
      });
  }

  getMemberCount = groupID => {
    let count = 0;
    const groupRef = database
      .ref("groups")
      .child(groupID)
      .child("members")
      .orderByChild("admin")
      .equalTo(false);
    groupRef.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        count++;
      });
    });
    return count;
  };

  addManagedGroups = () => {
    const memberId = app.auth().currentUser.uid;
    let newArray = [];

    const memberGroupsRef = database
      .ref("members")
      .child(memberId)
      .child("groups");

    memberGroupsRef.on("value", snap => {
      if (snap.exists()) {
        memberGroupsRef.on("child_added", snapshot => {
          database
            .ref("groups")
            .child(snapshot.key)
            .on("value", snap => {
              newArray.push({
                id: snapshot.key,
                name: snap.val().name,
                admin: snapshot.val().admin,
                timestamp: snap.val().createdAt
              });
              this.setState(
                {
                  addedGroups: this.removeDuplicates(newArray, "id")
                },
                function() {
                  this.setState({ loading: false });
                }
              );
            });
        });
      } else {
        this.setState({ loading: false });
      }
    });
  };

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  componentDidMount() {
    if (this.props.user) {
      this.getManagedGroups();
      this.addManagedGroups();
    }
  }

  render() {
    if (this.props.user) {
      let addedGroups = this.state.addedGroups;
      return (
        <Fragment>
          <Header user={this.props.user} isGroups={true} />
          <section
            className="section has-background-white-ter"
            style={{ minHeight: "91vh" }}
          >
            <div className="container">
              <div className="container">
                <div className="subtitle is-4">
                  <label className="has-text-grey">Groups</label>
                  <a
                    onClick={this.toggleModal}
                    className="button is-primary is-pulled-right"
                  >
                    <span className="icon">
                      <i className="fas fa-plus" />
                    </span>
                    <span>Add Group</span>
                  </a>
                </div>
              </div>
              <br />
              <br />
              <div className="container">
                {this.state.loading ? (
                  <div className="container has-text-centered">
                    <div style={{ paddingTop: "50px" }}>
                      <Loading />
                    </div>
                  </div>
                ) : (
                  <Fragment>
                    {!Array.isArray(addedGroups) || !addedGroups.length ? (
                      <div className="container has-text-centered">
                        <p
                          className="subtitle is-4 has-text-grey-light"
                          style={{ paddingTop: "50px" }}
                        >
                          No Groups
                        </p>
                      </div>
                    ) : (
                      <div className="columns is-multiline">
                        {this.state.addedGroups
                          .sort((a, b) => b.timestamp - a.timestamp)
                          .map((data, index) => (
                            <div key={index} className="column is-one-quarter">
                              <GroupBox
                                id={data.id}
                                name={data.name}
                                admin={data.admin}
                                memberCount={this.getMemberCount(data.id)}
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </Fragment>
                )}
              </div>
            </div>
          </section>
          <AddGroup
            closeModal={this.toggleModal}
            modalState={this.state.modalState}
            handleSelectChange={this.handleSelectChange}
            handleFormSubmit={this.handleFormSubmit}
            selectedGroup={this.state.selectedGroup}
            groupExists={this.state.groupExists}
            loadingButton={this.state.loadingButton}
          />
        </Fragment>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default GroupsPage;
