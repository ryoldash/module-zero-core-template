import React, { Component } from 'react';
import { SwipeListView } from 'react-native-swipe-list-view';
import "react-native-swipe-list-view/"
import { View, Text, Icon } from 'native-base';
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
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  standalone: {
    marginTop: 30,
    marginBottom: 30,
  },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 50,
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: '#8BC645',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  controls: {
    alignItems: 'center',
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    paddingVertical: 10,
    width: 100,
  },
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
              <Text>Left</Text>
              <Text><Icon type="FontAwesome" name="trash"></Icon></Text>
          </View>
      )}
      leftOpenValue={75}
      rightOpenValue={-75}
  />
    );
  }
}

export default Users;