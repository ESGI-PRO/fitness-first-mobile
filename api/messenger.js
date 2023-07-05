import axios from "axios";
import user from "./user";

class Messenger {
  API_URL = "http://localhost:8000/messenger";
  rooms = [];
  userId = user.userId;
  constructor() {
    this.getRooms().then((res) => {
      this.rooms = res;
    });
  }

  async getRooms(userId) {
    console.log(this.API_URL + "/get-all-rooms/" + userId);
    const response = await axios.get(
      this.API_URL + "/get-all-rooms/" + userId
    );
    console.log(response.data.data.rooms);
    return response.data.data.rooms;
  }

  async getMessages(roomId) {
    return new Promise(async (resolve, reject) => {
      console.log(this.API_URL + "/get-room-messages/" + roomId);
      const response = await axios.get(
        this.API_URL + "/get-room-messages/" + roomId
      );
      console.log(response.data.data.messages);

      var p = response.data.data.messages;
      resolve(p);
    });
  }

  async createMessage(data) {
    return new Promise(async (resolve, reject) => {
      console.log(this.API_URL + "/create_message");
      const response = await axios.post(
        this.API_URL + "/create_message" , data
      );
      console.log(response.data.data.message);

      var p = response.data.data.message;
      resolve(p);
    });
  }
}

const messengerAPI = new Messenger();

export default messengerAPI;