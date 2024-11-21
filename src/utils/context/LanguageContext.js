import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {

    const { t:translate, i18n: i18nInstance } = useTranslation();
    const [language, setLanguage] = useState(i18nInstance.language);

    const changeLanguage = async (newLang) => {
        try {
            await i18nInstance.changeLanguage(newLang);
            setLanguage(newLang);
            await AsyncStorage.setItem('language', newLang);
        } catch (error) {
            console.error('Error changing language:', error);
        }
    };

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('language');
                if (savedLanguage) {
                    i18nInstance.changeLanguage(savedLanguage);
                    setLanguage(savedLanguage);
                }
            } catch (error) {
                console.error('Error loading language:', error);
            }
        };

        loadLanguage();
    }, [i18nInstance]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, translate }}>
            {children}
        </LanguageContext.Provider>
    );
}; 

export const useLanguage = () => useContext(LanguageContext);