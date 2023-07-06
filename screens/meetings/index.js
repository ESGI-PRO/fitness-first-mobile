import * as React from 'react';
import {useWindowDimensions, StyleSheet, SafeAreaView, StatusBar} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import NewMeetingScreen from './newMeetingScreen';
import MyMeetingsScreen from './myMeetingScreen';
import {View, Text} from 'react-native';
import {Colors, Fonts, Sizes} from "../../constants/styles";
import {MaterialIcons} from '@expo/vector-icons';


export default function MeetingComponent({ navigation }) {
    const layout = useWindowDimensions();

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {
            key: 'new_meeting',
            title: 'New Meeting'
        }, {
            key: 'my_meeting',
            title: 'My Meetings'
        },
    ]);

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
          case 'new_meeting':
            return <NewMeetingScreen jumpTo={jumpTo} rootNavigation={navigation} />;
          case 'my_meeting':
            return <MyMeetingsScreen jumpTo={jumpTo} rootNavigation={navigation} />;
        }
      };


function header() {
    return (
        <View style={
            styles.headerWrapStyle
        }>
            <MaterialIcons name="arrow-back-ios"
                size={22}
                color={
                    Colors.blackColor
                }
                onPress={
                    () => navigation.pop()
                }/>
            <Text style={
                {
                    marginLeft: Sizes.fixPadding + 5.0,
                    ...Fonts.blackColor18SemiBold
                }
            }>
                Meetings
            </Text>
        </View>
    )
}

const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'black' }}
      style={{ backgroundColor: 'white' }}
      renderLabel={({ route, focused }) => {
        const textStyle = focused ? {...Fonts.primaryColor14Bold} : { color: 'black' };
      return (
        <Text style={{ ...textStyle , margin: 8,
       width: "100%" }}>
        {route.title.toLocaleUpperCase()}
      </Text>
      )
      }}
    />
  );


    return (
        <SafeAreaView style={
            {
                flex: 1,
                backgroundColor: Colors.whiteColor,
                marginVertical: Sizes.fixPadding * 2.0
            }
        }>
            <StatusBar backgroundColor={
                Colors.primaryColor
            }/>
            <View style={
                {flex: 1}
            }>
                {
                header()
            }
                <TabView navigationState={
                        {index, routes}
                    }
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    renderTabBar={renderTabBar}
                    initialLayout={
                        {width: layout.width}
                    }/>
            </View>
        </SafeAreaView>

    );
}


const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0
    }
});
