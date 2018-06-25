import React from "react";
import { Link } from "react-router-dom";

const GroupNotFound = () => (
  <section className="hero is-light is-fullheight">
    <div className="hero-body">
      <div className="container has-text-centered">
        <h1 className="subtitle is-4 has-text-grey">Group Not Found</h1>
        <Link to="/" className="button is-primary">Back Home</Link>
      </div>
    </div>
  </section>
);

export default GroupNotFound;
