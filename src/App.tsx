import { Opportunity } from './components/Opportunity.tsx'
import './App.css';
import React, { useState } from 'react';
import { AddFloatButton } from './components/AddFloatButton.tsx';
import { AddOpportunutyModal } from './components/AddOpportunityModal.tsx';
import { AddPaymentModal } from './components/AddPaymentModal.tsx';
import { AddExpenseModal } from './components/AddExpenseModal.tsx';

function App() {
  const [isAddOpty, setIsAddOpty] = useState(false);
  const [isAddPayment, setIsAddPayment] = useState(false);
  const [isAddExpense, setIsAddExpense] = useState(false)
  
  return (
    <div style={{ padding: 5 }}>
      <Opportunity />
      <AddFloatButton
        setIsAddOpty={setIsAddOpty}
        setIsAddPayment={setIsAddPayment}
        setIsAdExpense={setIsAddExpense}
      />
      {isAddOpty && <AddOpportunutyModal setIsAddOpty={setIsAddOpty} isAddOpty={isAddOpty} />}
      {isAddPayment && <AddPaymentModal setIsAddPayment={setIsAddPayment} isAddPayment={isAddPayment}/>}
      {isAddExpense && <AddExpenseModal setIsAddExpense={setIsAddExpense} isAddExpense={isAddExpense}/>}
    </div>
  );
}

export default App;
