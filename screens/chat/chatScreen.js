import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import messengerAPI from "../../api/messenger";
import user from "../../api/user";

const chatsDataList = [
  {
    id: "1",
    trainerImage: require("../../assets/images/trainer/trainer1.png"),
    trainerName: "Shilpa Patel",
    lastMessage: "Lorem ipsum sit amet.",
    messageTime: "11:40 am",
  },
];

const ChatScreen = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms();

    return () => {
      getRooms();
    };
  }, []);

  async function getRooms(id) {
    console.log(" GET ROOMS --------------", user.userId);
    await messengerAPI.getRooms(user.userId).then((responses) => {
      //   console.log(responses);
      const roomList = responses?.map((response) => {
        // response.members.filters((item) => item.email !== user.userId)
        return {
          id: response._id,
          trainerImage: require("../../assets/images/trainer/trainer1.png"),
          trainerName: response.members[1].userName,
          lastMessage: "Lorem ipsum sit amet.",
          messageTime: "11:40 am",
        };
      });

      setRooms(roomList);
    });

    console.log(" GET ROOMS --------------");
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        {chats()}
      </View>
    </SafeAreaView>
  );

  function chats() {
    const EmptyListMessage = () => {
      return (
        <Text style={styles.emptyListStyle} className="text-center my-5">
          Pas de conversations
        </Text>
      );
    };

    const renderItem = ({ item }) => (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("Message", { item: item })}
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <View style={styles.trainerImageWrapStyle}>
              <Image
                source={item?.trainerImage}
                style={{ width: 60.0, height: 60.0, borderRadius: 30.0 }}
              />
            </View>
            <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
              <Text numberOfLines={1} style={{ ...Fonts.blackColor18Medium }}>
                {item?.trainerName}
              </Text>
              <Text style={{ ...Fonts.grayColor13Regular }}>
                {item?.lastMessage}
              </Text>
            </View>
          </View>
          <Text style={{ ...Fonts.blackColor13Medium }}>
            {item?.messageTime}
          </Text>
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
        data={rooms}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
        ListEmptyComponent={EmptyListMessage}
      />
    );
  }

  function header() {
    return (
      <>
        <Text
          style={{
            margin: Sizes.fixPadding * 2.0,
            ...Fonts.blackColor18SemiBold,
          }}
        >
          Chats
        </Text>

        {/* <Button
          rounded
          colorScheme="orange"
          onPress={() => navigation.push("AddRecettes")}
          success
        >
          <Text className="text-white border border-rounded bg-orange rounded-lg">
            +
          </Text>
        </Button> */}
      </>
    );
  }
};

const styles = StyleSheet.create({
  trainerImageWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 4.0,
    width: 60.0,
    height: 60.0,
    borderRadius: 30.0,
  },
});

export default ChatScreen;
