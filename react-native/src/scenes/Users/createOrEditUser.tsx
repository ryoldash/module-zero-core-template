import React from "react";
import { NavigationScreenProp, NavigationRoute } from "react-navigation";
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
} from "native-base";
import { StyleSheet, Switch, Dimensions, Keyboard } from "react-native";
import Stores from "../../stores/storeIdentifier";
import { Formik } from "formik";
import * as yup from "yup";
import { observer, inject } from "mobx-react";
import { _toast } from "../../utils/utils";
import UserStore from "../../stores/userStore";
import { GetRoles } from "../../services/user/dto/getRolesOuput";

export interface Params {
  id: string;
}

export interface Props {
  userStore?: UserStore;
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
}

interface RoleSwitch {
  name: string;
  displayName: string;
  value: boolean;
}

export interface State {}

@inject(Stores.UserStore)
@observer
export class CreateOrEdituser extends React.Component<Props, State> {
  name: any;
  surname: any;
  emailAdress: any;
  password: any;
  confirmPassword: any;
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
        <Text style={{ fontSize: 24 }}>{navigation.getParam("id") == "" ? "Create" : "Edit"}</Text>
      ),
      headerLeft: (
        <Button onPress={() => navigation.goBack()} style={{ backgroundColor: "white" }}>
          <Icon type="MaterialIcons" name="keyboard-arrow-left" style={{ color: "black" }} />
        </Button>
      ),
      // headerRight: <Text>{navigation.getParam('id')}</Text>,
    };
  };

  isEdit = (): boolean => {
    return this.props.navigation.getParam("id") !== "";
  };

  async componentWillMount() {
    if (this.isEdit()) {
      await this.props.userStore.get({ id: parseInt(this.props.navigation.getParam('id')) });
      await this.props.userStore.getRoles();
    } else {
      await this.props.userStore.createUser();
      await this.props.userStore.getRoles();
    }
  }

  createOrUpdateTenant = async values => {
    values.roleNames = values.roleNames
      .filter((x: RoleSwitch) => x.value === true)
      .map((x: RoleSwitch) => x.name);
    if (this.isEdit()) {
      await this.props.userStore
        .update({ id: this.props.navigation.getParam("id"), ...values })
        .then(() => _toast('Tenant Oluşturuldu', 'success'));
    }
  };

  render() {
    const { editUser, roles } = this.props.userStore!;
    const grantedPermissions = roles.map((x: GetRoles) => {
      if (editUser.roleNames.indexOf(x.normalizedName) !== -1) {
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
                    name: editUser.name,
                    surname: editUser.surname,
                    userName: editUser.userName,
                    emailAdress: editUser.emailAddress,
                    password: editUser.password,
                    confirmPassword: editUser.password,
                    isEdit: this.isEdit(),
                    roleNames: [...grantedPermissions],
                    isActive: editUser.isActive,
                  }}
                  enableReinitialize
                  validationSchema={yup.object().shape({
                    name: yup.string().required(),
                    surname: yup.string().required(),
                    userName: yup.string().required(),
                    emailAdress: yup
                      .string()
                      .email()
                      .required(),
                    password: yup.string().when("isEdit", {
                      is: false,
                      then: yup.string().required(),
                      otherwise: yup.string(),
                    }),
                    confirmPassword: yup.string().when("isEdit", {
                      is: false,
                      then: yup
                        .string()
                        .oneOf([yup.ref('password'), 'password must match'])
                        .required(),
                      otherwise: yup.string(),
                    }),
                    roleNames: yup.array().of(
                      yup.object().shape({
                        value: yup.bool(),
                        name: yup.string(),
                        displayName: yup.string(),
                      }),
                    ),
                  })}
                  validateOnChange={true}
                  onSubmit={value => this.createOrUpdateTenant(value)}
                >
                  {({ handleChange, values, handleSubmit, errors, handleBlur, setFieldValue }) => (
                    <>
                      <Item
                        style={styles.marginVrtcl}
                        error={!!errors.userName}
                        success={!errors.userName}
                        floatingLabel
                      >
                        <Label>User Name</Label>
                        <Input
                          onBlur={handleBlur}
                          returnKeyType="next"
                          onSubmitEditing={() => this.name._root.focus()}
                          value={values.userName}
                          onChangeText={handleChange("userName")}
                        />
                        {errors.name ? (
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
                          onBlur={handleBlur}
                          returnKeyType="next"
                          getRef={(ref: any) => {
                            this.name = ref;
                          }}
                          onSubmitEditing={() => this.surname._root.focus()}
                          value={values.name}
                          onChangeText={handleChange("name")}
                        />
                        {errors.name ? (
                          <Icon name="close-circle" />
                        ) : (
                          <Icon name="checkmark-circle" />
                        )}
                      </Item>
                      <Item
                        style={styles.marginVrtcl}
                        error={!!errors.surname}
                        success={!errors.surname}
                        floatingLabel
                      >
                        <Label>Surname</Label>
                        <Input
                          onSubmitEditing={() => {
                            this.emailAdress._root.focus();
                          }}
                          onBlur={handleBlur}
                          getRef={(ref: any) => {
                            this.surname = ref;
                          }}
                          returnKeyType="next"
                          value={values.surname}
                          onChangeText={handleChange("surname")}
                        />
                        {errors.surname ? (
                          <Icon name="close-circle" />
                        ) : (
                          <Icon name="checkmark-circle" />
                        )}
                      </Item>
                      <Item
                        style={styles.marginVrtcl}
                        error={!!errors.emailAdress}
                        success={!errors.emailAdress}
                        floatingLabel
                      >
                        <Label>Email</Label>
                        <Input
                          onSubmitEditing={() => {
                            if (this.isEdit()) {
                              Keyboard.dismiss();
                            } else {
                              this.password._root.focus();
                            }
                          }}
                          keyboardType="email-address"
                          onBlur={handleBlur}
                          getRef={(ref: any) => {
                            this.emailAdress = ref;
                          }}
                          returnKeyType={this.isEdit() ? 'done' : 'next'}
                          value={values.emailAdress}
                          onChangeText={handleChange("emailAdress")}
                        />
                        {errors.emailAdress ? (
                          <Icon name="close-circle" />
                        ) : (
                          <Icon name="checkmark-circle" />
                        )}
                      </Item>
                      {!this.isEdit() && (
                        <Item
                          style={styles.marginVrtcl}
                          error={!!errors.password}
                          success={!errors.password}
                          floatingLabel
                        >
                          <Label>Password</Label>
                          <Input
                            getRef={(ref: any) => {
                              this.password = ref;
                            }}
                            returnKeyType="next"
                            onSubmitEditing={() => this.confirmPassword._root.focus()}
                            onBlur={handleBlur}
                            value={values.password}
                            onChangeText={handleChange("password")}
                          />
                          {errors.password ? (
                            <Icon name="close-circle" />
                          ) : (
                            <Icon name="checkmark-circle" />
                          )}
                        </Item>
                      )}
                      {!this.isEdit() && (
                        <Item
                          style={styles.marginVrtcl}
                          error={!!errors.confirmPassword}
                          success={!errors.confirmPassword}
                          floatingLabel
                        >
                          <Label>Password Confirm</Label>
                          <Input
                            getRef={(ref: any) => {
                              this.confirmPassword = ref;
                            }}
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                            onBlur={handleBlur}
                            value={values.confirmPassword}
                            onChangeText={handleChange("confirmPassword")}
                          />
                          {errors.confirmPassword ? (
                            <Icon name="close-circle" />
                          ) : (
                            <Icon name="checkmark-circle" />
                          )}
                        </Item>
                      )}
                      <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                        <Switch
                          value={values.isActive}
                          onValueChange={value => setFieldValue("isActive", value)}
                        />
                        <Label> Is Active</Label>
                      </View>
                      <View>
                        <Label>Roles</Label>
                      </View>
                      <View
                        style={{
                          justifyContent: 'flex-start',
                          flexDirection: "row",
                          flexWrap: "wrap",
                          flex: 1,
                        }}
                      >
                        {values.roleNames.map((x: RoleSwitch, index) => {
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
                                  setFieldValue(`roleNames[${index}]`, {
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
                        <Text>{this.isEdit() ? 'Save' : 'Create'}</Text>
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
export default CreateOrEdituser;
