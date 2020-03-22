import React from "react";
import {
  View,
  Fab,
  Icon,
  Container,
  Button,
  Text,
  ActionSheet,
  Header,
  Item,
  Input,
  Right,
} from "native-base";
import { NavigationStackProp } from "react-navigation-stack";
import TenantStore from "../../stores/tenantStore";
import { StyleSheet, RefreshControl } from "react-native";
import { observer, inject } from "mobx-react";
import Stores from "../../stores/storeIdentifier";
import { SwipeListView } from "react-native-swipe-list-view";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
export interface Props {
  navigation: NavigationStackProp;
  tenantStore: TenantStore;
}

export interface State {
  reflesing: boolean;
  maxResultCount: number;
  skipCount: number;
  keyword: string;
}
export interface Params {
  count: string;
}

@inject(Stores.TenantStore)
@observer
export class Tenants extends React.Component<Props, State> {
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
    const { tenants } = this.props.tenantStore!;
    this.props.navigation.setParams({
      count: tenants === undefined ? 0 : tenants.totalCount,
    });
  }

  async getAll() {
    const { maxResultCount, keyword, skipCount } = this.state;
    await this.props.tenantStore!.getAll({
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
    const { tenants } = this.props.tenantStore!;
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
              (tenants === undefined ? 0 : tenants.totalCount) && (
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
                  this.props.navigation.navigate('CreateOrEditTenant', {
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
                        this.props.tenantStore.delete({ id: data.item.id });
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
              this.props.navigation.navigate('CreateOrEditTenant', {
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
