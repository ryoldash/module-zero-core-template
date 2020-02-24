import React from "react";
import { View, Fab, Icon, Container, Button, Text, ActionSheet } from "native-base";
import { NavigationStackProp } from "react-navigation-stack";
import TenantStore from "../../stores/tenantStore";
import { StyleSheet, RefreshControl } from "react-native";
import { observer, inject } from "mobx-react";
import Stores from "../../stores/storeIdentifier";
import { SwipeListView } from "react-native-swipe-list-view";

export interface Props {
  navigation: NavigationStackProp;
  tenantStore: TenantStore;
}

export interface State {
  reflesing: boolean;
}

@inject(Stores.TenantStore)
@observer
export class Tenants extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { reflesing: false };
  }
  async componentWillMount() {
    await this.props.tenantStore!.getAll({ maxResultCount: 10, skipCount: 0, keyword: "" });
  }

  async handleReflesh() {
    this.setState(
      { reflesing: true },
      async () =>
        await this.props
          .tenantStore!.getAll({ maxResultCount: 10, skipCount: 0, keyword: "" })
          .then(() => this.setState({ reflesing: false })),
    );
  }

  render() {
    const { tenants } = this.props.tenantStore!;
    return (
      <Container>
        {/* <Button
          onPress={() =>
            this.props.navigation.navigate('CreateOrEditTenant', {
              id: "1",
            })
          }
        >
          <Text>asdasdas</Text>
        </Button> */}
        <SwipeListView
          useFlatList
          refreshControl={
            <RefreshControl
              refreshing={this.state.reflesing}
              onRefresh={() => this.handleReflesh()}
            />
          }
          closeOnRowPress
          closeOnRowOpen
          closeOnRowBeginSwipe
          closeOnScroll
          keys={Math.random()}
          data={tenants === undefined ? [] : tenants.items}
          renderItem={data => (
            <View style={styles.rowFront}>
              <Text>{data.item.tenancyName}</Text>
            </View>
          )}
          renderHiddenItem={data => (
            <View style={styles.rowBack}>
              <Button
                onPress={() =>
                  this.props.navigation.navigate("CreateOrEditTenant", {
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
                      options: ["Delete", 'Cancel'],
                      cancelButtonIndex: 1,
                      destructiveButtonIndex: 0,
                      title: 'Are you sure you want to delete?',
                    },
                    buttonIndex => {
                      if (buttonIndex === 0) {
                        this.props.tenantStore!.delete({ id: data.item.id });
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
            style={{ backgroundColor: "#5067FF" }}
            position="bottomRight"
            onPress={() =>
              this.props.navigation.navigate("CreateOrEditTenant", {
                id: '',
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
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderBottomColor: "#BDBDBD",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50,
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowBackLeft: {
    width: 75,
    backgroundColor: '#303F9F',
    margin: 0,
    borderRadius: 0,
    justifyContent: 'center',
  },
  rowBackRight: {
    width: 75,
    backgroundColor: '#d32f2f',
    margin: 0,
    borderRadius: 0,
    justifyContent: 'center',
  },
  editIcon: {
    color: '#fff',
  },
  trashIcon: {
    color: '#fff',
  },
});

export default Tenants;
