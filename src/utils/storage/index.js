import AsyncStorage from "@react-native-async-storage/async-storage";

export const SetAuthToken = async (token, user) => {
    try {
        const tokenString = JSON.stringify(token);
        await AsyncStorage.setItem('authToken', tokenString);
        await AsyncStorage.setItem('authUser', JSON.stringify(user));
    }
    catch (err) {
        console.log(err);
    }
};


export const GetUserData = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken')
        const user = await AsyncStorage.getItem('authUser')
        return {
            token: token,
            user: user != null ? JSON.parse(user) : null
        }
    }
    catch (err) {
        console.log(err)
    }
}


export const RemoveAuthUser = async () => {
    try {
        await AsyncStorage.removeItem('authToken')
        await AsyncStorage.removeItem('authUser')
    }
    catch (err) {
        console.log(err) 
    }
}
