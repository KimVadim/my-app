import { Opportunity } from './Opportunity.tsx'
import React, { useState } from 'react';
import { AddFloatButton } from './AddFloatButton.tsx';
import { AddOpportunutyModal } from './AddOpportunityModal.tsx';
import { AddPaymentModal } from './AddPaymentModal.tsx';
import { AddExpenseModal } from './AddExpenseModal.tsx';

function HomePage() {
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

export default HomePage;
