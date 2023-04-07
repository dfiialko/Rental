import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { settings } from "./settings";
import { Button } from "@material-ui/core";
import { Form, Row, Col } from "react-bootstrap";

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
    bookKeeping: settings.bookKeepingDefaultRate,
  });
  const [image, setImage] = useState(null);
  const [roi, setRoi] = useState(0);
  let [totalExpense, setTotalExpense] = useState(0);
  const [inputText, setInputText] = useState("");
  const handleChange = (event) => {
    let value = parseFloat(event.target.value) || 0;
    setExpenses({
      ...expenses,
      [event.target.name]: value,
    });
  };

  const handleExpenseUpdate = (inputFromText) => {
    if (inputFromText) {
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
      if (taxesMatch && condoFeeMatch) {
        setExpenses({
          ...expenses,
          taxes: (parseFloat(taxesMatch[1].trim().replace(/,/g, "")) / 12).toFixed(2),
          condoFee: (parseFloat(condoFeeMatch[1].trim().replace(/,/g, ""))).toFixed(2),
        });
      }
      if (propPriceMatch && addressMatch) {
        props.updatePropertyValue(propPriceMatch[0].trim().replace(/,/g, "").replace("$", ""));
        props.updateAddress(addressMatch[1].trim().replace("Active", ""));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const calculateTotalExpense = () => {
    console.log(props.monthlyPayment);
    console.log("DOWNPAYMENTCASH:" + props.downPaymentCash);
    let calculatedTotalExpense = parseFloat(props.monthlyPayment);
  
    Object.entries(expenses).forEach(([expenseKey, expenseValue]) => {
      if (
        expenseKey === "propertyManagement" ||
        expenseKey === "vacancyAllowance" ||
        expenseKey === "repairsMaintenance"
      ) {
        console.log("expenseValue: ", expenseValue);
        calculatedTotalExpense +=
          (props.totalIncome * parseFloat(expenseValue)) / 100;
      } else {
        calculatedTotalExpense += parseFloat(expenseValue);
      }
    });
  
    setTotalExpense(calculatedTotalExpense);
    setRoi(
      calculateROI(
        props.propertyValue,
        props.downPaymentCash,
        props.totalIncome,
        expenses.condoFee,
        expenses.taxes,
        expenses.propertyManagement,
        props.interestRate,
        expenses.repairsMaintenance,
        expenses.vacancyAllowance
      )
    );
  };
  
  const calculateROI = (
    purchaseValue,
    downPayment,
    rentalPrice,
    condoFees,
    condoTaxes,
    propertyManagementFee,
    interestRate,
    maintenanceRate,
    vacancyRate
  ) => {
    // Calculate mortgage payments
    console.log("interestRate: ", interestRate);
    const principal = purchaseValue - downPayment;
    const monthlyInterestRate = interestRate / 1200;
    const termMonths = 360;
  
    const monthlyPayment =
      (principal * monthlyInterestRate) /
      (1 - Math.pow(1 + monthlyInterestRate, -termMonths));
  
    console.log("monthlyPayment: ", monthlyPayment);
    const totalInterest = 36 * monthlyPayment - principal;
    console.log("totalInterest: ", totalInterest);
    console.log("principal: ", principal);
    const interestPayment = totalInterest / termMonths;
    console.log("interestPayment: ", interestPayment);
    const principalPayment = monthlyPayment - interestPayment;
    console.log("principalPayment: ", principalPayment);
  
    // Calculate expenses and income
    const annualRentalIncome = rentalPrice * 12;
    const annualCondoFees = condoFees * 12;
    const annualCondoTaxes = condoTaxes * 12;
    const annualManagementFee = (annualRentalIncome * propertyManagementFee) / 100;
    const annualMortgagePayment = monthlyPayment * 12;
    const annualMaintenanceExpense = (annualRentalIncome * maintenanceRate) / 100;
    const annualVacancyExpense = (annualRentalIncome * vacancyRate) / 100;
    const totalExpenses =
      annualCondoFees +
      annualCondoTaxes +
      annualManagementFee +
      annualMortgagePayment +
      annualMaintenanceExpense +
      annualVacancyExpense +
      expenses.insurance;
  
    console.log("annualRentalIncome: ", annualRentalIncome);
    console.log("totalExpenses: ", totalExpenses);
    console.log("principalPayment: ", principalPayment);
    const annualNetIncome = annualRentalIncome - totalExpenses;
  
    // Calculate ROI
    const totalInvestment = purchaseValue - downPayment;
    const roi = (annualNetIncome / totalInvestment) * 100;
    return roi;
  };
  
  const fullScreenMode = () => {
    const elem = document.getElementById("prop-photo");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };
  
  useEffect(() => {
    calculateTotalExpense();
  }, [expenses, props.monthlyPayment, props.totalIncome, props.interestRate]);
  
  useEffect(() => {
    props.updateInputText(inputText);
    handleExpenseUpdate(inputText);
  }, [inputText]);
  
  return (
    <div id="column1">
      <div id="property-image">
        {image && (
          <img
            src={image}
            id="prop-photo"
            onClick={fullScreenMode}
            alt="Uploaded Image"
          />
        )}
      </div>
      <Button variant="outlined" component="label">
        Upload
        <input type="file" onChange={handleFileChange} hidden />
      </Button>
      <div id="expensesH2">
        <h2>Expenses</h2>
      </div>
      <div>
        <b>Total Expense:</b> {totalExpense.toFixed(2)}{" "}
        <b>Income:</b> {(props.totalIncome - totalExpense).toFixed(2)}
        <b> ROI:</b> {roi.toFixed(2)} %
      </div>
    <Form>
    <Row>
      <Col>
        <Form.Group controlId="formCollabCenter">
          <Form.Label>CollabCenter</Form.Label>
          <Form.Control
            as="textarea"
            name={"inputText"}
            className="inputTextArea"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId="formHeat">
          <Form.Label>Heat:</Form.Label>
          <Form.Control
            type="text"
            name="heat"
            value={expenses.heat}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col>
        <Form.Group controlId="formWaterSewer">
          <Form.Label>Water/Sewer:</Form.Label>
          <Form.Control
            type="text"
            name="waterSewer"
            value={expenses.waterSewer}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId="formTaxes">
          <Form.Label>Taxes:</Form.Label>
          <Form.Control
            type="text"
            name="taxes"
            value={expenses.taxes}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col>
        <Form.Group controlId="formCondoFee">
          <Form.Label>Condo Fee:</Form.Label>
          <Form.Control
            type="text"
            name="condoFee"
            value={expenses.condoFee}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId="formBookkeeping">
          <Form.Label>Bookkeeping:</Form.Label>
          <Form.Control
            type="text"
            name="bookKeeping"
            value={expenses.bookKeeping}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col>
        <Form.Group controlId="formInsurance">
          <Form.Label>Insurance:</Form.Label>
          <Form.Control
            type="text"
            name="insurance"
            value={expenses.insurance}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId="formPropertyManagement">
          <Form.Label>Management %:</Form.Label>
          <Form.Control
            type="text"
            name="propertyManagement"
            value={expenses.propertyManagement}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
    </Row>
    <Row>
      <Col>
        <Form.Group controlId="formVacancyAllowance">
          <Form.Label>Vacancy %:</Form.Label>
          <Form.Control
            type="text"
            name="vacancyAllowance"
            value={expenses.vacancyAllowance}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId="formRepairsMaintenance">
          <Form.Label>Maintenance %:</Form.Label>
          <Form.Control
            type="text"
            name="repairsMaintenance"
            value={expenses.repairsMaintenance}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
    </Row>
    <Row id="calculate-expense-total">
      <Button onClick={calculateTotalExpense} variant='outline-success'>Calculate Total Expense</Button>
    </Row>
  </Form>
 

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
    inputText: state.inputText
  });

  const mapDispatchToProps = (dispatch) => ({
    updatePropertyValue: (value) => dispatch({ type: "SET_PROPERTY_VALUE", payload: value }),
    updateAddress: (value) => dispatch({ type: "SET_ADDRESS", payload: value }),
    updateInputText: (value) => dispatch({ type: "SET_INPUT_TEXT", payload: value })
    });
  
  export default connect(mapStateToProps, mapDispatchToProps)(ExpenseInputs);
