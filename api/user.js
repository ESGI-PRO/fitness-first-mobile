import axios from "axios";
import { getLoggedInUser } from "../services/helpers/authUtils";
import {API_URL} from '@env'

class User {
  API_URL = API_URL + "users/";
  userId;
  data;
  users;
  trainers;
  constructor() {
    this.init();
  }

  async init() {
    console.log("get user");
    this.data = await getLoggedInUser();

    this.userId = this.data?.id;

    this.getUserId()

    this.getUsers().then((res) => {
      this.users = res;
    });

    this.getTrainers().then((res) => {
      this.trainers = res;
    });
  }

  async getUserId() {
    const res = await getLoggedInUser();
    this.userId = res.id;
  }

  async getUsers() {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL);
      var data = responses.data;
      resolve(data);
    });
  }

  async getTrainers() {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL);
      var data = responses.data;

      const list = data
        .map((user) => {
          if (user.isTrainer === true) {
            return {
              id: user.id,
              trainerImage: require("../assets/images/category/category1.png"),
              trainerName: user.userName,
              trainerSpeciality: user.trainerSpeciality,
              ...user,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item !== null);

      resolve(list);
    });
  }

  logout() {
    user.userId = null;
    user.data = null;

    console.log('logged out DOOOONE ')
  }
}

const user = new User();

export default user;
