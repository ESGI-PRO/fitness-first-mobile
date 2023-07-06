import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Checks if user is authenticated
 */
const isUserAuthenticated = async () => {
    const user = getLoggedInUser();
    const tokens = await getTokens();
    if (!user || !tokens) {
        return false;
    }


    const currentTime = Date.now() / 1000;
    const expireDate = new Date(tokens.access.exp);


    if (expireDate.getTime() < currentTime) {
        return false;
    }else {
        return true;
    }
}

/**
 * Sets the logged in user
 */
const setLoggedInUser = async (user) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
}

/**
 * Sets the logged in user
 */
 const setTokens = (tokens) => {
    AsyncStorage.setItem('tokens', JSON.stringify(tokens));
}

/**
 * Returns the logged in user
 */
const getLoggedInUser = async () => {
    const user = await AsyncStorage.getItem('user');
    return user ? (typeof (user) == 'object' ? user : JSON.parse(user)) : null;
}

/**
 * Returns tokens
 */
 const getTokens = async () => {
    const tokens = await AsyncStorage.getItem('tokens');
    return tokens ? (typeof (tokens) == 'object' ? tokens : JSON.parse(tokens)) : null;
}


/**
 * 
 * @returns {boolean} - user is admin or not
 */
const isAdmin = async () => {
    const user = await getLoggedInUser();
    if (user) {
        return user?.role === 'admin';
    }
    return false;
}

export { isUserAuthenticated, setLoggedInUser, getLoggedInUser, getTokens, setTokens,  isAdmin };