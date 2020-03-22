import React, { Component } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import {
  View,
  Text,
  Icon,
  Button,
  Container,
  Fab,
  ActionSheet,
  Header,
  Item,
  Input,
  Right,
} from 'native-base';
import { StyleSheet, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import UserStore from '../../stores/userStore';
import { observer, inject } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import { NavigationStackProp } from 'react-navigation-stack';
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
interface UsersProps {
  userStore: UserStore;
  navigation: NavigationStackProp;
}

export interface UsersState {
  reflesing: boolean;
  maxResultCount: number;
  skipCount: number;
  keyword: string;
}
export interface Params {
  count: string;
}

@inject(Stores.UserStore)
@observer
class Users extends Component<UsersProps, UsersState> {
  constructor(props) {
    super(props);
    this.state = { reflesing: false, maxResultCount: 10, skipCount: 0, keyword: '' };
  }
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
  }) => {
    return {
      headerRight: (
        <Text style={{ marginRight: 10, fontSize: 15 }}>{navigation.getParam('count')}</Text>
      ),
    };
  };
  async componentWillMount() {
    await this.getAll();
    const { users } = this.props.userStore!;
    this.props.navigation.setParams({
      count: users === undefined ? 0 : users.totalCount,
    });
  }
  async getAll() {
    const { maxResultCount, keyword, skipCount } = this.state;
    await this.props.userStore!.getAll({
      maxResultCount: maxResultCount,
      skipCount: skipCount * maxResultCount,
      keyword: keyword,
    });
  }

  async handleReflesh() {
    this.setState({ reflesing: true, skipCount: 0 }, async () =>
      this.getAll().then(() => this.setState({ reflesing: false })),
    );
  }

  render() {
    const { users } = this.props.userStore!;
    const { maxResultCount, skipCount } = this.state;

    return (
      <Container>
        <Header searchBar rounded>
          <Item style={{ flex: 2 }}>
            <Icon name="ios-search" />
            <Input
              placeholder="Search"
              onSubmitEditing={() => this.getAll()}
              onChange={e => this.setState({ keyword: e.nativeEvent.text, skipCount: 0 })}
            />
          </Item>
          <Right style={{ flex: 1 }}>
            <Button transparent onPress={() => this.getAll()}>
              <Text>Search</Text>
            </Button>
          </Right>
        </Header>
        <SwipeListView
          ListFooterComponent={() =>
            maxResultCount + skipCount * maxResultCount <
              (users === undefined ? 0 : users.totalCount) && (
              <Button
                light
                onPress={() => {
                  this.setState({ skipCount: this.state.skipCount + 1 }, () => this.getAll());
                }}
              >
                <Text>Daha fazla yükle</Text>
              </Button>
            )
          }
          keyExtractor={(x, i) => i.toString()}
          onEndReachedThreshold={0}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.reflesing}
              onRefresh={() => this.handleReflesh()}
            />
          }
          data={users === undefined ? [] : users.items}
          renderItem={data => (
            <View style={styles.rowFront}>
              <Text>{data.item.userName}</Text>
            </View>
          )}
          renderHiddenItem={data => (
            <View style={styles.rowBack}>
              <Button
                onPress={() =>
                  this.props.navigation.navigate('CreateOrEditUser', {
                    id: data.item.id,
                  })
                }
                style={styles.rowBackLeft}
              >
                <Icon style={styles.editIcon} type="FontAwesome" name="edit" />
              </Button>
              <Button
                onPress={() =>
                  ActionSheet.show(
                    {
                      options: ['Delete', "Cancel"],
                      cancelButtonIndex: 1,
                      destructiveButtonIndex: 0,
                      title: "Are you sure you want to delete?",
                    },
                    buttonIndex => {
                      if (buttonIndex === 0) {
                        this.props.userStore.delete({ id: data.item.id });
                      }
                    },
                  )
                }
                style={styles.rowBackRight}
              >
                <Icon style={styles.trashIcon} type="FontAwesome" name="trash" />
              </Button>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
        />
        <View style={{ flex: 1 }}>
          <Fab
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() =>
              this.props.navigation.navigate('CreateOrEditUser', {
                id: "",
              })
            }
          >
            <Icon name="plus" type="AntDesign" />
          </Fab>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderBottomColor: '#BDBDBD',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowBackLeft: {
    width: 75,
    backgroundColor: "#303F9F",
    margin: 0,
    borderRadius: 0,
    justifyContent: "center",
  },
  rowBackRight: {
    width: 75,
    backgroundColor: "#d32f2f",
    margin: 0,
    borderRadius: 0,
    justifyContent: "center",
  },
  editIcon: {
    color: "#fff",
  },
  trashIcon: {
    color: "#fff",
  },
});

export default Users;
