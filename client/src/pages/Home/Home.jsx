import FlightSearch from '../../components/FlightSearch/FlightSearch';

import styles from './Home.module.scss';

const Home = () => {
  return (
    <div>
      <div className={styles.search}>
        <FlightSearch />
      </div>
    </div>
  );
};

export default Home;
