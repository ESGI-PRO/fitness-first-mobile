import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import user from "../../api/user";

const TrainersScreen = ({ navigation }) => {
  const [selectTrainer, setSelectTrainer] = useState([]);
  const [trainersList, setTrainersList] = useState({});

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        <Text>{JSON.stringify(user.data)}</Text>
        {header()}
        {user?.data?.trainerId?.length === 0 && user?.data?.isTrainer === false
          ? ConnectToTrainer() : user?.data?.traineeIds.length >  0 && user?.data?.isTrainer === true ? MyStudents()
          : trainers()}
      </View>
    </SafeAreaView>
  );

  function getMyTrainer() {
    const m = selectTrainer.find(
      (trainer) => trainer.id === user?.data?.trainerId
    );

    console.log(selectTrainer, m);

    setTrainersList({
      id: m?.id,
      trainerImage: require("../../assets/images/trainer/trainer1.png"),
      trainerName: m?.name,
      trainerSpeciality: m?.trainerSpeciality
    });
  }

  function getMyStudents() {
    const m = user?.data?.traineeIds.map((student) => {
      var studen =  user.users.find(user => user.id === student);
      return {
        id: studen?.id,
        trainerImage: require("../../assets/images/trainer/trainer1.png"),
        trainerName: studen?.userName,
        trainerSpeciality: studen?.trainerSpeciality
      }
    })

    console.log(m);

    setTrainersList(m);
  }

  function MyStudents() {
    useEffect(() => {
      getMyStudents();
    }, []);

    const renderItem = ({ item }) => (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("TrainerDetail", { item: item })}
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
        >
          <View style={styles.trainerImageWrapStyle}>
            <Image
              source={item.trainerImage}
              style={{ width: 60.0, height: 60.0, borderRadius: 30.0 }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18Medium }}>
              {item.trainerName}
            </Text>
            <Text style={{ ...Fonts.grayColor13Regular }}>
              {item.trainerSpeciality}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: 1.0,
            marginVertical: Sizes.fixPadding + 10.0,
            backgroundColor: Colors.grayColor,
          }}
        />
      </View>
    );
    return (
      <FlatList
        data={trainersList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Sizes.fixPadding,
          paddingTop: Sizes.fixPadding - 5.0,
        }}
      />
    );
  }

  function trainers() {
    useEffect(() => {
      getMyTrainer();
    }, []);

    const renderItem = ({ item }) => (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("TrainerDetail", { item: item })}
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
        >
          <View style={styles.trainerImageWrapStyle}>
            <Image
              source={item.trainerImage}
              style={{ width: 60.0, height: 60.0, borderRadius: 30.0 }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18Medium }}>
              {item.trainerName}
            </Text>
            <Text style={{ ...Fonts.grayColor13Regular }}>
              {item.trainerSpeciality}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: 1.0,
            marginVertical: Sizes.fixPadding + 10.0,
            backgroundColor: Colors.grayColor,
          }}
        />
      </View>
    );
    return (
      <FlatList
        data={trainersList}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Sizes.fixPadding,
          paddingTop: Sizes.fixPadding - 5.0,
        }}
      />
    );
  }

  function ConnectToTrainer() {
    useEffect(() => {
      user.getTrainers().then((trainers) => {
        console.log(trainers);
        setSelectTrainer(trainers);
      });
    }, []);

    const renderItem = ({ item }) => (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("TrainerDetail", { item: item })}
          style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
        >
          <View style={styles.trainerImageWrapStyle}>
            <Image
              source={item.trainerImage}
              style={{ width: 60.0, height: 60.0, borderRadius: 30.0 }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
            <Text numberOfLines={1} style={{ ...Fonts.blackColor18Medium }}>
              {item.trainerName}
            </Text>
            <Text style={{ ...Fonts.grayColor13Regular }}>
              {item.trainerSpeciality}
            </Text>

            <Text style={{ ...Fonts.grayColor13Regular }}>
              coache {item.traineeIds.length} eleves actuellement
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            height: 1.0,
            marginVertical: Sizes.fixPadding + 10.0,
            backgroundColor: Colors.grayColor,
          }}
        />
      </View>
    );
    return (
      <>
        <Text fontSize="xs" className="mx-5">
          Selectionner votre entraineur : il sera votre coach attitré{" "}
        </Text>

        <FlatList
          data={selectTrainer}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}
        />
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
          {user?.data?.trainerId?.length === 0 && user?.data?.isTrainer === false
          ? "Selectionner votre coach" : user?.data?.traineeIds.length >  0 && user?.data?.isTrainer === true ? "Mes eleves"
          : "Mon coach"}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    margin: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.lightWhiteColor,
    elevation: 3.0,
  },
});

export default TrainersScreen;
