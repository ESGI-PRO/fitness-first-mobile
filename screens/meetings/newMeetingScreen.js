
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { getLoggedInUser } from "../../services/helpers/authUtils";
import MeetingService from "../../services/api/meeting";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { getRandomeUserImage } from '../../constants/globals';


const meetinService = new MeetingService();

const NewMeetingScreen = ({ rootNavigation }) => {
    const [connectedUser, setConnectedUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const user = await getLoggedInUser();
                setConnectedUser(user);
                if(user.traineeIds && user.traineeIds.length > 0) {
                    const users = await meetinService.getUsersByIds(user.traineeIds);
                    console.log("usershere", users);
                    setUsers(users);
                }else{
                    const trainer = await meetinService.getUserById(user.trainerId);
                    console.log("usershere2", trainer );
                    setUsers([trainer]);
                }
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
      fetchUsers();
    }, []);

    const renderItem = ({ item }) => {
        return (<View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => rootNavigation.push('MeetingCreation', { item: item })}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
            >
                <View>
                    <Image
                        source={getRandomeUserImage()}
                        style={{ width: 60.0, height: 60.0, borderRadius: 30.0, }}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: Sizes.fixPadding, }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor18Medium }}>
                        {item.userName}
                    </Text>
                    {item?.trainerSpeciality && <Text style={{ ...Fonts.grayColor13Regular }}>
                        {item?.trainerSpeciality}
                    </Text>}
                </View>
            </TouchableOpacity>
            <View
                style={{ height: 1.0, marginVertical: Sizes.fixPadding + 10.0, backgroundColor: Colors.grayColor }}
            />
        </View>)
    }
    return (
       <View style={styles.container}>
        <Text style={{ ...Fonts.primaryColor14Bold,
        textAlign: 'center',
        marginTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0
             }}>
            {connectedUser?.isTrainer ? "CHOOSE A TRAINEE" : "CHOOSE A TRAINER"}
        </Text>
            <View style={{ flex: 1 }}>
            <FlatList
            data={users}
            keyExtractor={(item) => `${item.id}`}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Sizes.fixPadding, paddingTop: Sizes.fixPadding - 5.0 }}
        />

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: Sizes.fixPadding * 2.0, backgroundColor: Colors.whiteColor }
});


export default NewMeetingScreen;