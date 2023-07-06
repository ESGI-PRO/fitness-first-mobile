import axios from "axios";
import user from "./user";
import { API_URL } from "@env";
import { getHeaders } from "../services/helpers/apiClient";

class Nutrition {
  API_URL = API_URL + "nutrition/";
  recettes;
  MyRecettes;
  ingredients;
  categories;

  constructor() {
    console.log(this.API_URL);
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
      const responses = await axios.get(this.API_URL, {
        headers: await getHeaders(),
      });
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
      const responses = await axios.get(this.API_URL + user.userId + "/user", {
        headers: await getHeaders(),
      });
      this.MyRecettes = responses.data.data.nutrition;
      resolve(this.MyRecettes);
    });
  }

  async getIngredients() {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + "ingredients", {
        headers: await getHeaders(),
      });
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  getIngredientsVarable() {
    return this.ingredients;
  }

  async getCategories() {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + "categories", {
        headers: await getHeaders(),
      });
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  async getRecettesByID(id) {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + id, {
        headers: await getHeaders(),
      });
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  async getIngredientsByID(id) {
    console.log("getIngredientsByID", id, typeof id);
    return new Promise(async (resolve, reject) => {
      const responses = await axios.get(this.API_URL + "ingredients/" + id, {
        headers: await getHeaders(),
      });
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  async deleteRecettesByID(id) {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.delete(this.API_URL + id, {
        headers: await getHeaders(),
      });
      var data = responses.data.data.nutrition;
      resolve(data);
    });
  }

  async create(data) {
    return new Promise(async (resolve, reject) => {
      const responses = await axios.post(this.API_URL, data, {
        headers: await getHeaders(),
      });
      var results = responses.data.data.nutrition;
      resolve(results);
    });
  }
}

const nutrition = new Nutrition();

export default nutrition;
