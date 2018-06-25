import React, { Fragment, Component } from "react";
import { Link } from "react-router-dom";
import { app } from "../client";

import logo from "../logo.png";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdown: false,
      isMenuOpen: false
    };
  }

  handleDropdownOpen = () => {
    this.setState({ isDropdown: true });
  };

  handleDropdownClose = () => {
    this.setState({ isDropdown: false });
  };

  handleMenuClick = () => {
    this.setState(function(prevState) {
      return { isMenuOpen: !prevState.isMenuOpen };
    });
  };

  logout() {
    app.auth().signOut();
    localStorage.clear();
  }

  goHome = () => {
    this.setState({ redirectToHome: true });
  };

  componentDidMount() {
    document.body.classList.add("has-navbar-fixed-top");
  }

  componentWillUnmount() {
    document.body.classList.remove("has-navbar-fixed-top");
  }

  render() {
    const fName = localStorage.getItem("firstname");
    return (
      <Fragment>
        <nav className="navbar is-info is-fixed-top">
          <div className="container">
            <div className="navbar-brand">
              <Link to="/" className="navbar-item">
                <img src={logo} alt="GP" width="150" />
              </Link>
              <div
                className={
                  this.state.isMenuOpen
                    ? "navbar-burger burger is-active"
                    : "navbar-burger burger"
                }
                data-target="navbar-menu-data"
                onClick={this.handleMenuClick}
              >
                <span />
                <span />
                <span />
              </div>
            </div>
            <div
              id="navbar-menu-data"
              className={
                this.state.isMenuOpen ? "navbar-menu is-active" : "navbar-menu"
              }
            >
              <div className="navbar-start">
              </div>
              <div className="navbar-end">
                <div
                  className={
                    this.state.isDropdown
                      ? "navbar-item has-dropdown is-active"
                      : "navbar-item has-dropdown"
                  }
                  onMouseEnter={this.handleDropdownOpen}
                  onMouseLeave={this.handleDropdownClose}
                >
                  <a className="navbar-link">
                    <img
                      src={this.props.user.photoURL}
                      alt="DP"
                      style={{ borderRadius: "50%" }}
                    />
                    &nbsp; {fName}
                  </a>
                  <div
                    className="navbar-dropdown navbar-item is-right"
                    onClick={this.logout}
                  >
                    <a className="navbar-item has-dropdown">
                      <span className="icon">
                        <i className="fas fa-sign-out-alt has-text-grey-dark" />
                      </span>
                      <span>Logout</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </Fragment>
    );
  }
}

export default Header;
