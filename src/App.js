import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [bankName, setBankName] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const handleMessage = (event) => {
      console.log('Message received:', event.data);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const handleLinkClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/institutions/typeahead?query=${bankName}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setBankName(event.target.value);
  };

  const openReactBWindow = () => {
    window.open('http://localhost:3005', '_blank', 'width=600, height=400');
  };

  return (
    <div className="App">
      <h1>Welcome to Bank Search!</h1>
      <p>
        To get started, click <a href="#" onClick={handleLinkClick}>here</a> to search for a bank.
      </p>
      <div className={`form-container ${showForm ? 'show-form' : ''}`}>
        <form onSubmit={handleFormSubmit}>
          <label htmlFor="bank-name">Bank name:</label>
          <input type="text" id="bank-name" value={bankName} onChange={handleInputChange} />
          <button type="submit">Search</button>
        </form>
        {results.length > 0 && (
          <ul>
            {results.map((result) => (
              <li key={result.guid}>
                <a href="javascript:void(0)" onClick={openReactBWindow}>
                  {result.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
