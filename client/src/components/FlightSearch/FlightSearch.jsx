import { useState } from 'react';
import axios from 'axios'; // Import Axios
import styles from './FlightSearch.module.scss';
import departure from '../../images/departure.svg';
import search from '../../images/fi-rr-search.svg';

const FlightSearch = () => {
  const [showSteppers, setShowSteppers] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [departDate, setDepartDate] = useState('');
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [searchResult, setSearchResult] = useState(null); // State to store the response data

  const handleAdultsChange = (newCount) => {
    setAdults(newCount < 0 ? 0 : newCount);
  };

  const handleChildrenChange = (newCount) => {
    setChildren(newCount < 0 ? 0 : newCount);
  };

  const handleCountButtonClick = (event) => {
    event.preventDefault(); // Prevent default form submission
    setShowSteppers(!showSteppers);
  };

  const handleDepartDateChange = (event) => {
    setDepartDate(event.target.value);
  };

  const handleDepartureAirportChange = (event) => {
    setDepartureAirport(event.target.value);
  };

  const handleArrivalAirportChange = (event) => {
    setArrivalAirport(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Make the GET request using Axios
    try {
      const response = await axios.get(
        'http://localhost:5001/api/flights/result',
        {
          params: {
            departureAirport,
            arrivalAirport,
            departureTime: departDate,
            numberOfPassengers: adults + children,
          },
        }
      );

      setSearchResult(response.data);
      console.log(); // Store the response data in state
    } catch (error) {
      console.error('Error making the request:', error);
    }
  };
  return (
    <div className={styles.wrapper}>
      <form className={styles.searchPanel} onSubmit={handleFormSubmit}>
        <div className={styles.from}>
          <img src={departure} alt="departure" />
          <input
            type="text"
            placeholder="From where?"
            value={departureAirport}
            onChange={handleDepartureAirportChange}
          />
        </div>
        <div className={styles.where}>
          <img src={departure} alt="departure" />
          <input
            type="text"
            placeholder="Where to?"
            value={arrivalAirport}
            onChange={handleArrivalAirportChange}
          />
        </div>

        <div className={styles.date}>
          <img src={departure} alt="departure" />
          <div>
            <input
              id="departInput"
              type="date"
              value={departDate}
              onChange={handleDepartDateChange}
              className="departInput"
            />
          </div>
        </div>
        <div>
          <button className={styles.count} onClick={handleCountButtonClick}>
            <img src={departure} alt="departure" />
            {`${adults + children} adult`}
          </button>
          {showSteppers && (
            <div className={styles.steppers}>
              <div>
                Adults:
                <button onClick={() => handleAdultsChange(adults - 1)}>
                  -
                </button>
                {adults}
                <button onClick={() => handleAdultsChange(adults + 1)}>
                  +
                </button>
              </div>
              <div>
                Minors:
                <button onClick={() => handleChildrenChange(children - 1)}>
                  -
                </button>
                {children}
                <button onClick={() => handleChildrenChange(children + 1)}>
                  +
                </button>
              </div>
            </div>
          )}
        </div>
        <div>
          <button className={styles.searchButton} type="submit">
            <img src={search} alt="" />
            Search
          </button>
        </div>
      </form>
      <div>
        {searchResult && (
          <div className={styles.result}>
            <p>Search Result:</p>
            {searchResult.flights.map((flight, index) => (
              <div key={index}>
                {flight.direct !== false ? (
                  // Display details for direct flight
                  <>
                    <p>Flight Number: {flight.flightNumber}</p>
                    <p>Aircraft: {flight.aircraft}</p>
                    <p>Departure Airport: {flight.departureAirport}</p>
                    <p>Arrival Airport: {flight.arrivalAirport}</p>
                    <p>Departure Time: {flight.departureTime}</p>
                    <p>Arrival Time: {flight.arrivalTime}</p>
                  </>
                ) : (
                  // Display details for flights with legs
                  <>
                    <p>-----------------------------</p>
                    <p>Connecting Flight:</p>
                    {flight.legs.map((leg, legIndex) => (
                      <div key={legIndex}>
                        <p>Type: {leg.type}</p>
                        <p>Flight Number: {leg.flight.flightNumber}</p>
                        <p>Aircraft: {leg.flight.aircraft}</p>
                        <p>Departure Airport: {leg.flight.departureAirport}</p>
                        <p>Arrival Airport: {leg.flight.arrivalAirport}</p>
                        <p>Departure Time: {leg.flight.departureTime}</p>
                        <p>Arrival Time: {leg.flight.arrivalTime}</p>
                        {/* Add more details as needed */}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
