import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet,TouchableOpacity, LogBox } from 'react-native';
import { TwilioVideo } from 'react-native-twilio-video-webrtc';

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

const MeetingVideoScreen = ({navigation, route}) => {
    const [props, setProps] = useState({
        ...route.params,
        status: 'disconnected'
    });
    const twilioVideo = useRef(null);

    useEffect(() => {
        twilioVideo.current.connect({roomName: props.roomName, accessToken: props.token});
        setProps({
            ...props,
            ...route.params,
            status: 'connecting'
        });
        return() => {
            _onEndButtonPress();
        };
    }, []);

    const _onEndButtonPress = () => {
        twilioVideo.current.disconnect();
        setProps(initialState);
    };

    const _onMuteButtonPress = () => {
        twilioVideo.current.setLocalAudioEnabled(!props.isAudioEnabled).then((isEnabled) => setProps({
            ...props,
            isAudioEnabled: isEnabled
        }));
    };

    const _onFlipButtonPress = () => {
        twilioVideo.current.flipCamera();
    };


     return(<View style={{flex: 1}}>
        {
        (props.status === 'connected' || props.status === 'connecting') && (
            <View style={
                styles.callWrapper
            }>
                {
                props.status === 'connected' && (
                    <View style={
                        styles.grid
                    }>
                        {
                        Array.from(props.videoTracks, ([trackSid, trackIdentifier]) => (
                            <TwilioVideoParticipantView style={
                                    styles.remoteVideo
                                }
                                key={trackSid}
                                trackIdentifier={trackIdentifier}/>
                        ))
                    } </View>
                )
            } </View>
        )
        }
        <View style={
            styles.optionsContainer
        }>
            <TouchableOpacity style={
                    styles.button
                }
                onPress={_onEndButtonPress}>
                <Text style={
                    styles.buttonText
                }>End</Text>
            </TouchableOpacity>
            <TouchableOpacity style={
                    styles.button
                }
                onPress={_onMuteButtonPress}>
                <Text style={
                    styles.buttonText
                }>
                    {
                    props.isAudioEnabled ? 'Mute' : 'Unmute'
                } </Text>
            </TouchableOpacity>
            <TouchableOpacity style={
                    styles.button
                }
                onPress={_onFlipButtonPress}>
                <Text style={
                    styles.buttonText
                }>Flip</Text>
            </TouchableOpacity>
        </View>

        <TwilioVideo ref={twilioVideo}
            onRoomDidConnect={
                () => {
                    setProps({
                        ...props,
                        status: 'connected'
                    });
                }
            }
            onRoomDidDisconnect={
                () => {
                    setProps({
                        ...props,
                        status: 'disconnected'
                    });
                    navigation.goBack();
                }
            }
            onRoomDidFailToConnect={
                (error) => {
                    Alert.alert('Error', error.error);
                    setProps({
                        ...props,
                        status: 'disconnected'
                    });
                    navigation.goBack();
                }
            }
            onParticipantAddedVideoTrack={
                ({participant, track}) => {
                    if (track.enabled) {
                        setProps({
                            ...props,
                            videoTracks: new Map(
                                [
                                    ...props.videoTracks,
                                    [
                                        track.trackSid, {
                                            participantSid: participant.sid,
                                            videoTrackSid: track.trackSid
                                        },
                                    ],
                                ]
                            )
                        });
                    }
                }
            }
            onParticipantRemovedVideoTrack={
                ({track}) => {
                    const videoTracks = props.videoTracks;
                    videoTracks.delete(track.trackSid);
                    setProps({
                        ...props,
                        videoTracks
                    });
                }
            }/>
    </View>);
};

const styles = StyleSheet.create({
    callWrapper: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    grid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    remoteVideo: {
        flex: 1
    },
    optionsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        width: 60,
        height: 60,
        marginHorizontal: 10,
        borderRadius: 30,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 12,
        color: 'white'
    }
});

export default MeetingVideoScreen;
