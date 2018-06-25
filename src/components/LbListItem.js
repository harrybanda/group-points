import React, { Component } from "react";

class LbListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMouseInside: false
    };
  }

  mouseEnter = () => {
    this.setState({ isMouseInside: true });
  };
  mouseLeave = () => {
    this.setState({ isMouseInside: false });
  };

  render() {
    const data = this.props.data;
    const index = this.props.index;
    const openProfile = this.props.openProfile;
    return (
      <div
        className={
          this.state.isMouseInside ? "box has-background-white-ter" : "box"
        }
        style={{
          paddingTop: "5px",
          paddingBottom: "5px",
          cursor: "pointer"
        }}
        onClick={() => openProfile(data)}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        <div className="columns is-mobile is-vcentered">
          <div className="column is-narrow">
            <h1 className="subtitle is-3 has-text-primary">{index + 1}</h1>
          </div>
          <div className="column is-narrow">
            <figure
              className="image is-32x32"
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <img src={data.photo} alt="DP" style={{ borderRadius: "50%" }} />
            </figure>
          </div>
          <div className="column is-narrow">
            <p className="has-text-grey ">{data.username}</p>
          </div>
          <div className="column">
            <h1 className="subtitle is-5 has-text-primary is-pulled-right">
              {data.points}
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default LbListItem;
