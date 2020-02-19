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
} from 'native-base';
import { StyleSheet } from 'react-native';
import Stores from '../../stores/storeIdentifier';
import AccountStore from '../../stores/accountStore';
import { Formik } from 'formik';
import * as yup from 'yup';

export interface Props {
  accountStore?: AccountStore;
}

export interface State {}

@inject(Stores.AccountStore)
@observer
export class Setting extends React.Component<Props, State> {
  newpassword: any;
  newpasswordConfirm: any;
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Content padder>
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
                  onSubmit={value => console.log(value.currentPassword)}
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
