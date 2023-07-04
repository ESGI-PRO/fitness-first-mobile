import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Dimensions,
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Linking,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import Dialog from "react-native-dialog";

const { width } = Dimensions.get("window");

// export const plans = [
//     {
//         name: 'Monthly',
//         slug: 'Monthly',
//         stripeId: "price_1N2XeWAor24SfpgrShusCjZi",
//         price: 799,
//         paymentLink: 'https://buy.stripe.com/test_6oE3e3ep03gecuc28e',
//     },
//     {
//         name: 'SixMonths',
//         slug: 'SixMonths',
//         stripeId: "price_1N2ZjhAor24SfpgrTO5vS3Kx",
//         price: 4599,
//         paymentLink: 'https://buy.stripe.com/test_3cs9Cr6Wy8AygKs6ov',
//     },
//     {
//         name: 'Yearly',
//         slug: 'Yearly',
//         stripeId: "price_1N2XgKAor24SfpgrsuIXb4KD",
//         price: 9000,
//         paymentLink: 'https://buy.stripe.com/test_dR65mb6Wy4ki8dW3ck',
//     }
// ];

const plansList = [
  {
    id: "1",
    planeName: "Mensuel",
    amount: 799 / 100,
    days: 7,
    stripeId: "price_1N2XeWAor24SfpgrShusCjZi",
    paymentLink: "https://buy.stripe.com/test_6oE3e3ep03gecuc28e",
    detail: "Access all workout , all health tips and chat with trainer.",
  },
  {
    id: "2",
    planeName: "6 Mois",
    amount: 4599 / 100,
    days: 28,
    stripeId: "price_1N2ZjhAor24SfpgrTO5vS3Kx",
    paymentLink: "https://buy.stripe.com/test_3cs9Cr6Wy8AygKs6ov",
    detail: "Access all workout , all health tips and chat with trainer.",
  },
  {
    id: "3",
    planeName: "Annualy",
    amount: 9000 / 100,
    days: 365,
    stripeId: "price_1N2XgKAor24SfpgrsuIXb4KD",
    paymentLink: "https://buy.stripe.com/test_dR65mb6Wy4ki8dW3ck",
    detail: "Access all workout , all health tips and chat with trainer.",
  },
];

const PremiumPlansScreen = ({ navigation }) => {
  const [state, setState] = useState({
    currentPlane: plansList[1].id,
    showSuccessDialog: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const { currentPlane, showSuccessDialog } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding - 9.0 }}
        >
          {plans()}
          {payButton()}
        </ScrollView>
        {skipDialog()}
      </View>
    </SafeAreaView>
  );

  function skipDialog() {
    return (
      <Dialog.Container
        visible={showSuccessDialog}
        contentStyle={styles.dialogWrapStyle}
        headerStyle={{ margin: 0.0 }}
        onRequestClose={() => {
          updateState({ showSuccessDialog: false });
        }}
      >
        <View
          style={{ backgroundColor: Colors.whiteColor, alignItems: "center" }}
        >
          <Image
            source={require("../../assets/images/icons/done.png")}
            style={{ width: 60.0, height: 60.0, resizeMode: "contain" }}
          />
          <Text
            style={{
              marginVertical: Sizes.fixPadding,
              ...Fonts.blackColor16SemiBold,
            }}
          >
            Successful
          </Text>
          <Text style={{ textAlign: "center", ...Fonts.grayColor13Regular }}>
            {`Lorem ipsum dolor sit amet\nconsectetur adipicing`}
          </Text>
        </View>
      </Dialog.Container>
    );
  }

  function StartSubcription() {
    console.log(state.currentPlane)
    // updateState({ showSuccessDialog: true });
    // setTimeout(() => {
    //   updateState({ showSuccessDialog: false });
    //   navigation.pop();
    // }, 2000);
    Linking.openURL(state.currentPlane)
  }

  function payButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => StartSubcription()}
        style={styles.payButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor18Bold }}>Pay</Text>
      </TouchableOpacity>
    );
  }

  function plans() {
    return (
      <>
        {plansList.map((item) => (
          <View key={`${item.id}`}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => updateState({ currentPlane: item.paymentLink })}
            >
              <View
                style={{
                  backgroundColor:
                    currentPlane == item.paymentLink
                      ? Colors.primaryColor
                      : Colors.whiteColor,
                  ...styles.plansInfoWrapStyle,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={
                      currentPlane == item.paymentLink
                        ? { ...Fonts.whiteColor18SemiBold }
                        : { ...Fonts.blackColor18SemiBold }
                    }
                  >
                    {item.planeName}
                  </Text>
                  <Text
                    style={
                      currentPlane == item.paymentLink
                        ? { ...Fonts.whiteColor18Medium }
                        : { ...Fonts.blackColor18Medium }
                    }
                  >
                    {`$`}
                    {item.amount}
                  </Text>
                </View>
                <Text
                  style={
                    currentPlane == item.paymentLink
                      ? { ...Fonts.whiteColor14Regular }
                      : { ...Fonts.blackColor14Regular }
                  }
                >
                  For {item.days} days
                </Text>
                <Text
                  style={{
                    ...(currentPlane == item.paymentLink
                      ? { ...Fonts.whiteColor12Regular }
                      : { ...Fonts.blackColor13Regular }),
                    marginTop: Sizes.fixPadding - 8.0,
                  }}
                >
                  {item.detail}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </>
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back-ios"
          size={22}
          color={Colors.blackColor}
          onPress={() => navigation.pop()}
        />
        <Text
          style={{
            marginLeft: Sizes.fixPadding + 5.0,
            ...Fonts.blackColor18SemiBold,
          }}
        >
          Abonnements
        </Text>
        {/* <Text fontSize="xs">{JSON.stringify(state)}</Text> */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    margin: Sizes.fixPadding * 2.0,
    elevation: 3.0,
  },
  plansInfoWrapStyle: {
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.5,
    elevation: 4.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  payButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding * 3.0,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding * 5.0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: Sizes.fixPadding * 4.0,
  },
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding + 5.0,
    width: width - 40,
    paddingTop: Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
  },
});

export default PremiumPlansScreen;
