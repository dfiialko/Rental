import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { settings } from "./settings";

const ExpenseInputs = (props) => {
    const [expenses, setExpenses] = useState({
        taxes: 0,
        condoFee: 0,
        insurance: settings.insuranceDefaultRate,
        propertyManagement: settings.propertyManagementDefaultRate,
        vacancyAllowance: settings.vacancyAllowanceDefaultRate,
        repairsMaintenance: settings.repairsMaintenanceDefaultRate,
        heat: 0,
        electricity: 0,
        waterSewer: 0,
        bookKeeping: settings.bookKeepingDefaultRate
      });
  let [totalExpense, setTotalExpense] = useState(0);
  const [inputText, setInputText] = useState("");
  const handleChange = (event) => {
    let value = parseFloat(event.target.value) || 0;
    setExpenses({
      ...expenses,
      [event.target.name]: value
    });
  };
  
  const handleExpenseUpdate = (inputFromText) => {
    if(inputFromText){
      const regexTaxAmount = /Tax Amount\s*\$([\d,]+)/;
      const regexCondoFee = /Condo Fee\s*\$([\d,]+)/;
      const propertyPrice = /\$\d{1,3}(,\d{3})*/;
      const address = /^(\d+\s\d+\s[\w\s]+)/;
      let taxesMatch = props.inputText.match(regexTaxAmount);
      let condoFeeMatch = props.inputText.match(regexCondoFee);
      let propPriceMatch = props.inputText.match(propertyPrice);
      let addressMatch = props.inputText.match(address);
      console.log(props.inputText.match(address));
      console.log(props.inputText.match(propertyPrice));;
      if(taxesMatch && condoFeeMatch){
        setExpenses({ ...expenses, taxes: (parseFloat(taxesMatch[1].trim().replace(/,/g, '')) / 12).toFixed(2), 
        condoFee: (parseFloat(condoFeeMatch[1].trim().replace(/,/g, ''))).toFixed(2) }); 
        //props.updatePropertyValue(propPriceMatch[1].trim().replace(/,/g, '')); 
        //props.updateAddress(addressMatch[1].trim() + " Edmonton");
      }
      if(propPriceMatch && addressMatch){
        props.updatePropertyValue(propPriceMatch[0].trim().replace(/,/g, '').replace("$",''));
        props.updateAddress(addressMatch[1].trim().replace("Active",''));
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
    props.updateInputText(inputText);
    handleExpenseUpdate(inputText);
    }, [inputText]);

  return (
    <div id="column1" >
      <h2>Expenses</h2>
      <div>
        <b>Total Expense:</b> {totalExpense.toFixed(2)} <b>Income:</b> {(props.totalIncome - totalExpense).toFixed(2)}
    </div>
      <div className='expenses'>       
      <div className='row'>
        <label>CollabCenter</label>
        <input
          type="textarea"
          name={"inputText"}
          className = "inputTextArea"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
        <div className="row">
            <label>Heat:</label>
            <input type="text" name="heat" value={expenses.heat} onChange={handleChange} />
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
        <label>Bookkeeping</label>
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
      <label>Management:</label>
      <input
        type="text"
        name="propertyManagement"
        value={expenses.propertyManagement}
        onChange={handleChange}
      />
      </div>
      <div className='row'>
      <label>Vacancy:</label>
      <input
        type="text"
        name="vacancyAllowance"
        value={expenses.vacancyAllowance}
        onChange={handleChange}
      />
      </div>
      <div className='row'>
      <label>Maintenance:</label>
      <input
        type="text"
        name="repairsMaintenance"
        value={expenses.repairsMaintenance}
        onChange={handleChange}
        />
    </div>
    <button onClick={calculateTotalExpense}>Calculate Total Expense</button>
    </div>

    </div>
    );
};

const mapStateToProps = (state) => ({
    totalIncome: state.totalIncome,
    monthlyPayment: state.monthlyPayment,
    propertyValue: state.propertyValue,
    address: state.address,
    inputText: state.inputText
  });

  const mapDispatchToProps = (dispatch) => ({
    updatePropertyValue: (value) => dispatch({ type: "SET_PROPERTY_VALUE", payload: value }),
    updateAddress: (value) => dispatch({ type: "SET_ADDRESS", payload: value }),
    updateInputText: (value) => dispatch({ type: "SET_INPUT_TEXT", payload: value })
    });
  
  export default connect(mapStateToProps, mapDispatchToProps)(ExpenseInputs);
