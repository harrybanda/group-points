import React, { Component } from "react";
import { database } from "../client";

import { Link } from "react-router-dom";

class NotMember extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupName: ""
    };
  }

  getGroupDetails = () => {
    const groupsRef = database.ref("groups").child(this.props.groupID);
    groupsRef.on("value", snapshot => {
      const groupName = snapshot.val().name;
      this.setState({
        groupName
      });
    });
  };

  componentDidMount() {
    this.getGroupDetails();
  }

  render() {
    return (
      <section className="hero is-light is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="subtitle is-5 has-text-grey">
              You are not yet a member of{" "}
              <span className="has-text-primary">{this.state.groupName}</span>
            </h1>

            <button className="button is-info" onClick={this.props.addMember}>
              Join Group
            </button>
            &nbsp;
            <Link to="/" className="button">
              Back Home
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

export default NotMember;
