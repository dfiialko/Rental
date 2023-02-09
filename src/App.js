import React, { useState, useEffect } from 'react';
import './App.css';
import { connect, useDispatch } from 'react-redux';
import { settings } from './settings';

const App = (props) => {
  const [units, setUnits] = useState([{ id: 1, rentalIncome: "" }]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [propertyValue, setPropertyValue] = useState(0);
  const [downPayment, setDownPayment] = useState(settings.downPaymentDefaultRate);
  const [amortization, setAmortization] = useState(settings.amortizationDefaultRate);
  const [rate, setRate] = useState(settings.rateDefaultRate);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState("");
  const [downPaymentCash, setDownPaymentCash] = useState(0);
  //const dispatch = useDispatch();


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
    let P = props.propertyValue * (1 - downPayment / 100);
    let i = rate / 100 / 12;
    let n = amortization * 12;   
    let payment = P * (i * (1 + i)**n) / ((1 + i)**n - 1);
  setMonthlyPayment(payment.toFixed(2));
  props.setMonthlyPayment(payment.toFixed(2));
 
  };

  const handlePropertyValueChange = (e) => {
    setPropertyValue(e.target.value);
    setDownPaymentCash(e.target.value * downPayment / 100);
    props.updatePropertyValue(e.target.value);
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
  };

return (  
<div>
<div id="propertyImage">  
      {image && (
        <img src={image} id="propPhoto" style={{ height: '100%', width: '100%' }} alt="Uploaded Image" />
      )}
</div>
<div id={`map-${props.address}`} className='mapGoogle' />

<button onClick={initMap} id="initMapButton" className="ui button">Show Map</button>
<div id="column2">

    <input type="file" onChange={handleFileChange} className="ui input" />
  <div id="propertyValueComponent">
    <h2>Property</h2>
    <div><b>Mortgage: </b>{monthlyPayment.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}/month</div>
    <div className="container">
      <div className="row">
        <label>Value</label>
        <input type="text" name="propertyValue" value={props.propertyValue} onChange={handlePropertyValueChange} className="ui input" />
      </div>
      <div className="row">
        <label>Amortization</label>
        <input type="number" name="amortization" value={amortization} onChange={handleAmortizationChange} className="ui input" />
      </div>
      <div className="row">
        <label>Rate</label>
        <input type="number" name="rate" value={rate} onChange={handleRateChange} className="ui input" />
      </div>
      <div className="row">
        <label>Down Payment</label>
        <input type="number" name="downPayment" value={downPayment} onChange={handleDownPaymentChange} className="ui input" />
      </div>
            <div className="row">
        <label>Cash</label>
        <input type="number" name="downPayment" value={downPaymentCash} onChange={handleDownPaymentCashChange} className="ui input" />
      </div>
      <div className="row">
        <label>Address</label>
        <input type="text" name="address" value={props.address} onChange={handleAddressChange} className="ui input" />
      </div>
      
      
    </div>
  </div>
  
  <div id="rentalCount">
    <h2>Rental Units</h2>
    {units.map(unit => (
      <div key={unit.id} className="row">
        <input
          type="number"
          value={unit.rentalIncome}
          onChange={e => handleChange(e, unit.id)}
          className="ui input"
        />
      </div>
    ))}
    <button onClick={handleAddUnit} id="addButton" className="ui button">Add Unit</button>
    <div>Total Rental Income: {totalIncome}</div>

  </div>

</div>
</div>
);
};
const mapStateToProps = (state) => ({
  totalIncome: state.totalIncome,
  monthlyPayment: state.monthlyPayment,
  propertyValue: state.propertyValue,
  address: state.address,
  googleMap: state.googleMap,
  map: state.map
});

const mapDispatchToProps = (dispatch) => ({
  setTotalIncome: (totalIncome) => dispatch({ type: 'SET_TOTAL_INCOME', payload: totalIncome }),
  setMonthlyPayment: (monthlyPayment) => dispatch({ type: 'SET_MONTHLY_PAYMENT', payload: monthlyPayment }),
  updatePropertyValue: value => dispatch({ type: 'SET_PROPERTY_VALUE', payload: value }),
  updateAddress: value => dispatch({ type: 'SET_ADDRESS', payload: value })
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
