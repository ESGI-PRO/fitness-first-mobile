
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getLoggedInUser } from "../../services/helpers/authUtils";
import MeetingService from "../../services/api/meeting";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { getRandomeUserImage } from '../../constants/globals';
import { dateDividerFormat, getTime } from '../../services/helpers/dateUtils';
import { useAppState } from '../../context/app-state-context';


const meetingService = new MeetingService();

const MyMeetingsScreen = ({rootNavigation}) => {
    const [connectedUser, setConnectedUser] = React.useState(null);
    const {appState, setAppState} = useAppState();

    React.useEffect(() => {
        const init = async () => {
            const user = await getLoggedInUser();
            setConnectedUser(user);
            const meetings = await meetingService.getAllUserMeetings(user.id);
            setAppState({meetings: meetings})
        };
        init();
    }, []);


    const joinMeeting = async (item) => {
        const opponent = item.members.find((member) => member.id !== connectedUser.id);
        const {token} = await meetingService.getTwilioToken(connectedUser.id);
        const room = await meetingService.getRoomByIds([connectedUser.id, opponent.id]);
        rootNavigation.push('MeetingVideo', { opponent: opponent , token: token, roomName: room });
    }



    const renderItem = ({ item }) => {
        const opponent = item.members.find((member) => member.id !== connectedUser.id);

        return (<View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
            <View
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
                <View>
                    <Image
                        source={getRandomeUserImage()}
                        style={{ width: 60.0, height: 60.0, borderRadius: 30.0, }}
                    />
                </View>
                <View style={styles.mainCardView}>
                   <View>
                   <Text numberOfLines={1} style={{ ...Fonts.blackColor18Medium }}>
                        {opponent.userName}
                    </Text>
                    {opponent?.trainerSpeciality && <Text style={{ ...Fonts.grayColor13Regular }}>
                        {opponent?.trainerSpeciality}
                    </Text>}
                   </View>

                    <View style={styles.timeDateView}>

                            {item.date && <Text >
                            {dateDividerFormat(item.date)}
                            </Text>}
                           {item.time && <Text >
                            {getTime(item.time)}
                            </Text>}
                    
                    </View>
                </View>
            </View>
            <View>
            <Text style={{ ...Fonts.grayColor13Regular, marginTop: Sizes.fixPadding }}>
                    {item.description}
                </Text>
            </View>
            <TouchableOpacity style={styles.joinButton} onPress={() => joinMeeting(item)}>
                    <Text style={styles.joinButtonText}>JOIN</Text>
                </TouchableOpacity>
            <View
                style={{ height: 1.0, marginVertical: Sizes.fixPadding + 10.0, backgroundColor: Colors.grayColor }}
            />
        </View>)
    }
    return (
       <View style={styles.container}>
            <View style={{ flex: 1 }}>
            <FlatList
            data={appState.meetings}
            keyExtractor={(item) => `${item.id} - ${item.date}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding, paddingTop: Sizes.fixPadding - 5.0 }}
        />

            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Sizes.fixPadding * 4.0, backgroundColor: Colors.whiteColor },
    mainCardView: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: Sizes.fixPadding * 2.0,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        
    },
    timeDateView: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginTop: Sizes.fixPadding,
        color: Fonts.blackColor14SemiBold,
},
joinButton: {
    marginTop: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.primaryColor,
    textAlign: 'center',
    paddingVertical: Sizes.fixPadding,
    borderRadius: 10,
    elevation: 3.0,
    alignSelf: 'flex-end',
    paddingHorizontal: Sizes.fixPadding * 2.0,
},
joinButtonText: {
    color: Colors.whiteColor,
    ...Fonts.whiteColor16SemiBold,
    textAlign: 'center'
},
});


export default MyMeetingsScreen;