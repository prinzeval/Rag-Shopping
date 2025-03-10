import React, { useState } from 'react';
import './catalog.css';

interface CreateCatalogProps {
  onCatalogCreated: () => void;
}

const CreateCatalog: React.FC<CreateCatalogProps> = ({ onCatalogCreated }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [vertical, setVertical] = useState<string>('commerce');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseDetails, setResponseDetails] = useState<any>(null);

  // API base URL - must match your FastAPI server
  const API_BASE_URL = 'http://localhost:8000/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseDetails(null);
    
    try {
      const url = `${API_BASE_URL}/catalogs`;
      console.log(`Creating catalog at: ${url}`);

      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          description,
          vertical,
        }),
      });
      
      // Store response details for debugging
      const responseInfo = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()]),
      };
      setResponseDetails(responseInfo);
      console.log('Response details:', responseInfo);
      
      // Get the response text first
      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 200) + '...');
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}. Details: ${responseText}`);
      }
      
      // Try to parse JSON only if there's content
      if (responseText.trim()) {
        try {
          const data = JSON.parse(responseText);
          console.log('Catalog created:', data);
          onCatalogCreated();
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          console.error('Response text that failed to parse:', responseText);
          throw new Error(`Failed to parse server response as JSON. Server returned: ${responseText.substring(0, 100)}...`);
        }
      } else {
        console.warn("Empty response received");
        onCatalogCreated(); // Assuming success if we got 200 OK
      }
    } catch (error) {
      console.error('Error creating catalog:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-catalog-form">
      <h3>Create New Catalog</h3>
      {error && (
        <div className="error-container">
          <div className="error-message">{error}</div>
          {responseDetails && (
            <div className="error-details">
              <h4>Response Details:</h4>
              <pre>{JSON.stringify(responseDetails, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Catalog Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter catalog name"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter catalog description"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>Vertical</label>
          <select
            value={vertical}
            onChange={(e) => setVertical(e.target.value)}
            disabled={loading}
          >
            <option value="commerce">Commerce</option>
            <option value="services">Services</option>
            <option value="travel">Travel</option>
            <option value="restaurants">Restaurants</option>
          </select>
        </div>
        <button
          type="submit"
          className="form-button"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Catalog'}
        </button>
      </form>
    </div>
  );
};

export default CreateCatalog;