import AsyncStorage from '@react-native-async-storage/async-storage';
import { GET_USERS_BY_IDS, USER_URL, CREATE_MEETING_URL,
    UPDATE_MEETING_URL, GET_ALL_USER_MEETING_URL, GET_TWILIO_TOKEN, GET_ROOM_BY_IDS } from '../../constants/api.url.constants'
import { APIClient, handleErrors } from '../helpers/apiClient';

const client = new APIClient();

export default class MeetingService {

  async createMeeting(data) {
    const response = await client.post(CREATE_MEETING_URL, {
      ...data
    });
    handleErrors(response);
  }

  async updateMeeting(data) {
    const response = await client.post(UPDATE_MEETING_URL, {
      ...data
    });
    handleErrors(response);
  }

  async getAllUserMeetings(id) {
    const response = await client.get(GET_ALL_USER_MEETING_URL + "/" + id);
    handleErrors(response);
    return response.data;
  }

  async getTwilioToken(id) {
    const response = await client.get(GET_TWILIO_TOKEN + "/" + id);
    handleErrors(response);
    return response.data;
  }

  async getUserById(id) {
    console.log("id", id);
    const response = await client.get(USER_URL + "/" + id);
    console.log("response", response);
    handleErrors(response);
    return response;
  }

    async getUsersByIds(ids) {
        const response = await client.post(GET_USERS_BY_IDS, {
            ids
        });
        handleErrors(response);
        return response;
    }

    async getRoomByIds(ids) {
      console.log("responseRoom00", ids);
        const response = await client.post(GET_ROOM_BY_IDS, {
            ids
        });
        console.log("responseRoom", response);
        return response[0];
    }

}