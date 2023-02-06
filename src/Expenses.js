import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";

const ExpenseInputs = (props) => {
    const [expenses, setExpenses] = useState({
        taxes: 0,
        condoFee: 0,
        insurance: 70,
        propertyManagement: 10,
        vacancyAllowance: 5,
        repairsMaintenance: 5,
        heat: 0,
        electricity: 0,
        waterSewer: 0,
        bookKeeping: 0
      });
  let [totalExpense, setTotalExpense] = useState(0);
  const [inputText, setInputText] = useState("Input Text");
  const dispatch = useDispatch();
  const handleChange = (event) => {
    let value = parseFloat(event.target.value) || 0;
    setExpenses({
      ...expenses,
      [event.target.name]: value
    });
  };
  
  const handleExpenseUpdate = (event) => {
    if (event && event.target) {
        console.log(event.target.value);
      const inputText = event.target.value;
      setInputText(inputText);
      const regexTaxAmount = /Tax Amount\s*\$([\d,]+)/;
      const regexCondoFee = /Condo Fee\s*\$([\d,]+)/;
      const propertyPrice = /\$([\d,]+)\s*PHOTOS & MAP PROPERTY INFO COMMUNITY/;
      const address = /SORT BY New Match View DetailActive\s(.*?)Edmonton/;
      //const postalCode = /([A-Z]{1}\d{1}[A-Z]{1}\s\d{1}[A-Z]{1}\d{1})/;
      console.log(props.address);
      let taxesMatch = inputText.match(regexTaxAmount);
      let condoFeeMatch = inputText.match(regexCondoFee);
      let propPriceMatch = inputText.match(propertyPrice);
      let addressMatch = inputText.match(address);
      //let postalCodeMatch = inputText.match(postalCode);
      if(taxesMatch && condoFeeMatch){
        setExpenses({ ...expenses, taxes: (parseFloat(taxesMatch[1].trim().replace(/,/g, '')) / 12).toFixed(2), 
        condoFee: (parseFloat(condoFeeMatch[1].trim().replace(/,/g, ''))).toFixed(2) });   
        props.updatePropertyValue(propPriceMatch[1].trim().replace(/,/g, '')); 
        props.updateAddress(addressMatch[1].trim());// + ", " + postalCodeMatch[1].trim());
      }
    }
  };

  const calculateTotalExpense = () => {
    console.log(props.monthlyPayment);
    totalExpense = parseFloat(props.monthlyPayment);
    Object.entries(expenses).forEach(([expenseKey, expenseValue]) => {
      if (expenseKey === "propertyManagement" || expenseKey === "vacancyAllowance" || expenseKey === "repairsMaintenance") {
        console.log("expenseValue: ", expenseValue);
        totalExpense += props.totalIncome * parseFloat(expenseValue) / 100;
      } else {
        totalExpense += parseFloat(expenseValue);
      }
    });
    setTotalExpense(totalExpense);
};
  useEffect(() => {
    calculateTotalExpense();
  }, [expenses, props.monthlyPayment, props.totalIncome]);

  useEffect(() => {
    handleExpenseUpdate();
    }, [inputText]);

  return (
    <div className='container'>
        <div className="row">
            <label>Heat:</label>
            <input type="text" name="heat" value={expenses.heat} onChange={handleChange} />
        </div>
      <div className="row">
        <label>Electricity:</label>
        <input
            type="text"
            name="electricity"
            value={expenses.electricity}
            onChange={handleChange}
        />
      </div>
      <div className='row'>
        <label>Water/Sewer:</label>
        <input
            type="text"
            name="waterSewer"
            value={expenses.waterSewer}
            onChange={handleChange}
            />
      </div>
      <div className='row'>
        <label>Taxes:</label>
        <input type="text" name="taxes" value={expenses.taxes} onChange={handleChange} />
      </div>
      <div className='row'>
        <label>Condo Fee:</label>
        <input
            type="text"
            name="condoFee"
            value={expenses.condoFee}
            onChange={handleChange}
            />
      </div>
      <div className='row'>
        <label>Book Keeping:</label>
        <input
            type="text"
            name="bookKeeping"
            value={expenses.bookKeeping}
            onChange={handleChange}
        />
      </div>
      <div className='row'>
      <label>Insurance:</label>
      <input
        type="text"
        name="insurance"
        value={expenses.insurance}
        onChange={handleChange}
      />
      </div>
      <div className='row'>
      <label>Property Management:</label>
      <input
        type="text"
        name="propertyManagement"
        value={expenses.propertyManagement}
        onChange={handleChange}
      />
      </div>
      <div className='row'>
      <label>Vacancy Allowance:</label>
      <input
        type="text"
        name="vacancyAllowance"
        value={expenses.vacancyAllowance}
        onChange={handleChange}
      />
      </div>
      <div className='row'>
      <label>Repairs & Maintenance:</label>
      <input
        type="text"
        name="repairsMaintenance"
        value={expenses.repairsMaintenance}
        onChange={handleChange}
        />
    </div>
    <button onClick={calculateTotalExpense}>Calculate Total Expense</button>
    <div>
        Total Expense: {totalExpense}
    </div>
    <div>
        Income: {(props.totalIncome - totalExpense).toFixed(2)}
    </div>
    <input
        type="textarea"
        name="inputText"
        className = "inputTextArea"
        value={inputText}
         onChange={handleExpenseUpdate}
         style={{
             height: '150px',
             padding: '10px',
             fontSize: '14px',
             fontFamily: 'Arial'
         }}
        />
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
    updatePropertyValue: (value) => dispatch({ type: "SET_PROPERTY_VALUE", payload: value }),
    updateAddress: (value) => dispatch({ type: "SET_ADDRESS", payload: value })
    });
  
  export default connect(mapStateToProps, mapDispatchToProps)(ExpenseInputs);
