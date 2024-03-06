import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FlightSearch.module.scss';
import departure from '../../images/departure.svg';
import search from '../../images/fi-rr-search.svg';
import SearchResult from './SearchResult/SearchResult';


const FlightSearch = () => {
  const [showSteppers, setShowSteppers] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [departDate, setDepartDate] = useState('');
  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const departureAirportParam = params.get('departureAirport') || '';
    const arrivalAirportParam = params.get('arrivalAirport') || '';
    const departDateParam = params.get('departDate') || '';
    const adultsParam = parseInt(params.get('adults')) || 1;
    const childrenParam = parseInt(params.get('children')) || 0;

    setDepartureAirport(departureAirportParam);
    setArrivalAirport(arrivalAirportParam);
    setDepartDate(departDateParam);
    setAdults(adultsParam);
    setChildren(childrenParam);

    const savedSearchResult = JSON.parse(localStorage.getItem('searchResult'));
    if (
      savedSearchResult &&
      departureAirportParam &&
      arrivalAirportParam &&
      departDateParam
    ) {
      setSearchResult(savedSearchResult);
    }
  }, []);

  const handleAdultsChange = (newCount) => {
    setAdults(newCount < 0 ? 0 : newCount);
  };

  const handleChildrenChange = (newCount) => {
    setChildren(newCount < 0 ? 0 : newCount);
  };

  const handleCountButtonClick = (event) => {
    event.preventDefault();
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

    if (!departureAirport || !arrivalAirport || !departDate) {
      console.error('Please fill in all fields before submitting');
      return;
    }

    try {
      const formattedDepartureTime = new Date(departDate).toISOString(); // Преобразование времени в формат ISO
      const response = await axios.get(
        'http://localhost:5001/api/flights/result',
        {
          params: {
            departureAirport,
            arrivalAirport,
            departureTime: formattedDepartureTime, // Передача времени в формате ISO
            numberOfPassengers: adults + children,
          },
        }
      );

      setSearchResult(response.data);

      const searchParams = new URLSearchParams();
      searchParams.set('departureAirport', departureAirport);
      searchParams.set('arrivalAirport', arrivalAirport);
      searchParams.set('departDate', departDate);
      searchParams.set('adults', adults.toString());
      searchParams.set('children', children.toString());
      window.history.pushState(null, null, `?${searchParams.toString()}`);

      // Сохраняем результаты поиска в localStorage только если они существуют
      if (response.data) {
        localStorage.setItem('searchResult', JSON.stringify(response.data));
      }
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
                <button
                  type="button"
                  onClick={() => handleAdultsChange(adults - 1)}
                >
                  -
                </button>
                {adults}
                <button
                  type="button"
                  onClick={() => handleAdultsChange(adults + 1)}
                >
                  +
                </button>
              </div>
              <div>
                Minors:
                <button
                  type="button"
                  onClick={() => handleChildrenChange(children - 1)}
                >
                  -
                </button>
                {children}
                <button
                  type="button"
                  onClick={() => handleChildrenChange(children + 1)}
                >
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
      <div className={styles.container}>
        <div className={styles.searchFilters}>Search filters</div>
        <div>
          {searchResult && <SearchResult searchResult={searchResult} />}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
