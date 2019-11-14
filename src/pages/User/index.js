import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Load,
  LoadText,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    load: true,
    page: 1,
    stars: [],
    refreshing: false,
  };

  // Executa assim que a pagina abre
  async componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    const { stars } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      page,
      load: false,
      refreshing: false,
    });
  };

  loadMore = () => {
    const { page } = this.state;
    const nextPage = page + 1;
    this.load(nextPage);
    this.setState({
      load: true,
    });
  };

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] }, this.load);
  };

  render() {
    const { navigation } = this.props;
    const { stars, load } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {load ? (
          <Load>
            <ActivityIndicator size="large" color="#7159c1" />
            <LoadText>Carregando...</LoadText>
          </Load>
        ) : (
          <Stars
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={this.state.refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            // Restante das props
            onEndReachedThreshold={0.2} // 20% do final da lista
            onEndReached={this.loadMore} // Executa a função quando chega no 20% final
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
