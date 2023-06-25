import axios from "axios";
import user from "./user";

class Nutrition {
  API_URL = "http://localhost:8000/nutrition/";
  recettes = [];
  MyRecettes = [];
  ingredients = [];
  categories = [];

  constructor() {
    this.getRecettes().then((responses) => {
      this.recettes = responses;
    });

    this.getIngredients().then((responses) => {
      this.ingredients = responses;
    });

    this.getCategories().then((responses) => {
      this.categories = responses;
    });
  }

  async getRecettes() {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + "");
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  async getMyRecettes() {
    console.log(
      "🚀 ~ file: nutrition.js:39 ~ Nutrition ~ getMyRecettes ~ typeof user.userId :",
      user.userId
    );

    if (user.userId === null) resolve(null);
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + user.userId + "/user");
      this.MyRecettes = responses.data.data.nutrition;
      resolve(this.MyRecettes);
    });
  }

  async getIngredients() {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + "ingredients");
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  getIngredientsVarable() {
    return this.ingredients;
  }

  async getCategories() {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + "categories");
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  async getRecettesByID(id) {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + id);
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  async getIngredientsByID(id) {
    console.log("getIngredientsByID", id, typeof id);
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + "ingredients/" + id);
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  async deleteRecettesByID(id) {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.delete(this.API_URL + id);
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  async create(data) {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.post(this.API_URL, data);
      var results = responses.data.data.nutrition;
      resolve(results);
    });
  }
}

const nutrition = new Nutrition();

export default nutrition;
