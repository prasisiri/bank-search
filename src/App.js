import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import BankDetails from './BankDetails';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [bankName, setBankName] = useState('');
  const [results, setResults] = useState([]);
  const [selectedBankGuid, setSelectedBankGuid] = useState(null);
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.action === 'accept') {
        setSelectedBankGuid(event.data.guid);
        setField1(event.data.field1);
        setField2(event.data.field2);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (bankName) {
        try {
          const response = await fetch(`http://localhost:8080/institutions/typeahead?prefix=${bankName}`);
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error(error);
        }
      }
    }, 500); // Delay in ms

    return () => clearTimeout(timer);
  }, [bankName]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleLinkClick = () => {
    setShowForm(true);
  };

  const handleInputChange = (event) => {
    setBankName(event.target.value);
  };

  const openReactBWindow = (guid) => {
    window.open(`http://localhost:3005?guid=${guid}`, '_blank', 'width=600, height=400');
  };

  return (
    <div className="App">
      <h1>Welcome to Bank Search!</h1>
      <p>
        To get started, click <a href="#" onClick={handleLinkClick}>here</a> to search for a bank.
      </p>
      <div className={`form-container ${showForm ? 'show-form' : ''}`} ref={wrapperRef}>
        <form onSubmit={e => e.preventDefault()}>
          <label htmlFor="bank-name">Bank name:</label>
          <input type="text" id="bank-name" value={bankName} onChange={handleInputChange} />
          {results.length > 0 && (
            <ul className="autocomplete-results">
              {results.map((result) => (
                <li key={result.guid}>
                  <a href="javascript:void(0)" onClick={() => openReactBWindow(result.guid)}>
                    {result.name}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </form>
      </div>
      {selectedBankGuid && <BankDetails guid={selectedBankGuid} />}
      {field1 && <p>Field 1: {field1}</p>}
      {field2 && <p>Field 2: {field2}</p>}
    </div>
  );
}

export default App;
