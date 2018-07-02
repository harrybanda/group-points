import React, { Fragment } from "react";

const AddGroup = props => {
  const loadGroups = groups => {
    if (typeof groups === "undefined" || groups === null) {
      return (
        <option hidden value="">
          No managed groups
        </option>
      );
    } else {
      return (
        <Fragment>
          <option hidden value="">
            Choose a group
          </option>;
          {groups.map(data => (
            <option key={data.id} value={data.id}>
              {data.name}
            </option>
          ))}
        </Fragment>
      );
    }
  };

  const onEnterKeyPress = event => {
    if (event.which === 13) {
      event.preventDefault();
    }
  };

  const modalState = props.modalState;
  const closeModal = props.closeModal;
  const handleFormSubmit = props.handleFormSubmit;
  const handleSelectChange = props.handleSelectChange;
  const selectedGroup = props.selectedGroup;
  const groups = JSON.parse(localStorage.getItem("groups"));
  const groupExists = props.groupExists;
  let isLoading = props.loadingButton;

  if (!modalState) {
    return null;
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-card" style={{ width: "300px" }}>
        <form onKeyPress={onEnterKeyPress} onSubmit={handleFormSubmit}>
          <header className="modal-card-head">
            <p className="modal-card-title has-text-grey-dark">Add Group</p>
            <button
              type="button"
              className="delete"
              onClick={closeModal}
              aria-label="close"
            />
          </header>
          <section className="modal-card-body">
            <div className="field">
              <div className="control is-expanded">
                <div className="select is-fullwidth">
                  <select
                    value={selectedGroup.id}
                    onChange={handleSelectChange}
                    required
                  >
                    {loadGroups(groups)}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              {groupExists ? (
                <p className="has-text-danger">Group already exists</p>
              ) : (
                <br />
              )}
            </div>
          </section>
          <footer className="modal-card-foot">
            {groupExists ? (
              <input className="button is-primary" type="submit" value="Save" />
            ) : (
              <Fragment>
                {isLoading ? (
                  <a className="button is-primary is-loading">Save</a>
                ) : (
                  <input
                    className="button is-primary"
                    type="submit"
                    value="Save"
                  />
                )}
              </Fragment>
            )}

            <button className="button" type="button" onClick={closeModal}>
              Cancel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default AddGroup;
