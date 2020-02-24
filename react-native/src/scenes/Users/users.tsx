import React, { Component } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { View, Text, Icon, Button, Container, Fab, ActionSheet } from 'native-base';
import { StyleSheet } from 'react-native';
import UserStore from '../../stores/userStore';
import { observer, inject } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import { NavigationStackProp } from 'react-navigation-stack';

interface UsersProps {
  userStore: UserStore;
  navigation: NavigationStackProp;
}
interface UsersState {}

@inject(Stores.UserStore)
@observer
class Users extends Component<UsersProps, UsersState> {
  constructor(props) {
    super(props);
  }
  // static navigationOptions = ({ navigation, navigationOptions }) => {
  //   return {
  //     headerRight: () => (
  //       <Button
  //         onPress={() => alert('This is a button!')}
  //         title="Info"
  //         color="#fff"
  //         children={<Text>+</Text>}
  //       />
  //     ),
  //   };
  // };

  async componentWillMount() {
    await this.props.userStore!.getAll({ maxResultCount: 10, skipCount: 0, keyword: '' });
  }

  render() {
    const { users } = this.props.userStore!;
    return (
      <Container>
        <SwipeListView
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
                id: "1",
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
