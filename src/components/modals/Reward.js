import React, { Component } from "react";

class Reward extends Component {
  onEnterKeyPress(event) {
    if (event.which === 13) {
      event.preventDefault();
    }
  }

  render() {
    const modalState = this.props.modalState;
    const closeModal = this.props.closeModal;
    const handleFormSubmit = this.props.handleFormSubmit;
    const handleChange = this.props.handleChange;
    const value = this.props.value;
    const handleRateChange = this.props.handleRateChange;
    const selectValue = this.props.selectValue;

    if (!modalState) {
      return null;
    }

    return (
      <div className="modal is-active">
        <div className="modal-background" />
        <div className="modal-card" style={{ width: "300px" }}>
          <form onKeyPress={this.onEnterKeyPress} onSubmit={handleFormSubmit}>
            <header className="modal-card-head">
              <p className="modal-card-title has-text-grey-dark">Reward</p>
              <button className="delete" onClick={closeModal} aria-label="close" />
            </header>
            <section className="modal-card-body">
              <div className="field">
                <p className="control has-icons-left is-expanded">
                  <span className="select is-fullwidth">
                    <select
                      defaultValue={selectValue}
                      onChange={handleRateChange}
                      required
                    >
                      <option hidden value="">
                        Rate post
                      </option>
                      <option type="number" value="10">
                        Good (10 points)
                      </option>
                      <option type="number" value="30">
                        Great (30 points)
                      </option>
                      <option type="number" value="50">
                        Excellent (50 points)
                      </option>
                    </select>
                  </span>
                  <span className="icon is-small is-left">
                    <i className="far fa-star" />
                  </span>
                </p>
              </div>

              <div className="field">
                <div className="control has-icons-left">
                  <input
                    className="input"
                    placeholder="Paste link to post here"
                    required
                    value={value}
                    onChange={handleChange}
                  />
                  <span className="icon is-left">
                    <i className="fas fa-link" />
                  </span>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <input className="button is-primary" type="submit" value="Save" />
              <button className="button" type="button" onClick={closeModal}>
                Cancel
              </button>
            </footer>
          </form>
        </div>
      </div>
    );
  }
}

export default Reward;
