import React from 'react';
import { View, Fab, Icon, Container } from 'native-base';
import { NavigationStackProp } from 'react-navigation-stack';

export interface Props {
  navigation: NavigationStackProp;
}

export interface State {}

export class Tenants extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <View style={{ flex: 1 }}>
          <Fab
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() =>
              this.props.navigation.navigate('CreateOrEditTenant', {
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

export default Tenants;
