import React, { useState } from 'react';

import { Opportunity } from './Opportunity.tsx';
import { AddFloatButton } from '../components/AddFloatButton.tsx';
import { AddExpenseModal } from '../components/AddExpenseModal.tsx';
import { AddPaymentModal } from '../components/AddPaymentModal.tsx';
import { AddOpportunityModal } from '../components/AddOpportunityModal.tsx';

function HomePage() {
  const [isAddOpty, setIsAddOpty] = useState(false);
  const [isAddPayment, setIsAddPayment] = useState(false);
  const [isAddExpense, setIsAddExpense] = useState(false)
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <>
      <div style={{ padding: 5, display: 'flex', justifyContent: 'center' }}>
        <Opportunity />
        <AddFloatButton
          setIsAddOpty={setIsAddOpty}
          setIsAddPayment={setIsAddPayment}
          setIsAddExpense={setIsAddExpense}
        />
        {isAddOpty && <AddOpportunityModal
          setIsAddOpty={setIsAddOpty} isAddOpty={isAddOpty}
          setLoading={setLoading} loading={loading}
        />}
        {isAddPayment && <AddPaymentModal
          setIsAddPayment={setIsAddPayment} isAddPayment={isAddPayment}
          setLoading={setLoading} loading={loading}
        />}
        {isAddExpense && <AddExpenseModal
          setIsAddExpense={setIsAddExpense} isAddExpense={isAddExpense}
        />}
      </div>
    </>
  );
}

export default HomePage;
