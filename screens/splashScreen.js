import React, { useCallback } from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet, ImageBackground, Image, BackHandler } from 'react-native';
import { Colors, Sizes } from '../constants/styles';
import { useFocusEffect } from '@react-navigation/native';
import { isUserAuthenticated } from '../services/helpers/authUtils';

const SplashScreen = ({ navigation }) => {

    const backAction = () => {
        BackHandler.exitApp();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    setTimeout(() => {
        // if user is logged in then navigate to home screen
        isUserAuthenticated().then((res) => {
            if (res) {
                navigation.navigate('BottomTabBar')
            } else {
                navigation.navigate('Onboarding')
            }
        }).catch((err) => {
            navigation.navigate('Onboarding')
            console.log(err);
        })
    }, 2000)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <StatusBar translucent backgroundColor='transparent' />
            <ImageBackground
                source={require('../assets/images/bg1.png')}
                style={{ flex: 1, }}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(250, 156, 122, 0.76)',
                    justifyContent: 'flex-end',
                }}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logoStyle}
                    />
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    logoStyle: {
        height: 135.0,
        width: '100%',
        resizeMode: 'contain',
        marginBottom: Sizes.fixPadding * 4.0,
    }
})

export default SplashScreen;