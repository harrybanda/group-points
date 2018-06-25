import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { database } from "../../client";

import Login from "../Login";
import Loading from "../Loading";
import logo from "../../logo.png";
import GroupNotFound from "../GroupNotFound";

class GroupLandingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupid: this.props.params.groupid,
      groupExists: false,
      loading: true,
      groupName: ""
    };
  }

  checkGroup = () => {
    const self = this;
    const groupRef = database.ref("groups").child(this.state.groupid);
    groupRef.once("value", function(snapshot) {
      if (snapshot.exists()) {
        self.setState({ groupExists: true, loading: false }, function() {
          this.getGroupDetails();
        });
      } else {
        self.setState({ groupExists: false, loading: false });
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

  componentDidMount() {
    const user = this.props.user;
    if (typeof user === "undefined" || user === null) {
      this.checkGroup();
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const groupID = this.state.groupid;
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

    if (this.props.user) {
      return <Redirect to={"/" + groupID + "/home"} />;
    } else {
      if (!this.state.groupExists) {
        return <GroupNotFound />
      } else {
        return (
          <section className="hero is-bold is-primary is-fullheight">
            <div className="hero-body">
              <div className="container has-text-centered">
                <div className="columns is-centered">
                  <div className="column is-three-fifths">
                    <img src={logo} alt="GP" width="200" />
                    <br />
                    <br />
                    <br />
                    <h1 className="subtitle is-2">
                      Earn points for sharing knowledge
                    </h1>
                    <h1 className="subtitle is-5">
                      login in to view{" "}
                      <span className="has-text-warning">
                        {this.state.groupName}
                      </span>
                    </h1>
                  </div>
                </div>
                <Login />
              </div>
            </div>
          </section>
        );
      }
    }
  }
}

export default GroupLandingPage;
