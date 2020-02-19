import React, { Component } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import { View, Text, Icon, Button } from 'native-base';
import { StyleSheet } from 'react-native';
import UserStore from '../../stores/userStore';
import { observer, inject } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';

interface UsersProps {
 userStore: UserStore,
}
interface UsersState {
  listViewData: String[],
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
    // paddingLeft: 15,
    // paddingRight: 15,
  },
  rowBackLeft: {
    width: 75,
    backgroundColor: "#303F9F",
    margin: 0,
    borderRadius:0,
    justifyContent: "center"
  },
  rowBackRight: {
    width: 75,
    backgroundColor: "#d32f2f",
    margin: 0,
    borderRadius: 0,
    justifyContent: "center"
  },
  editIcon: {
    color: "#fff",
  },
  trashIcon: {
    color: "#fff",
  }
});

@inject(Stores.UserStore)
@observer
class Users extends Component<UsersProps,UsersState> {
  constructor(props) {
    super(props);
    this.state={
      listViewData: [
        "Ali",
        "Veli",
        "Ahmet",
        "Kadir"
      ]
    }
  }

  render() {
    return (
      <SwipeListView
      data={this.state.listViewData}
      renderItem={ (data, rowMap) => (
          <View style={styles.rowFront}>
              <Text>I am {data.item} in a SwipeListView</Text>
          </View>
      )}
      renderHiddenItem={ (data, rowMap) => (
          <View style={styles.rowBack}>
            <Button style={styles.rowBackLeft}>
              <Icon style={styles.editIcon} type="FontAwesome" name="edit"></Icon>
            </Button>
            <Button style={styles.rowBackRight}>
              <Icon style={styles.trashIcon} type="FontAwesome" name="trash"></Icon>
            </Button>
          </View>
      )}
      leftOpenValue={75}
      rightOpenValue={-75}
  />
    );
  }
}

export default Users;