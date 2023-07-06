import React, { useState, createRef, useCallback } from "react";
import { BackHandler, SafeAreaView, View, StatusBar, StyleSheet, ScrollView, Dimensions, ImageBackground, Image, TouchableOpacity, Text } from "react-native";
import { Sizes, Colors, Fonts } from "../../constants/styles";
import { Input } from '@rneui/themed';
import { useFocusEffect } from "@react-navigation/native";
import { Switch } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import {specialityList} from '../../constants/globals';
import AuthService  from "../../services/api/auth";
import user from "../../api/user";

const { width, height } = Dimensions.get('window');
const authService = new AuthService();


const LoginRegisterScreen = ({ navigation }) => {

    const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    function _spring() {
        updateState({ backClickCount: 1 });
        setTimeout(() => {
            updateState({ backClickCount: 0 })
        }, 1000)
    }

    const [state, setState] = useState({
        backClickCount: 0,
        isLogin: true,
        loginEmail: null,
        loginPassword: null,
        loginPasswordSecure: false,
        userName: null,
        email: null,
        mobileNumber: null,
        registerPassword: null,
        confirmPassword: null,
        registerPasswordSecure: false,
        confirmPasswordSecure: false,
        trainerSpeciality: null,
        isTrainer: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))


    const {
        backClickCount,
        isLogin,
        loginEmail,
        loginPassword,
        loginPasswordSecure,
        userName,
        email,
        mobileNumber,
        registerPassword,
        confirmPassword,
        registerPasswordSecure,
        confirmPasswordSecure,
        trainerSpeciality,
        isTrainer,
    } = state;

    const canLogin = () => {
        return loginEmail && loginPassword
    }
    const canRegister = () => {
        return userName && email && mobileNumber && registerPassword && confirmPassword
    }

    const registerUser = () => {
        const data = {
            userName: userName,
            email: email,
            password: registerPassword,
            mobileNumber: mobileNumber,
            isTrainer: isTrainer,
            trainerSpeciality: trainerSpeciality,
        }
        authService.register(data).then((res) => {
            navigation.push('LoginRegister')
            console.log('res', res);
        }).catch((err) => {
            console.log('err', err);
        })
    }

    const loginUser = () => {
        const data = {
            email: loginEmail,
            password: loginPassword,
        }
        authService.login(data).then((res) => {
            user.init()
            navigation.push('BottomTabBar')
            console.log('res', res);
        }).catch((err) => {
            console.log('err', err);
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <ImageBackground
                source={require('../../assets/images/bg2.png')}
                style={{ flex: 1 }}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    paddingTop: StatusBar.currentHeight + (Sizes.fixPadding * 3.0),
                }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0 }}
                    >
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.logoImageStyle}
                        />
                        {loginRegisterOptions()}
                        {isLogin
                            ?
                            loginInfo()
                            :
                            registerInfo()
                        }
                    </ScrollView>
                </View>
            </ImageBackground>
            {
                backClickCount == 1
                    ?
                    <View style={[styles.animatedView]}>
                        <Text style={{ ...Fonts.whiteColor12Medium }}>
                            Press Back Once Again to Exit
                        </Text>
                    </View>
                    :
                    null
            }
        </SafeAreaView>
    )

    function registerInfo() {
        return (
            <View>
                {userNameTextField()}
                {emailTextField()}
                {mobileNumberTextField()}
                {registerPasswordTextField()}
                {confirmPasswordTextField()}
                {isTrainerField()}
                {isTrainer ? trainerSpecialityField() : null}
                {registerButton()}
                {/*continueWithOptionsInfo()*/}

            </View>
        )
    }

    function isTrainerField(){
        return (
            <View style={styles.isTrainerField}>
                <Text style={{ ...Fonts.whiteColor14Medium }}>
                    Are you a trainer?
                </Text>
                <Switch
                    value={isTrainer}
                    onValueChange={() => updateState({ isTrainer: !isTrainer })}
                    style={{ ...Fonts.whiteColor14Medium }}
                />
            </View>
        )
    }

    function trainerSpecialityField() {
        return (
        <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        data={specialityList}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select trainer speciality"
        value={trainerSpeciality}
        onChange={item => {
         updateState({ trainerSpeciality: item.value });
        }}
        renderLeftIcon={() => (
          <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        )}
      />
        )
    }

    function registerButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>{
                     canRegister() && registerUser()
                }}
                style={styles.loginAndRegisterButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18Bold }}>
                    Register
                </Text>
            </TouchableOpacity>
        )
    }

    function loginButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    canLogin() && loginUser()
                }}
                style={styles.loginAndRegisterButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor18Bold }}>
                    Login
                </Text>
            </TouchableOpacity>
        )
    }

    function confirmPasswordTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={confirmPassword}
                onChangeText={(text) => updateState({ confirmPassword: text })}
                selectionColor={Colors.primaryColor}
                placeholder='Confirm Password'
                placeholderTextColor={Colors.whiteColor}
                autoCapitalize='none'
                leftIcon={{
                    type: 'material',
                    color: Colors.whiteColor,
                    name: 'lock-outline',
                    size: 19,
                    onPress: () => { input.current.focus() }
                }}
                secureTextEntry={confirmPasswordSecure}
                rightIcon={{
                    type: 'material-community',
                    color: Colors.whiteColor,
                    name: confirmPasswordSecure ? 'eye-off-outline' : 'eye-outline',
                    size: 19,
                    onPress: () => { updateState({ confirmPasswordSecure: !confirmPasswordSecure }) }
                }}
                style={{ ...Fonts.whiteColor14Medium, marginLeft: Sizes.fixPadding + 5.0 }}
                inputContainerStyle={{ height: 40.0, borderBottomColor: Colors.whiteColor, borderBottomWidth: 2.0, }}
                containerStyle={{ ...styles.textFieldStyle }}
            />
        )
    }

    function registerPasswordTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={registerPassword}
                onChangeText={(text) => updateState({ registerPassword: text })}
                selectionColor={Colors.primaryColor}
                placeholder='Password'
                placeholderTextColor={Colors.whiteColor}
                autoCapitalize='none'
                leftIcon={{
                    type: 'material',
                    color: Colors.whiteColor,
                    name: 'lock-outline',
                    size: 19,
                    onPress: () => { input.current.focus() }
                }}
                secureTextEntry={registerPasswordSecure}
                rightIcon={{
                    type: 'material-community',
                    color: Colors.whiteColor,
                    name: registerPasswordSecure ? 'eye-off-outline' : 'eye-outline',
                    size: 19,
                    onPress: () => { updateState({ registerPasswordSecure: !registerPasswordSecure }) }
                }}
                style={{ ...Fonts.whiteColor14Medium, marginLeft: Sizes.fixPadding + 5.0 }}
                inputContainerStyle={{ height: 40.0, borderBottomColor: Colors.whiteColor, borderBottomWidth: 2.0, }}
                containerStyle={{ marginVertical: Sizes.fixPadding + 5.0, ...styles.textFieldStyle }}
            />
        )
    }

    function mobileNumberTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={mobileNumber}
                onChangeText={(text) => updateState({ mobileNumber: text })}
                selectionColor={Colors.primaryColor}
                placeholder='Mobile Number'
                placeholderTextColor={Colors.whiteColor}
                leftIcon={{
                    type: 'material-community',
                    color: Colors.whiteColor,
                    name: 'phone-outline',
                    size: 19,
                    onPress: () => { input.current.focus() }
                }}
                style={{ ...Fonts.whiteColor14Medium, marginLeft: Sizes.fixPadding + 5.0 }}
                inputContainerStyle={{ height: 40.0, borderBottomColor: Colors.whiteColor, borderBottomWidth: 2.0, }}
                containerStyle={styles.textFieldStyle}
                keyboardType="phone-pad"
            />
        )
    }

    function emailTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={email}
                onChangeText={(text) => updateState({ email: text })}
                selectionColor={Colors.primaryColor}
                autoCapitalize='none'
                placeholder='Email'
                placeholderTextColor={Colors.whiteColor}
                leftIcon={{
                    type: 'material-community',
                    color: Colors.whiteColor,
                    name: 'email-outline',
                    size: 19,
                    onPress: () => { input.current.focus() }
                }}
                style={{ ...Fonts.whiteColor14Medium, marginLeft: Sizes.fixPadding + 5.0 }}
                inputContainerStyle={{ height: 40.0, borderBottomColor: Colors.whiteColor, borderBottomWidth: 2.0, }}
                containerStyle={{ marginVertical: Sizes.fixPadding + 5.0, ...styles.textFieldStyle }}
                //keyboardType="email-address"
                secureTextEntry={false}
            />
        )
    }

    function userNameTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={userName}
                onChangeText={(text) => updateState({ userName: text })}
                selectionColor={Colors.primaryColor}
                placeholder='User Name'
                placeholderTextColor={Colors.whiteColor}
                autoCapitalize='none'
                leftIcon={{
                    type: 'material',
                    color: Colors.whiteColor,
                    name: 'person-outline',
                    size: 19,
                    onPress: () => { input.current.focus() }
                }}
                style={{ ...Fonts.whiteColor14Medium, marginLeft: Sizes.fixPadding + 5.0 }}
                inputContainerStyle={{ height: 40.0, borderBottomColor: Colors.whiteColor, borderBottomWidth: 2.0, }}
                containerStyle={styles.textFieldStyle}
            />
        )
    }

    function loginInfo() {
        return (
            <View>
                {loginEmailTextField()}
                {loginPasswordTextField()}
                {forgetPaswordText()}
                {loginButton()}
                {/*continueWithOptionsInfo()*/}
            </View>
        )
    }

    function continueWithOptionsInfo() {
        return (
            <View>
                <Text style={{ textAlign: 'center', ...Fonts.whiteColor13Regular }}>
                    Or Continue with
                </Text>
                <View style={styles.facebookAndGoogleButtonWrapStyle}>
                    <View style={styles.facebookAndGoogleButtonStyle}>
                        <Image
                            source={require('../../assets/images/icons/facebook.png')}
                            style={styles.facebookAndGoogleImageStyle}
                        />
                        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.whiteColor13Regular }}>
                            Facebook
                        </Text>
                    </View>
                    <View style={styles.facebookAndGoogleButtonStyle}>
                        <Image
                            source={require('../../assets/images/icons/google.png')}
                            style={styles.facebookAndGoogleImageStyle}
                        />
                        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.whiteColor13Regular }}>
                            Google
                        </Text>
                    </View>
                </View>
            </View>
        )
    }


    function forgetPaswordText() {
        return (
            <Text style={{ marginTop: Sizes.fixPadding - 5.0, marginHorizontal: Sizes.fixPadding * 2.0, textAlign: 'right', ...Fonts.primaryColor13Medium }}>
                Forget password?
            </Text>
        )
    }

    function loginPasswordTextField() {
        const input = createRef();
        return (
            <Input
                ref={input}
                value={loginPassword}
                onChangeText={(text) => updateState({ loginPassword: text })}
                selectionColor={Colors.primaryColor}
                placeholder='Password'
                placeholderTextColor={Colors.whiteColor}
                autoCapitalize='none'
                leftIcon={{
                    type: 'material',
                    color: Colors.whiteColor,
                    name: 'lock-outline',
                    size: 19,
                    onPress: () => { input.current.focus() }
                }}
                secureTextEntry={loginPasswordSecure}
                rightIcon={{
                    type: 'material-community',
                    color: Colors.whiteColor,
                    name: loginPasswordSecure ? 'eye-off-outline' : 'eye-outline',
                    size: 19,
                    onPress: () => { updateState({ loginPasswordSecure: !loginPasswordSecure }) }
                }}
                style={{ ...Fonts.whiteColor14Medium, marginLeft: Sizes.fixPadding + 5.0 }}
                inputContainerStyle={{ height: 40.0, borderBottomColor: Colors.whiteColor, borderBottomWidth: 2.0, }}
                containerStyle={{ marginTop: Sizes.fixPadding + 5.0, ...styles.textFieldStyle }}
            />
        )
    }

    function loginEmailTextField() {

        const input = createRef();
        return (
            <Input
                ref={input}
                value={loginEmail}
                onChangeText={(text) => updateState({ loginEmail: text })}
                selectionColor={Colors.primaryColor}
                placeholder='Enter Your Email'
                placeholderTextColor={Colors.whiteColor}
                autoCapitalize='none'
                leftIcon={{
                    type: 'material-community',
                    color: Colors.whiteColor,
                    name: 'email-outline',
                    size: 19,
                    onPress: () => { input.current.focus() }
                }}
                style={{ ...Fonts.whiteColor14Medium, marginLeft: Sizes.fixPadding + 5.0 }}
                inputContainerStyle={{ height: 40.0, borderBottomColor: Colors.whiteColor, borderBottomWidth: 2.0, }}
                containerStyle={styles.textFieldStyle}
                //keyboardType="email-address"
            />
        )
    }

    function loginRegisterOptions() {
        return (
            <View style={{ margin: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center', }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => updateState({ isLogin: true })}
                    style={{ flex: 1, }}
                >
                    <Text style={{ textAlign: 'center', ...isLogin ? { ...Fonts.primaryColor16Bold } : { ...Fonts.whiteColor16Bold } }}>
                        Login
                    </Text>
                    <View
                        style={{
                            marginTop: Sizes.fixPadding,
                            height: 3.0,
                            backgroundColor: isLogin ? Colors.primaryColor : Colors.whiteColor
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => updateState({ isLogin: false })}
                    style={{ flex: 1, }}
                >
                    <Text style={{ textAlign: 'center', ...!isLogin ? { ...Fonts.primaryColor16Bold } : { ...Fonts.whiteColor16Bold } }}>
                        Register
                    </Text>
                    <View
                        style={{
                            marginTop: Sizes.fixPadding,
                            height: 3.0,
                            backgroundColor: !isLogin ? Colors.primaryColor : Colors.whiteColor
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    facebookAndGoogleButtonStyle: {
        flex: 1,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding * 2.5,
        paddingVertical: Sizes.fixPadding + 2.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding,
    },
    facebookAndGoogleImageStyle: {
        width: 15.0,
        height: 15.0,
        resizeMode: 'contain',
        tintColor: Colors.primaryColor
    },
    facebookAndGoogleButtonWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding * 4.0,
    },
    logoImageStyle: {
        height: 90.0,
        resizeMode: 'contain',
        width: 150.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    loginAndRegisterButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding * 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 3.0,
    },
    textFieldStyle: {
        height: 40.0,
        width: width - 25.0,
        alignSelf: 'center'
    },
    animatedView: {
        backgroundColor: "#333333",
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
    dropdown: {
        margin: Sizes.fixPadding * 2.0,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
      },
      icon: {
        marginRight: 5,
        color: Colors.whiteColor,
      },
      placeholderStyle: {
        fontSize: 16,
        color: Colors.whiteColor,
      },
      selectedTextStyle: {
        fontSize: 16,
        color: Colors.whiteColor,
      },
      iconStyle: {
        width: 20,
        height: 20,
        tintColor: Colors.whiteColor,
      },
      isTrainerField: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
      }
})

export default LoginRegisterScreen;