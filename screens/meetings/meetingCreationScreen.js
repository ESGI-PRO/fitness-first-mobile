import * as React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, TextInput, TouchableOpacity} from 'react-native';
import { View, Text } from 'react-native';
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import MeetingService from "../../services/api/meeting";
import { getLoggedInUser } from "../../services/helpers/authUtils";
import { useAppState } from '../../context/app-state-context';


const meetingService = new MeetingService();

export default function MeetinCreationScreen({ navigation, route }) {
    const item = route.params.item;
    const {setAppState} = useAppState();
    const [connectedUser, setConnectedUser] = React.useState(null);
    const [opponent, setOpponent] = React.useState(null);
    const [meeting, setMeeting] = React.useState({
        description: '',
        time: new Date(),
        date: new Date(),
    });

    React.useEffect(() => {
        const init = async () => {
            const user = await getLoggedInUser();
            setConnectedUser(user);
            setOpponent(item);
        };
      init();
    }, []);


    const onChange = (text) => {
        setMeeting({
            ...meeting,
            description: text
        })
    };
    const onChangeDate = (e, selectedDate) => {
        setMeeting({
            ...meeting,
            date: selectedDate
        })
    };

    const onChangeTime = (e, selectedTime) => {
        setMeeting({
            ...meeting,
            time: selectedTime
        })
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
                    New Meeting
                </Text>
            </View>
        )
    }

   const  DatePicker = () => {

        return (
           <DateTimePicker
                mode={"date"}
                onChange={onChangeDate}
                value={meeting.date}
                minimumDate={new Date()}
                maximumDate={new Date("2029-12-31")}
                customStyles={{
                    dateInput: {
                        padding: 5,
                        alignItems: 'flex-start'
                    }
                }}
                
            />
        )
    }
  const TimePicker = () => {
        return (
            <DateTimePicker
                mode={"time"}
                is24Hour={true}
                onChange={onChangeTime}
                value={meeting.time}
                customStyles={{
                    dateInput: {
                        padding: 5,
                        alignItems: 'flex-start'
                    }
                }}
            />
        )
  }

  const createMeeting = async () => {
    if (meeting.description && meeting.date && meeting.time && connectedUser && opponent) {
        const data = {
            date: meeting.date.toLocaleDateString('en-US'),
            time: meeting.time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
            sender_id: connectedUser.id,
            description: meeting.description,
            members: [opponent.id, connectedUser.id]
        }
        await meetingService.createMeeting(data);
        const meetings = await meetingService.getAllUserMeetings(connectedUser.id);
        setAppState({meetings: meetings})
        navigation.pop();
    }

  }

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
            <View style={styles.creationBody}>
                <Text style={styles.label}>Description</Text>
                <TextInput
                    placeholder='Add Description'
                    multiline={true}
                    numberOfLines={5}
                    name='description'
                    onChangeText={onChange}
                    placeholderTextColor={Colors.grayColor}
                    style={styles.inputStyle}
                    selectionColor={Colors.primaryColor}
                />
                <Text style={styles.label}>Time</Text>
                <View style={styles.datetime}>
                {TimePicker('time')}
                </View>

                <Text style={styles.label}>Date</Text>

                <View style={styles.datetime}>
                    {DatePicker('date')}
                </View>

                <TouchableOpacity style={styles.createButton} onPress={createMeeting}>
                    <Text style={styles.createButtonText}>Create Meeting</Text>
                </TouchableOpacity>
                </View>
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
    },
    creationBody: { 
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginVertical: Sizes.fixPadding * 2.0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    inputStyle: {
        height: 150,
        borderColor: Colors.grayColor,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding * 2.0,
        color: Colors.grayColor,
        marginHorizontal: Sizes.fixPadding
    },
    datetime: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 10,
    },
    createButton: {
        marginTop: Sizes.fixPadding * 6.0,
        marginBottom: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.primaryColor,
        textAlign: 'center',
        paddingVertical: Sizes.fixPadding * 1.5,
        borderRadius: 10,
        elevation: 3.0,
        marginHorizontal: Sizes.fixPadding
    },
    createButtonText: {
        color: Colors.whiteColor,
        ...Fonts.whiteColor16SemiBold,
        textAlign: 'center'
    },
    label: { ...Fonts.blackColor16SemiBold, 
        marginBottom: Sizes.fixPadding * 2.0, 
        marginTop: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding,
    }
});
