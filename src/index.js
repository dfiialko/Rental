import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ExpenseInputs from './Expenses';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import rootReducer from './reducer';
import { Tabs, Tab } from '@material-ui/core';

const root = ReactDOM.createRoot(document.getElementById('root'));
const mapStateToProps = (state) => ({
  address: state.address
});

const TabContent = ({ store }) => (
  console.log(store.getState()),
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

  return (
    <React.Fragment>
      <button onClick={addTab}>Add Tab</button>
      <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
        {tabs.map((store, index) => (
          <Tab key={index} label={store.getState().address || "undefined"} />
        ))}
      </Tabs>
      {tabs.map((store, index) => (
        <div style={{ display: selectedTab === index ? 'block' : 'none' }}>
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
