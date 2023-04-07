import { combineReducers } from 'redux';

const totalIncomeReducer = (state = 0, action) => {
  switch (action.type) {
    case 'SET_TOTAL_INCOME':
      return action.payload;
    default:
      return state;
  }
};

const interestRateReducer = (state = 0, action) => {
  switch (action.type) {
    case 'SET_INTEREST_RATE':
      return action.payload;
    default:
      return state;
  }
};

const downPaymentCashReducer = (state = 0, action) => {
  switch (action.type) {
    case 'SET_DOWN_PAYMENT_CASH':
      return action.payload;
    default:
      return state;
  }
};

const propertyValueReducer = (state = 0, action) => {
    switch (action.type) {
        case 'SET_PROPERTY_VALUE':
            return action.payload;
        default:
            return state;
    }
};

const addressReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_ADDRESS':
            return action.payload;
        default:
            return state;
    }
};

const monthlyExpenseReducer = (state = 0, action) => {
    switch (action.type) {
      case 'SET_MONTHLY_PAYMENT':
        return action.payload;
      default:
        return state;
    }
  };

  const updatePropertyValue = (value) => {
    return {
      type: "SET_PROPERTY_VALUE",
      payload: value,
    };
  };

    const updateAddress = (value) => {
    return {
        type: "SET_ADDRESS",
        payload: value,
    };
    };

    const updateInputText = (value) => {
      return {
          type: "SET_INPUT_TEXT",
          payload: value,
      };
    };

    const inputTextReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_INPUT_TEXT':
            return action.payload;
        default:
            return state;
    }
};
  
const rootReducer = combineReducers({
  totalIncome: totalIncomeReducer,
  monthlyPayment: monthlyExpenseReducer,
  propertyValue: propertyValueReducer,
  interestRate: interestRateReducer,
  address: addressReducer,
  inputText: inputTextReducer,
  downPaymentCash: downPaymentCashReducer,
  updateInputText,
  updateAddress,
  updatePropertyValue
});

export default rootReducer;

