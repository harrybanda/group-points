import React, { Fragment } from "react";

import Loading from "../Loading";

const cellStyle = {
  textAlign: "center",
  verticalAlign: "middle"
};

const Prizes = props => {
  const modalState = props.modalState;
  const closeModal = props.closeModal;
  const prizeData = props.prizeData;
  let loading = props.loadingPrizeData;
  const handleDel = props.handleDelete;
  const handleFormSubmit = props.handleFormSubmit;
  const handlePrizeChange = props.handlePrizeChange;
  const handlePointsChange = props.handlePointsChange;
  const enteredPrize = props.enteredPrize;
  const enteredPoints = props.enteredPoints;
  const isManage = props.isManage;

  if (!modalState) {
    return null;
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" />
      <div className="modal-card" style={{ width: "500px" }}>
        <header className="modal-card-head">
          <p className="modal-card-title has-text-grey-dark">Prizes</p>
          <button
            type="button"
            onClick={closeModal}
            className="delete"
            aria-label="close"
          />
        </header>
        <form onSubmit={handleFormSubmit}>
          <section className="modal-card-body">
            {isManage ? (
              <Fragment>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          placeholder="Prize name"
                          required
                          value={enteredPrize}
                          onChange={handlePrizeChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <div className="control">
                        <input
                          className="input"
                          type="text"
                          placeholder="Points to earn"
                          required
                          value={enteredPoints}
                          onChange={handlePointsChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <input
                        className="button is-success is-pulled-right"
                        type="submit"
                        value="Add Prize"
                      />
                    </div>
                  </div>
                </div>
                <hr className="is-marginless" />
                <br />
              </Fragment>
            ) : null}

            <div className="table-container">
              {loading ? (
                <div className="has-text-centered">
                  <div
                    className="subtitle is-5 has-text-grey-light"
                    style={{
                      paddingTop: "25px"
                    }}
                  >
                    <Loading />
                  </div>
                </div>
              ) : (
                <Fragment>
                  {!Array.isArray(prizeData) || !prizeData.length ? (
                    <div className="has-text-centered">
                      <p
                        className="subtitle is-5 has-text-grey-light"
                        style={{
                          paddingTop: "25px",
                          paddingBottom: "25px"
                        }}
                      >
                        No prizes
                      </p>
                    </div>
                  ) : (
                    <table className="table is-bordered is-hoverable is-fullwidth table-container">
                      <thead>
                        <tr>
                          <th style={cellStyle} className="has-text-grey">
                            Prize
                          </th>
                          <th style={cellStyle} className="has-text-grey">
                            Points to Earn
                          </th>
                          {isManage ? (
                            <th style={cellStyle} className="has-text-grey">
                              Action
                            </th>
                          ) : null}
                        </tr>
                      </thead>
                      <tbody>
                        {prizeData.map((data, index) => (
                          <tr key={index}>
                            <td style={cellStyle} className="has-text-grey">
                              {data.prize}
                            </td>
                            <td style={cellStyle} className="has-text-grey">
                              {data.points}
                            </td>
                            {isManage ? (
                              <td style={cellStyle}>
                                <a
                                  className="button is-danger"
                                  onClick={() => handleDel(data.id)}
                                >
                                  <span>Delete</span>
                                </a>
                              </td>
                            ) : null}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Fragment>
              )}
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default Prizes;
