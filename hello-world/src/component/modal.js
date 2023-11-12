import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import "./test.css";

export default class Dashboard extends React.Component {
	
	// State to store the status of showing the modal. Defaults to false.
  state = { show: false };

	// Method to show modal, activated when you clicky the OPEN button
  showModal = () => {
    this.setState({ show: true });
  };

	// Method to hide modal, activated by handleClose prop on the <Modal>
  hideModal = () => {
    this.setState({ 
			show: false
		});
  };

	// Rendering the component
	// This render contains an instance of the Modal that is created underneath it.
	// Usually this would probably be a separate component you would import
	// That's why there are props being passed in (handleClose)

  render() {
    return (
      <div>
        <h3>React Modal</h3>
        <button type='button' onClick={this.showModal}>Open</button>
				
				<Modal show={this.state.show} handleClose={this.hideModal} children="something">					
          <p>Modal</p>
          <p>Data</p>
        </Modal>
      </div>
    )
  }
};

// This is the Modal component imported into the app.
// 
// Props come from the creation of <Modal> in the return above.
// Children is a special prop to pass in, well the children!
const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName} onClick={handleClose}>
      <section className="modal-main" onClick={event => event.stopPropagation()}>
        {children}
        <button onClick={handleClose}>close</button>
      </section>
    </div>
  );
};

ReactDOM.render(<Dashboard />, document.getElementById('root'));