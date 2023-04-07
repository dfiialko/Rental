import React, { useState, useEffect } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { settings } from './settings';
import { Button } from '@material-ui/core';
import { Form, Row, Col } from 'react-bootstrap';

const App = (props) => {
  const [units, setUnits] = useState([{ id: 1, rentalIncome: '' }]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [propertyValue, setPropertyValue] = useState(0);
  const [downPayment, setDownPayment] = useState(settings.downPaymentDefaultRate);
  const [amortization, setAmortization] = useState(settings.amortizationDefaultRate);
  const [rate, setRate] = useState(settings.rateDefaultRate);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [address, setAddress] = useState('');
  const [downPaymentCash, setDownPaymentCash] = useState(0);

  const handleChange = (e, id) => {
    const updatedUnits = units.map(unit => {
      if (unit.id === id) {
        return { ...unit, rentalIncome: e.target.value };
      }
      return unit;
    });

    setUnits(updatedUnits);

    const income = updatedUnits.reduce((acc, unit) => acc + Number(unit.rentalIncome || 0), 0);
    setTotalIncome(income);
    props.setTotalIncome(income);
  };

  const handleAddUnit = () => {
    setUnits([...units, { id: units.length + 1, rentalIncome: '' }]);
  };

  const initMap = () => {
    const map = new window.google.maps.Map(document.getElementById(`map-${props.address}`), {
      zoom: 11,
      center: { lat: 53.5315, lng: -113.40 }
    });

    const searchLocation = props.address + settings.city;

    if (searchLocation && searchLocation.length > 10) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchLocation }, (results, status) => {
        if (status === 'OK') {
          map.setCenter(results[0].geometry.location);
          const marker = new window.google.maps.Marker({
            position: results[0].geometry.location,
            map: map
          });
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    }

    return map;
  };

  useEffect(() => {
    calculateMonthlyPayment();
  }, [props.propertyValue, amortization, rate, downPayment]);

  const calculateMonthlyPayment = () => {
    const P = props.propertyValue * (1 - downPayment / 100);
    const i = rate / 100 / 12;
    const n = amortization * 12;
    const payment = P * (i * (1 + i) ** n) / ((1 + i) ** n - 1);

    setMonthlyPayment(payment.toFixed(2));
    props.setMonthlyPayment(payment.toFixed(2));
  };

  const handlePropertyValueChange = (e) => {
    const propValue = e.target.value.replace(/,/g, '');
    setPropertyValue(propValue);
    setDownPaymentCash(propValue * downPayment / 100);
    props.updatePropertyValue(propValue);
    props.setDownPaymentCash(propValue * downPayment / 100);
    props.setInterestRate(rate);
  };
  
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    props.updateAddress(e.target.value);
  };

  const handleDownPaymentChange = e => {
    setDownPayment(e.target.value);
    setDownPaymentCash(e.target.value * propertyValue / 100);
  };

  const handleDownPaymentCashChange = e => {
    setDownPayment(e.target.value / propertyValue * 100);
    setDownPaymentCash(e.target.value);
  };

  const handleAmortizationChange = e => {
    setAmortization(e.target.value);
  };

  const handleRateChange = e => {
    setRate(e.target.value);
    props.setInterestRate(e.target.value);
  };

  return (
    <div>
      <div id={`map-${props.address}`} className="map-google" />
      <Button onClick={initMap} id="initMapButton" className="ui button" variant="outlined">
        Show Map
      </Button>
      <div id="column2">
        <div id="propertyValueComponent">
          <div id="propertyH2">
            <h2>Property</h2>
          </div>
          <div>
            <b>Mortgage: </b>
            {monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            /month
          </div>
          <Form>
            <Row>
              <Col>
                <Form.Label>Value</Form.Label>
                <Form.Control
                  type="text"
                  name="propertyValue"
                  value={propertyValue}
                  onChange={handlePropertyValueChange}
                  className="ui input"
                />
              </Col>
              <Col>
                <Form.Label>Amortization</Form.Label>
                <Form.Control
                  type="number"
                  name="amortization"
                  value={amortization}
                  onChange={handleAmortizationChange}
                  className="ui input"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Rate</Form.Label>
                <Form.Control
                  type="number"
                  name="rate"
                  value={rate}
                  onChange={handleRateChange}
                  className="ui input"
                />
              </Col>
              <Col>
                <Form.Label>Down Payment</Form.Label>
                <Form.Control
                  type="number"
                  name="downPayment"
                  value={downPayment}
                  onChange={handleDownPaymentChange}
                  className="ui input"
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Cash</Form.Label>
                <Form.Control
                  type="number"
                  name="downPayment"
                  value={downPaymentCash}
                  onChange={handleDownPaymentCashChange}
                  className="ui input"
                />
              </Col>
              <Col>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={address}
                  onChange={handleAddressChange}
                  className="ui input"
                />
              </Col>
            </Row>
          </Form>
        </div>

        <div id="rentalCount">
          <h2>Rental Units</h2>
          <Form>
            <Row>
              <Col>
                {units.map((unit) => (
                  <div key={unit.id}>
                    <Form.Label>Unit #{unit.id}</Form.Label>
                    <Form.Control
                      type="number"
                      value={unit.rentalIncome}
                      onChange={(e) => handleChange(e, unit.id)}
                      className="rental-unit-input"
                    />
                  </div>
                ))}
              </Col>
              <Col>
                <div id="rental-income-total">
                  <Form.Label>Total Rental Income: {totalIncome}</Form.Label>
                </div>
                <Button onClick={handleAddUnit} id="addButton" className="ui button" variant="outlined">
                  Add Unit
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  totalIncome: state.totalIncome,
  monthlyPayment: state.monthlyPayment,
  downPaymentCash: state.downPaymentCash,
  interestRate: state.interestRate,
  propertyValue: state.propertyValue,
  address: state.address,
  googleMap: state.googleMap,
  map: state.map,
});

const mapDispatchToProps = (dispatch) => ({
  setTotalIncome: (totalIncome) => dispatch({ type: "SET_TOTAL_INCOME", payload: totalIncome }),
  setMonthlyPayment: (monthlyPayment) => dispatch({ type: "SET_MONTHLY_PAYMENT", payload: monthlyPayment }),
  setDownPaymentCash: (downPaymentCash) => dispatch({ type: "SET_DOWN_PAYMENT_CASH", payload: downPaymentCash }),
  setInterestRate: (interestRate) => dispatch({ type: "SET_INTEREST_RATE", payload: interestRate }),
  updatePropertyValue: (value) => dispatch({ type: "SET_PROPERTY_VALUE", payload: value }),
  updateAddress: (value) => dispatch({ type: "SET_ADDRESS", payload: value }),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
