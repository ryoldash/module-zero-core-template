import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { inject, observer } from 'mobx-react';
import { Button, Root } from 'native-base';
import { grid } from '../../style/gridStyle';
import AuthenticationStore from '../../stores/authenticationStore';
import { NavigationStackProp } from 'react-navigation-stack';
import Stores from '../../stores/storeIdentifier';
import { TenantModal } from '../../components/tenantModal/tenantModal';
import AccountStore from '../../stores/accountStore';
import TenantAvailabilityState from '../../services/account/dto/tenantAvailabilityState';
import { _toast } from '../../utils/utils';
import { Formik } from 'formik';
import LoginModel from '../../models/Login/loginModel';
let yup = require('yup');

export interface Props {
  authenticationStore?: AuthenticationStore;
  accountStore?: AccountStore;
  navigation?: NavigationStackProp;
}

export interface State {
  isTenantModalOpen: boolean;
  tenancyName: string;
}

@inject(Stores.AuthenticationStore, Stores.AccountStore)
@observer
export class Login extends React.Component<Props, State> {
  password: any;
  constructor(props) {
    super(props);
    this.state = {
      isTenantModalOpen: false,
      tenancyName: '',
    };
  }

  login = (value: LoginModel) => {
    this.props
      .authenticationStore!.login({
        userNameOrEmailAddress: value.userNameOrEmailAddress,
        password: value.password,
        rememberMe: value.rememberMe,
      })
      .then(() => this.props.navigation.navigate('Auth'));
  };
  toggleTenantModal = () => {
    this.setState({ isTenantModalOpen: !this.state.isTenantModalOpen });
  };

  isTenanAvaible = async (_tenancyName: string) => {
    await this.props.accountStore!.isTenantAvailable(_tenancyName);

    const { tenant } = this.props.accountStore!;
    switch (tenant.state) {
      case TenantAvailabilityState.Available:
        this.toggleTenantModal();
        this.setState({ tenancyName: _tenancyName });
        return;
      case TenantAvailabilityState.InActive:
        _toast('TenantIsNotActive', 'danger');
        break;
      case TenantAvailabilityState.NotFound:
        _toast('TenantIsNotActive', 'danger');
        break;
    }
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={[grid.center, styles.logoContainer]}>
          <Image source={require('../../image/abp-logo-long.png')} style={styles.logo} />
        </View>
        <View style={styles.card}>
          <View style={styles.tenantText}>
            <Text>Geçerli müşteri:</Text>
            <Text> {this.state.tenancyName}</Text>
            <TouchableOpacity onPress={() => this.toggleTenantModal()}>
              <Text style={{ color: '#00b5ec' }}> (Değiştir)</Text>
            </TouchableOpacity>
          </View>
          <Formik
            initialValues={{ email: 'admin', password: '123qwe' }}
            validationSchema={yup.object().shape({
              email: yup.string().required(),
              password: yup.string().required(),
            })}
            validateOnChange={true}
            onSubmit={value =>
              this.login({
                userNameOrEmailAddress: value.email,
                password: value.password,
                rememberMe: true,
              })
            }
          >
            {({ handleChange, values, handleSubmit, errors, handleBlur }) => (
              <>
                <TextInput
                  style={[styles.inputs, errors.email && styles.errorInput]}
                  placeholder="Email Adress"
                  onSubmitEditing={() => this.password.focus()}
                  onBlur={handleBlur}
                  returnKeyType="next"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                <TextInput
                  style={[styles.inputs, errors.password && styles.errorInput]}
                  returnKeyType="done"
                  ref={(ref: any) => {
                    this.password = ref;
                  }}
                  placeholder="Password"
                  onSubmitEditing={() => handleSubmit()}
                  secureTextEntry={true}
                  keyboardType="default"
                  value={values.password}
                  onChangeText={handleChange('password')}
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                <Button style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </Button>
              </>
            )}
          </Formik>
          <TouchableOpacity onPress={() => {}} style={styles.textButton}>
            <Text> Forget Password</Text>
          </TouchableOpacity>
        </View>
        <TenantModal
          loading={this.state.isTenantModalOpen}
          isTenantAvaible={(tenantName: string) => this.isTenanAvaible(tenantName)}
          toggleModal={() => this.toggleTenantModal()}
        />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'space-around',
    backgroundColor: '#DCDCDC',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    shadowColor: '#000',
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
    borderRadius: 12,
    width: Math.round(Dimensions.get('window').width - 60),
  },
  logo: {
    resizeMode: 'contain',
    width: Math.round(Dimensions.get('window').width - 60),
  },
  logoContainer: {
    width: Math.round(Dimensions.get('window').width - 60),
    margin: 30,
  },
  inputs: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#DCDCDC',
    borderRadius: 12,
    marginTop: 20,
    height: 40,
    paddingLeft: 10,
  },
  errorInput: {
    borderColor: '#ff4d4f',
    borderWidth: 1,
  },
  button: {
    height: 40,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: '#00b5ec',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  textButton: {
    alignItems: 'center',
    height: 20,
  },
  errorText: {
    color: '#ff4d4f',
  },
  tenantText: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: 2,
    height: 60,
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(191, 191, 191, 0.5)',
  },
});

export default Login;
