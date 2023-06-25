import axios from "axios";
import { getLoggedInUser } from "../services/helpers/authUtils";

class User {
  userId;
  data;

  constructor() {
    this.init();
  }

  async init() {
    console.log("get user");
    this.data = await getLoggedInUser();

    this.userId = this.data?.id;
  }

  async gerUserId() {
    const res = await getLoggedInUser();
    this.userId = res.id;
  }
}

const user = new User();

export default user;
