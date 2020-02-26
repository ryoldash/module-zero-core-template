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
import { StyleSheet, Switch } from "react-native";
import Stores from "../../stores/storeIdentifier";
import { Formik } from "formik";
import * as yup from "yup";
import { observer, inject } from "mobx-react";
import TenantStore from "../../stores/tenantStore";
import { _toast } from "../../utils/utils";

export interface Params {
  id: string;
}

export interface Props {
  tenantStore?: TenantStore;
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params>;
}

export interface State {}

@inject(Stores.TenantStore)
@observer
export class CreateOrEditTenant extends React.Component<Props, State> {
  name: any;
  databaseConnectionString: any;
  emailAdress: any;
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
    this.isEdit()
      ? await this.props
          .tenantStore!.get({ id: parseInt(this.props.navigation.getParam('id')) })
          .catch(() => this.props.navigation.goBack())
      : this.props.tenantStore!.createTenant();
  }
  createOrUpdateTenant = value => {
    if (this.isEdit()) {
      this.props
        .tenantStore!.update({
          id: parseInt(this.props.navigation.getParam('id')),
          tenancyName: value.tenancyName,
          isActive: value.isActive,
          name: value.name,
        })
        .then(() => _toast('Update başarılı', 'success'));
    } else {
      this.props
        .tenantStore!.create({
          tenancyName: value.tenancyName,
          isActive: value.isActive,
          name: value.name,
          connectionString: value.databaseConnectionString,
          adminEmailAddress: value.emailAdress,
        })
        .then(() => _toast('Tenant Oluşturuldu', 'success'));
    }
  };

  render() {
    const { tenantModel } = this.props.tenantStore!;
    return (
      <Container>
        <Content padder>
          <Card>
            <CardItem bordered>
              <Body>
                <Formik
                  initialValues={{
                    tenancyName: tenantModel.tenancyName,
                    name: tenantModel.name,
                    databaseConnectionString: "",
                    emailAdress: "",
                    isEdit: this.isEdit(),
                    isActive: tenantModel.isActive,
                  }}
                  enableReinitialize
                  validationSchema={yup.object().shape({
                    tenancyName: yup.string().required(),
                    name: yup.string().required(),
                    databaseConnectionString: yup.string(),
                    emailAdress: yup.string().when("isEdit", {
                      is: false,
                      then: yup
                        .string()
                        .email()
                        .required(),
                    }),
                  })}
                  validateOnChange={true}
                  onSubmit={value => this.createOrUpdateTenant(value)}
                >
                  {({ handleChange, values, handleSubmit, errors, handleBlur, setFieldValue }) => (
                    <>
                      <Item
                        style={styles.marginVrtcl}
                        error={!!errors.tenancyName}
                        success={!errors.tenancyName}
                        floatingLabel
                      >
                        <Label>Tenancy Name</Label>
                        <Input
                          onBlur={handleBlur}
                          returnKeyType="next"
                          onSubmitEditing={() => this.name._root.focus()}
                          value={values.tenancyName}
                          onChangeText={handleChange("tenancyName")}
                        />
                        {errors.tenancyName ? (
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
                          onSubmitEditing={() => {
                            if (this.isEdit()) {
                              this.databaseConnectionString._root.focus();
                            } else {
                              handleSubmit();
                            }
                          }}
                          onBlur={handleBlur}
                          getRef={(ref: any) => {
                            this.name = ref;
                          }}
                          returnKeyType={this.isEdit() ? "next" : "done"}
                          value={values.name}
                          onChangeText={handleChange("name")}
                        />
                        {errors.name ? (
                          <Icon name="close-circle" />
                        ) : (
                          <Icon name="checkmark-circle" />
                        )}
                      </Item>
                      {!this.isEdit() && (
                        <Item
                          style={styles.marginVrtcl}
                          error={!!errors.databaseConnectionString}
                          success={!errors.databaseConnectionString}
                          floatingLabel
                        >
                          <Label>Database Connetion String</Label>
                          <Input
                            onSubmitEditing={() => this.emailAdress._root.focus()}
                            onBlur={handleBlur}
                            getRef={(ref: any) => {
                              this.databaseConnectionString = ref;
                            }}
                            returnKeyType="next"
                            value={values.databaseConnectionString}
                            onChangeText={handleChange("databaseConnectionString")}
                          />
                          {errors.databaseConnectionString ? (
                            <Icon name="close-circle" />
                          ) : (
                            <Icon name="checkmark-circle" />
                          )}
                        </Item>
                      )}
                      {!this.isEdit() && (
                        <Item
                          style={styles.marginVrtcl}
                          error={!!errors.emailAdress}
                          success={!errors.emailAdress}
                          floatingLabel
                        >
                          <Label>Email</Label>
                          <Input
                            getRef={(ref: any) => {
                              this.emailAdress = ref;
                            }}
                            keyboardType="email-address"
                            returnKeyType="done"
                            onSubmitEditing={() => handleSubmit()}
                            onBlur={handleBlur}
                            value={values.emailAdress}
                            onChangeText={handleChange("emailAdress")}
                          />
                          {errors.emailAdress ? (
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
export default CreateOrEditTenant;
