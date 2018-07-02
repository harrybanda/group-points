import React from "react";
import { Link } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";

const GroupBox = props => {
  const { id, name, memberCount, admin } = props;
  return (
    <div
      className="box"
      style={{
        paddingTop: "15px",
        paddingBottom: "15px",
        height: "100%"
      }}
    >
      <div
        className="title is-6 has-text-grey"
        style={{
          marginBottom: "15px"
        }}
      >
        {admin ? (
          <span className="tag is-danger is-pulled-right">Admin</span>
        ) : null}

        <strong>
          <LinesEllipsis
            text={name}
            maxLine="1"
            ellipsis="..."
            trimRight
            basedOn="letters"
          />
        </strong>
      </div>
      <hr
        style={{
          marginTop: "0px",
          marginBottom: "15px"
        }}
      />
      <div className="subtitle is-6 has-text-centered has-text-grey-light">
        <span className="icon is-small has-text-info">
          <i className="far fa-user" />
        </span>
        {"\u00A0"}
        <span>{memberCount} Members</span>
      </div>
      <div className="has-text-centered">
        {admin ? (
          <Link to={"/" + id + "/manage"} className="button is-primary ">
            <span>Open</span>
          </Link>
        ) : (
          <Link to={"/" + id + "/home"} className="button is-primary ">
            <span>Open</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default GroupBox;
