import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native"; 
import { Themes } from "../colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme(); 
    const [theme, setTheme] = useState(Themes.light);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme && Themes[savedTheme]) {
                    setTheme(Themes[savedTheme]);
                } else {
                    setTheme(systemColorScheme === 'dark' ? Themes.dark : Themes.light);
                }
            } catch (error) {
                console.error('Failed to load theme from AsyncStorage:', error);
            }
        };

        loadTheme();
    }, [systemColorScheme]); 

    const changeTheme = async (themeName) => {
        try {
            const selectedTheme = Themes[themeName] || Themes.light;
            setTheme(selectedTheme);
            await AsyncStorage.setItem('theme', themeName);
        } catch (error) {
            console.error('Failed to save theme to AsyncStorage:', error);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
