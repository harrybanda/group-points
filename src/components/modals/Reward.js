import React from "react";

const Reward = props => {
  const onEnterKeyPress = event => {
    if (event.which === 13) {
      event.preventDefault();
    }
  };

  const modalState = props.modalState;
  const closeModal = props.closeModal;
  const handleFormSubmit = props.handleFormSubmit;
  const handleChange = props.handleChange;
  const value = props.value;
  const handleRateChange = props.handleRateChange;
  const selectValue = props.selectValue;

  if (!modalState) {
    return null;
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-card" style={{ width: "300px" }}>
        <form onKeyPress={onEnterKeyPress} onSubmit={handleFormSubmit}>
          <header className="modal-card-head">
            <p className="modal-card-title has-text-grey-dark">Reward</p>
            <button
              type="button"
              className="delete"
              onClick={closeModal}
              aria-label="close"
            />
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
};

export default Reward;
