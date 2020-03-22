// External dependencies
import { useTranslation } from 'react-i18next';
import React from 'react';
import PropTypes from 'prop-types';

// Internal dependencies
import Map from '@/modules/core/client/components/Map/index';
import './search-map.less';

export default function SearchMap(props) {
  const { t } = useTranslation('search'); // eslint-disable-line
  const { location } = props;

  return (
    <Map
      className="search-map"
      height="100vh"
      location={location}
      width="100%"
      zoom={6}
    >
      <h1>Search map</h1>
    </Map>
  );
}

SearchMap.propTypes = {
  location: PropTypes.array,
};
