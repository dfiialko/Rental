import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ExpenseInputs from './Expenses';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import rootReducer from './reducer';
import { Tabs, Tab } from '@material-ui/core';
import { settings } from './settings';

const googleApiKey = settings.googleApiKey;
const root = ReactDOM.createRoot(document.getElementById('root'));
const script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`;
script.async = true;
script.defer = true;
document.body.appendChild(script);

const mapStateToProps = (state) => ({
  address: state.address
});

const TabContent = ({ store }) => ( 
    <Provider store={store}>
      <App />
      <ExpenseInputs />
    </Provider>
);

const ConnectedTabContent = connect(mapStateToProps)(TabContent);
const ReduxApp = () => {
  const [tabs, setTabs] = useState([createStore(rootReducer)]);
  const [selectedTab, setSelectedTab] = useState(0);

  const addTab = () => {
    setTabs([...tabs, createStore(rootReducer)])
  };

    const closeTab = (index) => {
    setTabs(tabs.filter((_, i) => i !== index))
    if (index === selectedTab) {
      setSelectedTab(0);
    }
  };

  return (
    <React.Fragment>
      
      <button onClick={addTab}>Add Tab</button>
      <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
        {tabs.map((store, index) => (
          <Tab key={index} label={
            <React.Fragment>
              {store.getState().address.replace("Edmonton","") || "undefined"}
              <button onClick={() => closeTab(index)}>Close</button>
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

root.render(
  <React.StrictMode>
    <ReduxApp />
  </React.StrictMode>
);

export default ReduxApp;
