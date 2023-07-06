import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";

const { width, height } = Dimensions.get("window");

const StartExerciseScreen = ({ navigation, route }) => {
  const exercice = route.params.exercice;

  const [allExos, setAllExos] = useState(exercice?.allExos);
  const [start, setStart] = useState(false);
  const [valeur, setValeur] = useState(0);
  const [time, setTime] = useState("01:00");

  console.log(allExos)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        {indicators()}
        <View style={{ flex: 1 }}>
          {exerciseImage()}
          {exerciseAndProgressDetail()}
        </View>
      </View>
    </SafeAreaView>
  );

  function exerciseAndProgressDetail() {
    const progressPercentage = 30;

    const progressData = [
      {
        value: 100 - progressPercentage,
        color: Colors.lightGrayColor,
      },
      {
        value: progressPercentage,
        color: Colors.primaryColor,
      },
    ];

    async function timerWorks() {
      if (start === true) {
        let temps_restant = 60; // Temps initial en secondes

        const interval = setInterval(() => {
          const minutes = Math.floor(temps_restant / 60);
          const secondes = temps_restant % 60;

          console.log(
            `Temps restant : ${minutes.toString().padStart(2, "0")}:${secondes
              .toString()
              .padStart(2, "0")}`
          );

          setTime(
            `${minutes.toString().padStart(2, "0")}:${secondes
              .toString()
              .padStart(2, "0")}`
          );

          setValeur((prevValue) => {
            const newValue = prevValue + 1 / 60;
            if (newValue >= 1) {
              clearInterval(interval);
              return 1;
            }
            return newValue;
          });

          temps_restant--;
          
          if (temps_restant === 0) {
            console.log("Temps écoulé !");
            clearInterval(interval);
            navigation.push("TakeRest", {
              exercice: {
                allExos: allExos.filters((it) => it.id !== exercice?.infos?.id),
                exercice: allExos[1],
              },
            });
          }
        }, 1000);
      }
    }

    return (
      <View style={styles.exerciseAndProgressDetailWrapStyle}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Progress.Circle
            size={105}
            indeterminate={false}
            progress={valeur}
            borderWidth={0}
            unfilledColor={Colors.lightGrayColor}
            color={Colors.primaryColor}
            thickness={9}
            allowFontScaling={false}
          />
          <View style={{ position: "absolute" }}>
            <Text style={{ ...Fonts.primaryColor22Bold }}>{time}</Text>
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            marginVertical: Sizes.fixPadding + 2.0,
          }}
        >
          <Text style={{ textAlign: "center", ...Fonts.blackColor14Medium }}>
            {exercice?.infos?.name}
          </Text>
          {/* <Text style={{ ...Fonts.grayColor13Regular }}>
            Next: {allExos[1]?.infos?.name}
          </Text> */}
        </View>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setStart(true);
            timerWorks();
          }}
          style={styles.playArrowIconWrapStyle}
        >
          <MaterialIcons
            name="play-arrow"
            color={Colors.whiteColor}
            size={26}
          />
        </TouchableOpacity>
        <MaterialIcons
          name="arrow-forward"
          color={Colors.blackColor}
          size={24}
          style={{ position: "absolute", right: 20.0, bottom: 5.0 }}
          onPress={() =>
            navigation.push("TakeRest", {
              exercice: {
                allExos: allExos,
                exercice: allExos[1],
              },
            })
          }
        />
      </View>
    );
  }

  function exerciseImage() {
    return (
      <View style={{ marginTop: Sizes.fixPadding * 3.0 }}>
        <Image
          source={require("../../assets/images/workout/workout4.png")}
          style={styles.exerciseImageStyle}
        />
      </View>
    );
  }

  function indicators() {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding * 2.0,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {[...Array(9)].map((e, i) => (
          <View key={i} style={styles.indicatorStyle}>
            {i == 0 ? (
              <View style={styles.processCompletedIndicatorStyle} />
            ) : null}
          </View>
        ))}
      </View>
    );
  }

  function header() {
    return (
      <View style={{ padding: Sizes.fixPadding * 2.0 }}>
        <MaterialIcons
          name="arrow-back-ios"
          color={Colors.blackColor}
          size={22}
          onPress={() => navigation.pop()}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  indicatorStyle: {
    height: 5.0,
    borderRadius: Sizes.fixPadding,
    backgroundColor: "#DBDBDB",
    marginRight: Sizes.fixPadding - 5.0,
    width: width / 11.5,
  },
  processCompletedIndicatorStyle: {
    backgroundColor: Colors.primaryColor,
    height: 5.0,
    borderTopLeftRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding,
    width: width / 15.0,
  },
  exerciseAndProgressDetailWrapStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: Sizes.fixPadding * 2.5,
  },
  playArrowIconWrapStyle: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseImageStyle: {
    height: height / 3.0,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center",
  },
});

export default StartExerciseScreen;
