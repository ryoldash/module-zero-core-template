import React from 'react';
import { Image, TouchableHighlight } from 'react-native';
import { Container, Text, View, Icon } from 'native-base';
import { DrawerContentComponentProps, DrawerNavigatorItems } from 'react-navigation-drawer';
import { NavigationRoute } from 'react-navigation';

interface Props extends DrawerContentComponentProps {}
interface State {}

export default class SideBar extends React.Component<Props, State> {
  _keyExtractor = (item: NavigationRoute) => item.routeName;

  render() {
    return (
      <Container style={{ borderTopRightRadius: 18, borderBottomRightRadius: 18 }}>
        <View
          style={{
            flex: 4,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgb(184,184,184)',
            borderTopRightRadius: 0,
          }}
        >
          <TouchableHighlight onPress={() => {}} underlayColor={'rgba(255,255,255,0)'}>
            <Image
              source={{
                uri: 'https://avatars1.githubusercontent.com/u/37835086?s=400&v=4',
              }}
              style={{
                height: 60,
                width: 60,
                resizeMode: 'stretch',
                borderRadius: 18,
              }}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={() => {}} underlayColor={'rgba(255,255,255,0)'}>
            <Text>@Yasir.Aktunc</Text>
          </TouchableHighlight>
        </View>
        <View
          style={{
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            flex: 9,
            backgroundColor: 'white',
            marginTop: -30,
          }}
        >
          <DrawerNavigatorItems {...this.props} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginLeft: 10,
          }}
        >
          <Icon
            name="power-off"
            type="FontAwesome"
            onPress={() => {
              this.props.navigation!.navigate('App');
            }}
          />
          <Text style={{ marginLeft: 10 }}>Log Out</Text>
        </View>
      </Container>
    );
  }
}
