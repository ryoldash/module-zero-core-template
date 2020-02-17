import React from 'react';
import { Button, Text, View } from 'native-base';
import { NavigationStackProp } from 'react-navigation-stack';

export interface Props {
    navigation: NavigationStackProp
}

export interface State {}

export class Tenants extends React.Component<Props, State> {
  
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                <Button onPress={() => {}}>
                    <Text>Tenants</Text>
                </Button>
            </View>
        );
    }
}

export default Tenants;
