import axios from "axios";
import { getLoggedInUser } from "../services/helpers/authUtils";

class User {
  API_URL = "http://localhost:8000/users/";
  userId;
  data;
  users;

  constructor() {
    this.init();
  }

  async init() {
    console.log("get user");
    this.data = await getLoggedInUser();

    this.userId = this.data?.id;

    this.getUsers().then((res) => {
      this.users = res;
    });
  }

  async gerUserId() {
    const res = await getLoggedInUser();
    this.userId = res.id;
  }

  async getUsers() {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL);
      var data = responses.data
      resolve(data);
    });
  }
}

const user = new User();

export default user;
