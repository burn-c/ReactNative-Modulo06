import React from 'react';
import PropTypes from 'prop-types';

import { WebBrowser } from './styles';

export default function Repo({ navigation }) {
  const repository = navigation.getParam('repository');

  return <WebBrowser source={{ uri: repository.html_url }} />;
}

Repo.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repo.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('repository').name,
});
