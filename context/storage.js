import AsyncStorage from '@react-native-async-storage/async-storage';

const storage = {
  async getItem(key) {
    try {
      const jsondata = await AsyncStorage.getItem(key);
      return JSON.parse(jsondata)
    } catch (e) {
      console.error(e)
      return null
    }
  },
  async setItem(key, data) {
    try {
      const jsondata = await AsyncStorage.getItem(key);
      const state = JSON.parse(jsondata)
      if (state) {
        await AsyncStorage.setItem(key, JSON.stringify({ ...state, ...data }))
      } else {
        await AsyncStorage.setItem(key, JSON.stringify(data))
      }
    } catch (e) {
      console.error(e)
    }
  },
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key)
    } catch (e) {
      console.error(e)
    }
  },
}

export default storage
