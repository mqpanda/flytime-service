import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FlightSearch.module.scss';
import departure from '../../images/departure.svg';
import search from '../../images/fi-rr-search.svg';
import SearchResult from './SearchResult/SearchResult';
import plus from '../../images/s.png';
import minus from '../../images/minus.png';

const FlightSearch = () => {
  const [sorting, setSorting] = useState('');
  const [seatClass, setSeatClass] = useState('');
  const [stops, setStops] = useState('');
  const [price, setPrice] = useState('');
  const [airlines, setAirlines] = useState('');
  const [isSortingDropdownOpen, setIsSortingDropdownOpen] = useState(false);
  const [isSeatClassDropdownOpen, setIsSeatClassDropdownOpen] = useState(false);
  const [isStopsDropdownOpen, setIsStopsDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isAirlinesDropdownOpen, setIsAirlinesDropdownOpen] = useState(false);

  const handleSortingClick = () =>
    setIsSortingDropdownOpen(!isSortingDropdownOpen);
  const handleSeatClassClick = () =>
    setIsSeatClassDropdownOpen(!isSeatClassDropdownOpen);
  const handleStopsClick = () => setIsStopsDropdownOpen(!isStopsDropdownOpen);
  const handlePriceClick = () => setIsPriceDropdownOpen(!isPriceDropdownOpen);
  const handleAirlinesClick = () =>
    setIsAirlinesDropdownOpen(!isAirlinesDropdownOpen);

  const handleSortingChange = (value) => {
    setSorting(value);
    setIsSortingDropdownOpen(false);
  };

  const handleSeatClassChange = (value) => {
    setSeatClass(value);
    setIsSeatClassDropdownOpen(false);
  };

  const handleStopsChange = (value) => {
    setStops(value);
    setIsStopsDropdownOpen(false);
  };

  const handlePriceChange = (value) => {
    setPrice(value);
    setIsPriceDropdownOpen(false);
  };

  const handleAirlinesChange = (value) => {
    setAirlines(value);
    setIsAirlinesDropdownOpen(false);
  };

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
      const formattedDepartureTime = new Date(departDate).toISOString();
      const response = await axios.get(
        'http://localhost:5001/api/flights/result',
        {
          params: {
            departureAirport,
            arrivalAirport,
            departureTime: formattedDepartureTime,
            numberOfPassengers: adults + children,
            sorting,
            seatClass,
            stops,
            price,
            airlines,
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
        <div className={styles.searchFilters}>
          <div className={styles.filterItem}>
            <div className={styles.dropdown}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  className={styles.dropdownButton}
                  onClick={handleSortingClick}
                >
                  {sorting || 'Sorting'}
                </button>
                <img
                  style={{ width: 18, height: 18 }}
                  src={isSortingDropdownOpen ? minus : plus}
                  alt=""
                />
              </div>
              {isSortingDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <div onClick={() => handleSortingChange('Cheap First')}>
                    Cheap First
                  </div>
                  <div onClick={() => handleSortingChange('Recommended')}>
                    Recommended
                  </div>
                  <div onClick={() => handleSortingChange('Best Rated')}>
                    Best Rated
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.filterItem}>
            <div className={styles.dropdown}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  className={styles.dropdownButton}
                  onClick={handleSeatClassClick}
                >
                  {seatClass || 'Seat Class'}
                </button>
                <img
                  style={{ width: 18, height: 18 }}
                  src={isSeatClassDropdownOpen ? minus : plus}
                  alt=""
                />
              </div>
              {isSeatClassDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <div onClick={() => handleSeatClassChange('Economy')}>
                    Economy
                  </div>
                  <div onClick={() => handleSeatClassChange('Business')}>
                    Business
                  </div>
                  <div onClick={() => handleSeatClassChange('First Class')}>
                    First Class
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.filterItem}>
            <div className={styles.dropdown}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  className={styles.dropdownButton}
                  onClick={handleStopsClick}
                >
                  {stops || 'Stops'}
                </button>
                <img
                  style={{ width: 18, height: 18 }}
                  src={isStopsDropdownOpen ? minus : plus}
                  alt=""
                />
              </div>
              {isStopsDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <div onClick={() => handleStopsChange('Non-stop')}>
                    Non-stop
                  </div>
                  <div onClick={() => handleStopsChange('1 Stop')}>1 Stop</div>
                  <div onClick={() => handleStopsChange('2+ Stops')}>
                    2+ Stops
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.filterItem}>
            <div className={styles.dropdown}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  className={styles.dropdownButton}
                  onClick={handlePriceClick}
                >
                  {price || 'Price'}
                </button>
                <img
                  src={isPriceDropdownOpen ? minus : plus}
                  alt=""
                  style={{ width: 18, height: 18 }}
                />
              </div>
              {isPriceDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <div onClick={() => handlePriceChange('Low to High')}>
                    Low to High
                  </div>
                  <div onClick={() => handlePriceChange('High to Low')}>
                    High to Low
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.filterItem}>
            <div className={styles.dropdown}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button
                  className={styles.dropdownButton}
                  onClick={handleAirlinesClick}
                >
                  {airlines || 'Airlines'}
                </button>
                <img
                  style={{ width: 18, height: 18 }}
                  src={isAirlinesDropdownOpen ? minus : plus}
                  alt=""
                />
              </div>
              {isAirlinesDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <div onClick={() => handleAirlinesChange('Delta')}>Delta</div>
                  <div onClick={() => handleAirlinesChange('United')}>
                    United
                  </div>
                  <div
                    onClick={() => handleAirlinesChange('American Airlines')}
                  >
                    American Airlines
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          {searchResult && <SearchResult searchResult={searchResult} />}
        </div>
      </div>
    </div>
  );
};

export default FlightSearch;
