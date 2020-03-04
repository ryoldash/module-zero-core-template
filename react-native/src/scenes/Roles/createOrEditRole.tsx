import React from 'react';
import { NavigationScreenProp, NavigationRoute } from 'react-navigation';
import {
  Container,
  Card,
  CardItem,
  Body,
  Content,
  Button,
  Item,
  Input,
  Icon,
  Label,
  Text,
  View,
} from 'native-base';
import { StyleSheet, Switch, Dimensions } from 'react-native';
import Stores from '../../stores/storeIdentifier';
import { Formik } from 'formik';
import * as yup from 'yup';
import { observer, inject } from 'mobx-react';
import { _toast } from '../../utils/utils';
import RoleStore from '../../stores/roleStore';
import { GetAllPermissionsOutput } from '../../services/role/dto/getAllPermissionsOutput';

export interface Params {
  id: string;
}

export interface Props {
  roleStore?: RoleStore;
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
}

interface RoleSwitch {
  name: string;
  displayName: string;
  value: boolean;
}

export interface State {}

@inject(Stores.RoleStore)
@observer
export class CreateOrEditRole extends React.Component<Props, State> {
  name: any;
  description: any;
  displayName: any;
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({
    navigation,
  }: {
    navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
  }) => {
    return {
      title: (
        <Text style={{ fontSize: 24 }}>{navigation.getParam('id') == '' ? 'Create' : 'Edit'}</Text>
      ),
      headerLeft: (
        <Button onPress={() => navigation.goBack()} style={{ backgroundColor: 'white' }}>
          <Icon type="MaterialIcons" name="keyboard-arrow-left" style={{ color: 'black' }} />
        </Button>
      ),
    };
  };

  isEdit = (): boolean => {
    return this.props.navigation.getParam('id') !== '';
  };

  async componentWillMount() {
    if (this.isEdit()) {
      await this.props.roleStore.getRoleForEdit({
        id: parseInt(this.props.navigation.getParam("id")),
      });
      await this.props.roleStore.getAllPermissions();
    } else {
      this.props.roleStore.createRole();
      await this.props.roleStore.getAllPermissions();
    }
  }
  createOrUpdateRole = async values => {
    values.roleNames = values.roleNames
      .filter((x: RoleSwitch) => x.value === true)
      .map((x: RoleSwitch) => x.name);
    debugger;
    // if (this.isEdit()) {
    //   await this.props.roleStore
    //     .update({
    //       id: parseInt(this.props.navigation.getParam('id')),
    //       ...value,
    //     })
    //     .then(() => _toast('Update başarılı', 'success'));
    // } else {
    //   await this.props.roleStore.create(value).then(() => _toast('Role Oluşturuldu', 'success'));
    // }
  };

  render() {
    const { roleEdit, allPermissions } = this.props.roleStore!;

    const grantedPermissions = allPermissions.map((x: GetAllPermissionsOutput) => {
      if (roleEdit.grantedPermissionNames.indexOf(x.name) !== -1) {
        return { value: true, name: x.name, displayName: x.displayName };
      } else {
        return { value: false, name: x.name, displayName: x.displayName };
      }
    });

    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem bordered>
              <Body>
                <Formik
                  initialValues={{
                    displayName: roleEdit.role.displayName,
                    name: roleEdit.role.name,
                    description: roleEdit.role.description,
                    grantedPermissions: grantedPermissions,
                  }}
                  enableReinitialize
                  validationSchema={yup.object().shape({
                    displayName: yup.string().required(),
                    name: yup.string().required(),
                    decription: yup.string(),
                    grantedPermissions: yup.array().of(
                      yup.object().shape({
                        value: yup.bool(),
                        name: yup.string(),
                        displayName: yup.string(),
                      }),
                    ),
                  })}
                  validateOnChange={true}
                  onSubmit={value => this.createOrUpdateRole(value)}
                >
                  {({ handleChange, values, handleSubmit, errors, handleBlur, setFieldValue }) => (
                    <>
                      <Item
                        style={styles.marginVrtcl}
                        error={!!errors.displayName}
                        success={!errors.displayName}
                        floatingLabel
                      >
                        <Label>Display Name</Label>
                        <Input
                          onBlur={handleBlur}
                          returnKeyType="next"
                          onSubmitEditing={() => this.name._root.focus()}
                          value={values.displayName}
                          onChangeText={handleChange('displayName')}
                        />
                        {errors.displayName ? (
                          <Icon name="close-circle" />
                        ) : (
                          <Icon name="checkmark-circle" />
                        )}
                      </Item>

                      <Item
                        style={styles.marginVrtcl}
                        error={!!errors.name}
                        success={!errors.name}
                        floatingLabel
                      >
                        <Label>Name</Label>
                        <Input
                          onSubmitEditing={() => this.description._root.focus()}
                          onBlur={handleBlur}
                          getRef={(ref: any) => {
                            this.name = ref;
                          }}
                          returnKeyType="next"
                          value={values.name}
                          onChangeText={handleChange('name')}
                        />
                        {errors.name ? (
                          <Icon name="close-circle" />
                        ) : (
                          <Icon name="checkmark-circle" />
                        )}
                      </Item>
                      <Item
                        style={styles.marginVrtcl}
                        error={!!errors.description}
                        success={!errors.description}
                        floatingLabel
                      >
                        <Label>Description</Label>
                        <Input
                          getRef={(ref: any) => {
                            this.description = ref;
                          }}
                          returnKeyType="done"
                          onSubmitEditing={() => handleSubmit()}
                          onBlur={handleBlur}
                          value={values.description}
                          onChangeText={handleChange('description')}
                        />
                        {errors.description ? (
                          <Icon name="close-circle" />
                        ) : (
                          <Icon name="checkmark-circle" />
                        )}
                      </Item>
                      <View
                        style={{
                          justifyContent: "center",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          flex: 1,
                        }}
                      >
                        {grantedPermissions.map((x: RoleSwitch, index) => {
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                marginVertical: 10,
                                width: Math.round(Dimensions.get("window").width / 3),
                              }}
                            >
                              <Switch
                                value={x.value}
                                onValueChange={value =>
                                  setFieldValue(`grantedPermissions[${index}]`, {
                                    ...x,
                                    value: value,
                                  })
                                }
                              />
                              <Label>{x.displayName}</Label>
                            </View>
                          );
                        })}
                      </View>
                      <Button onPress={handleSubmit} style={styles.marginVrtcl} block rounded>
                        <Text>Save</Text>
                      </Button>
                    </>
                  )}
                </Formik>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  marginVrtcl: {
    marginVertical: 5,
  },
});
export default CreateOrEditRole;
