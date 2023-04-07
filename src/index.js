import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ExpenseInputs from './Expenses';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import rootReducer from './reducer';
import { Tabs, Tab, Button,IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { settings } from './settings';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



const mapStateToProps = (state) => ({
  address: state.address
});

const TabContent = ({ store }) => ( 
  <Provider store={store}>
    <Container>
      <Row>
        <Col md="6" lg="6">
          <App />
        </Col>
        <Col md="6" lg="6">
          <ExpenseInputs />
        </Col>
      </Row>
    </Container>
  </Provider>
);

const ConnectedTabContent = connect(mapStateToProps)(TabContent);
const ReduxApp = () => {
  const [tabs, setTabs] = useState([createStore(rootReducer)]);
  const [selectedTab, setSelectedTab] = useState(0);

  const addTab = () => {
    setTabs([...tabs, createStore(rootReducer)])
  };
  const initMap = () => {
    console.log("initMap");
  }

    const closeTab = (index) => {
    setTabs(tabs.filter((_, i) => i !== index))
    if (index === selectedTab) {
      setSelectedTab(0);
    }
  };

  return (
    <React.Fragment>
      
      <Button variant="success" onClick={addTab}>Add Tab</Button>
      <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
        {tabs.map((store, index) => (
          <Tab key={index} label={
            <React.Fragment>
              <div style={{ position: "absolute", top: -5, right: 0 }}>
                <IconButton onClick={() => closeTab(index)} onContextMenu={(e) => {
                  e.preventDefault();
                  closeTab(index);
                }}>
                  <CloseIcon />
                </IconButton>
              </div>
              {store.getState().address.replace("Edmonton","") || "Tab " + (index + 1)}
            </React.Fragment>
          } />
        ))}
      </Tabs>
      {tabs.map((store, index) => (
        <div id="flex" style={{ display: selectedTab === index ? 'block' : 'none' }}>
            <ConnectedTabContent key={index} store={store} />
        </div>
      ))}
    </React.Fragment>
    
  );
  
};

const googleApiKey = settings.googleApiKey;
const root = ReactDOM.render(<ReduxApp />, document.getElementById('root'));
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`;
script.async = true;
script.defer = true;
document.body.appendChild(script);

export default ReduxApp;
