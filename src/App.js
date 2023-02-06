import React, { useState, useEffect } from 'react';
import './App.css';
import { connect, useDispatch } from 'react-redux';

const App = (props) => {
  const [units, setUnits] = useState([{ id: 1, rentalIncome: "" }]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [propertyValue, setPropertyValue] = useState(0);
  const [downPayment, setDownPayment] = useState(20);
  const [amortization, setAmortization] = useState(30);
  const [rate, setRate] = useState(5.39);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const handleChange = (e, id) => {
    const updatedUnits = units.map(unit => {
      if (unit.id === id) {
        return { ...unit, rentalIncome: e.target.value };
      }
      return unit;
    });
    setUnits(updatedUnits);
    let income = updatedUnits.reduce((acc, unit) => acc + Number(unit.rentalIncome || 0), 0);
    setTotalIncome(
      income
    );
    props.setTotalIncome(income);
  };

  const handleAddUnit = () => {
    setUnits([
      ...units,
      { id: units.length + 1, rentalIncome: "" }
    ]);
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    calculateMonthlyPayment();
  }, [props.propertyValue,amortization,rate, downPayment]);

  const calculateMonthlyPayment = () => {
    console.log(props.propertyValue);
    let P = props.propertyValue * (1 - downPayment / 100);
    let i = rate / 100 / 12;
    let n = amortization * 12;   
    let payment = P * (i * (1 + i)**n) / ((1 + i)**n - 1);
  setMonthlyPayment(payment.toFixed(2));
  props.setMonthlyPayment(payment.toFixed(2));
 
  };

  const handlePropertyValueChange = (e) => {
    setPropertyValue(e.target.value);
    props.updatePropertyValue(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    props.updateAddress(e.target.value);
  };

  const handleDownPaymentChange = e => {
    setDownPayment(e.target.value);
  };

  const handleAmortizationChange = e => {
    setAmortization(e.target.value);
  };

  const handleRateChange = e => {
    setRate(e.target.value);
  };

return (
<div id="incomeField">
  <div id="propertyValueComponent">
    <h2>Property</h2>
    <div className="ui form">
      <div className="field">
        <label>Value</label>
        <input type="number" name="propertyValue" value={props.propertyValue} onChange={handlePropertyValueChange} className="ui input" />
      </div>
      <div className="field">
        <label>Amortization</label>
        <input type="number" name="amortization" value={amortization} onChange={handleAmortizationChange} className="ui input" />
      </div>
      <div className="field">
        <label>Rate</label>
        <input type="number" name="rate" value={rate} onChange={handleRateChange} className="ui input" />
      </div>
      <div className="field">
        <label>Down Payment</label>
        <input type="number" name="downPayment" value={downPayment} onChange={handleDownPaymentChange} className="ui input" />
      </div>
      <div className="field">
        <label>Address</label>
        <input type="text" name="address" value={props.address} onChange={handleAddressChange} className="ui input" />
      </div>
      <h3>{monthlyPayment}</h3>
    </div>
  </div>
  <div id="rentalCount">
    <h2>Rental Units</h2>
    {units.map(unit => (
      <div key={unit.id} className="field">
        <input
          type="number"
          value={unit.rentalIncome}
          onChange={e => handleChange(e, unit.id)}
          className="ui input"
        />
      </div>
    ))}
    <button onClick={handleAddUnit} className="ui button">Add Unit</button>
    <div>Total Rental Income: {totalIncome}</div>
    <div className="field">
      <input type="file" onChange={handleFileChange} className="ui input" />
      {image && (
        <img src={image} id="propPhoto" alt="Uploaded Image" />
      )}
    </div>
  </div>
</div>
);
};
const mapStateToProps = (state) => ({
  totalIncome: state.totalIncome,
  monthlyPayment: state.monthlyPayment,
  propertyValue: state.propertyValue,
  address: state.address
});

const mapDispatchToProps = (dispatch) => ({
  setTotalIncome: (totalIncome) => dispatch({ type: 'SET_TOTAL_INCOME', payload: totalIncome }),
  setMonthlyPayment: (monthlyPayment) => dispatch({ type: 'SET_MONTHLY_PAYMENT', payload: monthlyPayment }),
  updatePropertyValue: value => dispatch({ type: 'SET_PROPERTY_VALUE', payload: value }),
  updateAddress: value => dispatch({ type: 'SET_ADDRESS', payload: value })
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
