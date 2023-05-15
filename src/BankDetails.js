import React, { useEffect, useState } from 'react';

function BankDetails({ guid }) {
  const [bank, setBank] = useState(null);

  useEffect(() => {
    async function fetchBankDetails() {
      try {
        const response = await fetch(`http://localhost:8080/institutions/by-guid?guid=${guid}`);
        const data = await response.json();
        setBank(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (guid) {
      fetchBankDetails();
    }
  }, [guid]);

  if (!bank) {
    return <p>Loading bank details...</p>;
  }

  return (
    <div className="bank-details">
      <h2>{bank.name}</h2>
      <h2>{bank.guid}</h2>
      {/* Display other bank details here */}
    </div>
  );
}

export default BankDetails;
