import React from 'react';
import { inject, observer } from 'mobx-react';
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
  Tabs,
  Tab,
  Form,
  Picker,
} from 'native-base';
import { StyleSheet } from 'react-native';
import Stores from '../../stores/storeIdentifier';
import { Formik } from 'formik';
import * as yup from 'yup';
import UserStore from '../../stores/userStore';
import { _toast } from '../../utils/utils';

export interface Props {
  userStore?: UserStore;
}

export interface State {}

@inject(Stores.UserStore)
@observer
export class Setting extends React.Component<Props, State> {
  newpassword: any;
  newpasswordConfirm: any;
  constructor(props) {
    super(props);
  }

  getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  changePassword = async values => {
    debugger;
    await this.props
      .userStore!.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      })
      .then(() => _toast('Şifre Değiştirildi', 'success'));
  };

  render() {
    return (
      <Container>
        <Content padder>
          <Tabs>
            <Tab
              heading="Şifre Değiştir"
              tabStyle={{ backgroundColor: 'white' }}
              textStyle={{ color: '#000' }}
              activeTabStyle={{ backgroundColor: 'white' }}
              activeTextStyle={{ color: '#3F51B5', fontWeight: 'normal' }}
            >
              <Card>
                <CardItem header bordered>
                  <Text>Change Password</Text>
                </CardItem>
                <CardItem bordered>
                  <Body>
                    <Formik
                      initialValues={{
                        currentPassword: '',
                        newPassword: '',
                        newPasswordConfirm: '',
                      }}
                      validationSchema={yup.object().shape({
                        currentPassword: yup.string().required(),
                        newPassword: yup.string().required('new Password is required'),
                        newPasswordConfirm: yup
                          .string()
                          .oneOf([yup.ref('newPassword'), 'Passwords must match'])
                          .required(),
                      })}
                      validateOnChange={true}
                      onSubmit={values => this.changePassword(values)}
                    >
                      {({ handleChange, values, handleSubmit, errors, handleBlur }) => (
                        <>
                          <Item
                            style={styles.marginVrtcl}
                            error={!!errors.currentPassword}
                            success={!errors.currentPassword}
                            floatingLabel
                          >
                            <Label>Current Password</Label>
                            <Input
                              onSubmitEditing={() => this.newpassword.focus()}
                              onBlur={handleBlur}
                              returnKeyType="next"
                              secureTextEntry={true}
                              value={values.currentPassword}
                              onChangeText={handleChange('currentPassword')}
                            />
                            {errors.currentPassword ? (
                              <Icon name="close-circle" />
                            ) : (
                              <Icon name="checkmark-circle" />
                            )}
                          </Item>
                          <Item
                            style={styles.marginVrtcl}
                            error={!!errors.newPassword}
                            success={!errors.newPassword}
                            floatingLabel
                          >
                            <Label>New Password</Label>
                            <Input
                              onSubmitEditing={() => this.newpasswordConfirm.focus()}
                              onBlur={handleBlur}
                              ref={(ref: any) => {
                                this.newpassword = ref;
                              }}
                              returnKeyType="next"
                              secureTextEntry={true}
                              value={values.newPassword}
                              onChangeText={handleChange('newPassword')}
                            />
                            {errors.newPassword ? (
                              <Icon name="close-circle" />
                            ) : (
                              <Icon name="checkmark-circle" />
                            )}
                          </Item>
                          <Item
                            style={styles.marginVrtcl}
                            error={!!errors.newPasswordConfirm}
                            success={!errors.newPasswordConfirm}
                            floatingLabel
                          >
                            <Label>New Password Confirm</Label>
                            <Input
                              ref={(ref: any) => {
                                this.newpasswordConfirm = ref;
                              }}
                              returnKeyType="done"
                              onSubmitEditing={() => handleSubmit()}
                              onBlur={handleBlur}
                              secureTextEntry={true}
                              value={values.newPasswordConfirm}
                              onChangeText={handleChange('newPasswordConfirm')}
                            />
                            {errors.newPasswordConfirm ? (
                              <Icon name="close-circle" />
                            ) : (
                              <Icon name="checkmark-circle" />
                            )}
                          </Item>
                          <Button onPress={handleSubmit} style={styles.marginVrtcl} block rounded>
                            <Text>Change Password</Text>
                          </Button>
                        </>
                      )}
                    </Formik>
                  </Body>
                </CardItem>
              </Card>
            </Tab>
            <Tab
              heading="Dil Değiştir"
              tabStyle={{ backgroundColor: 'white' }}
              textStyle={{ color: '#000' }}
              activeTabStyle={{ backgroundColor: 'white' }}
              activeTextStyle={{ color: '#3F51B5', fontWeight: 'normal' }}
            >
              <Form>
                <Item picker>
                  <Picker
                    mode="dropdown"
                    iosIcon={<Icon name="arrow-down" />}
                    style={{ width: undefined }}
                    placeholder="Select your SIM"
                    placeholderStyle={{ color: "#bfc6ea" }}
                    placeholderIconColor="#007aff"
                    selectedValue={"key0"}
                  >
                    <Picker.Item label="Wallet" value="key0" />
                    <Picker.Item label="ATM Card" value="key1" />
                    <Picker.Item label="Debit Card" value="key2" />
                    <Picker.Item label="Credit Card" value="key3" />
                    <Picker.Item label="Net Banking" value="key4" />
                  </Picker>
                </Item>
              </Form>
            </Tab>
          </Tabs>
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
export default Setting;
