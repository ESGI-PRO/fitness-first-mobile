import AsyncStorage from '@react-native-async-storage/async-storage';
import { LOGIN_URL, REGISTER_URL } from '../../constants/api.url.constants'
import { APIClient, handleErrors } from '../helpers/apiClient';

const client = new APIClient();

export default class AuthService {

  async login(data) {
    const { email, password } = data;
    const response = await client
      .post(LOGIN_URL, { email, password });
    handleErrors(response);
    return response.data;
  }

  async logout() {
    await client.post(LOGOUT_URL);
    AsyncStorage.removeItem("user");
    AsyncStorage.removeItem("tokens");
  }

  async register(data) {
    const { email, password, userName, mobileNumber, isTrainer, trainerSpeciality } = data;
    const newUser = {
        email,
        password,
        userName,
        mobileNumber,
        isTrainer,
        trainerSpeciality,
        trainerId: "",
        traineeIds: [],
        is_confirmed: false
    }

    const response = await client.post(REGISTER_URL, {
      ...newUser
    });
    handleErrors(response);
  }
}