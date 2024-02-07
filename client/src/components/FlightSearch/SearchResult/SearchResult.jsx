import styles from './SearchResult.module.scss';
import PropTypes from 'prop-types';
import departure from '../../../images/departure.svg';
import arrow from '../../../images/arrow.svg';
import alarm from '../../../images/alarm.svg';

const SearchResult = ({ searchResult }) => {
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}h ${minutes}min ${ampm}`;
  };
  const formatDate = (dateString) => {
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];

    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('ru-RU', options);

    return `${formattedDate} (${dayOfWeek})`;
  };

  const calculateFlightDuration = (departureTime, arrivalTime) => {
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);
    const duration = arrival - departure; // Difference in milliseconds
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  return (
    <div className={styles.result}>
      {searchResult.flights.map((flight, index) => (
        <div key={index} className={styles.resultElement}>
          {flight.direct !== false ? (
            // Display details for direct flight
            <>
              <div className={styles.resultElementInfo}>
                <div>
                  <p>{flight.departureAirport}</p>
                  <p>{formatTime(flight.departureTime)}</p>
                  <p>{formatDate(flight.departureTime)}</p>
                </div>
                <div className={styles.travelInfo}>
                  <div>
                    <img src={departure} alt="departure" />
                  </div>
                  <div className={styles.flightInfo}>
                    <div className={styles.flightDuration}>
                      <img src={alarm} alt="alarm" />
                      {calculateFlightDuration(
                        flight.departureTime,
                        flight.arrivalTime
                      )}
                    </div>
                    <img src={arrow} alt="" />
                    <div className={styles.flightDuration}>direct</div>
                  </div>
                  <div>
                    <img src={departure} alt="departure" />
                  </div>
                </div>
                <div>
                  <p>{flight.arrivalAirport}</p>
                  <p>{formatTime(flight.arrivalTime)}</p>
                  <p>{formatDate(flight.arrivalTime)}</p>
                </div>
                <div>DIRECT</div>
                <div>PRICE</div>
              </div>
              <div className={styles.infoElement}>info airlines</div>
            </>
          ) : (
            // Display details for flights with legs
            <>
              {flight.legs.map((leg, legIndex) => (
                <div key={legIndex} className={styles.resultElementInfo}>
                  <div>
                    <p>{leg.flight.departureAirport}</p>
                    <p>{formatTime(leg.flight.departureTime)}</p>
                    <p>{formatDate(leg.flight.departureTime)}</p>
                  </div>
                  <div className={styles.travelInfo}>
                    <div>
                      <img src={departure} alt="departure" />
                    </div>
                    <div className={styles.flightInfo}>
                      <div className={styles.flightDuration}>
                        <img src={alarm} alt="alarm" />
                        {calculateFlightDuration(
                          leg.flight.departureTime,
                          leg.flight.arrivalTime
                        )}
                      </div>
                      <img src={arrow} alt="" />
                      <div className={styles.flightDuration}>direct</div>
                    </div>
                    <div>
                      <img src={departure} alt="departure" />
                    </div>
                  </div>
                  <div>
                    <p>{leg.flight.arrivalAirport}</p>
                    <p>{formatTime(leg.flight.arrivalTime)}</p>
                    <p>{formatDate(leg.flight.arrivalTime)}</p>
                  </div>
                  <div>DIRECT</div>
                  <div>PRICE</div>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

SearchResult.propTypes = {
  searchResult: PropTypes.shape({
    flights: PropTypes.arrayOf(
      PropTypes.shape({
        direct: PropTypes.bool,
        flightNumber: PropTypes.string,
        aircraft: PropTypes.string,
        departureAirport: PropTypes.string,
        arrivalAirport: PropTypes.string,
        departureTime: PropTypes.string,
        arrivalTime: PropTypes.string,
        legs: PropTypes.arrayOf(
          PropTypes.shape({
            type: PropTypes.string,
            flight: PropTypes.shape({
              flightNumber: PropTypes.string,
              aircraft: PropTypes.string,
              departureAirport: PropTypes.string,
              arrivalAirport: PropTypes.string,
              departureTime: PropTypes.string,
              arrivalTime: PropTypes.string,
            }),
          })
        ),
      })
    ),
  }),
};
export default SearchResult;
