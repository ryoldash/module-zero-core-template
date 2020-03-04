import { createStackNavigator } from 'react-navigation-stack';
import Login from '../../scenes/Login/login';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Dasboard from '../../scenes/Dashboard/Dashboard';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import SideBar from '../sidebar/sidebar';
import React from 'react';
import Users from '../../scenes/Users/users';
import Tenants from '../../scenes/Tenants/tenants';
import Roles from '../../scenes/Roles/roles';
import Loader from '../loader/loader';
import Setting from '../../scenes/Setting/setting';
import { httpServiceFunc } from '../../services/httpService';
import { Root, Button, Icon } from 'native-base';
import { CreateOrEditTenant } from '../../scenes/Tenants/createOrEditTenant';
import { CreateOrEditRole } from '../../scenes/Roles/createOrEditRole';
import CreateOrEdituser from '../../scenes/Users/createOrEditUser';

const AuthStack2 = createStackNavigator(
  {
    Dashboard: {
      screen: Dasboard,
    },
    Users: {
      screen: Users,
    },
    Tenants: {
      screen: Tenants,
    },
    Roles: {
      screen: Roles,
    },
    Setting: {
      screen: Setting,
    },
    CreateOrEditTenant: {
      screen: CreateOrEditTenant,
    },
    CreateOrEditRoles: {
      screen: CreateOrEditRole,
    },
    CreateOrEditUser: {
      screen: CreateOrEdituser,
    },
  },
  {
    initialRouteName: 'Users',
    defaultNavigationOptions: ({ navigation }) => ({
      headerLeft: (
        <Button onPress={() => navigation.toggleDrawer()} style={{ backgroundColor: 'white' }}>
          <Icon type="MaterialCommunityIcons" name="menu" style={{ color: 'black' }} />
        </Button>
      ),
    }),
  },
);

const AuthStack = createDrawerNavigator(
  {
    Dashboard: {
      screen: AuthStack2,
    },
    User: {
      screen: Users,
    },
    Tenants: {
      screen: Tenants,
    },
    Roles: {
      screen: Roles,
    },
    Setting: {
      screen: Setting,
    },
  },
  {
    initialRouteName: 'Dashboard',
    edgeWidth: 50,
    contentComponent: props => <SideBar {...props} />,
  },
);

const AppStack = createStackNavigator(
  {
    Login: {
      screen: Login,
    },
  },
  {
    initialRouteName: 'Login',
    headerMode: "none",
  },
);

const Routing = createAppContainer(
  createSwitchNavigator(
    {
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Auth',
    },
  ),
);

interface Props {}
interface State {
  loading: boolean;
}

export default class RoutingContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = { loading: false };
    const func = new httpServiceFunc();
    func.showFunction(() => this.setState({ loading: true }));
    func.hideFunction(() => this.setState({ loading: false }));
    //this functions callback
  }
  render() {
    return (
      <Root>
        <Routing />
        <Loader loading={this.state.loading} />
      </Root>
    );
  }
}
