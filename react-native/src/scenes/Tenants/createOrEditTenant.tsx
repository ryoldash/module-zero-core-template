import React from 'react';
import { Button, View, Icon, Text } from 'native-base';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';

export interface Props {}

export interface Params {
  id: string;
}

export interface State {}

export class CreateOrEditTenant extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }
  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
  }) => {
    return {
      headerLeft: (
        <Button onPress={() => navigation.goBack()} style={{ backgroundColor: 'white' }}>
          <Icon type="MaterialIcons" name="keyboard-arrow-left" style={{ color: 'black' }} />
        </Button>
      ),
      // headerRight: <Text>{navigation.getParam('id')}</Text>,
    };
  };

  render() {
    return <View style={{ flex: 1 }} />;
  }
}

export default CreateOrEditTenant;
