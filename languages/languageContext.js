import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';
import * as RNLocalize from 'react-native-localize';
import en from './text/en';
import fr from './text/fr';

export const LanguageContext = createContext();

const LanguageObject = {
    'en':en,
    'fr':fr
}

export const LanguageProvider = ({children}) => {
    const [selectedLanguage, setSelectedLanguage] = useState('en')

    useEffect(async () => {
        let currentLanguage;
        await AsyncStorage.getItem('currentLanguage').then(value => {
            if (value) {
                currentLanguage = value;
            } else {
                currentLanguage = RNLocalize.findBestAvailableLanguage(
                    Object.keys(LanguageObject)
                );
            }
        })

        setSelectedLanguage(currentLanguage? currentLanguage : 'en')
    }, [])


    
    return (
        <LanguageContext.Provider value={{
            selectedLanguage,
            switchLanguage : (language) => {
                AsyncStorage.setItem('currentLanguage', language);
                setSelectedLanguage(language);
            },
            onboardingScreen: LanguageObject[selectedLanguage].onboardingScreen,
            loginScreen: LanguageObject[selectedLanguage].loginScreen,
            signUpScreen: LanguageObject[selectedLanguage].signUpScreen,
            appTabs: LanguageObject[selectedLanguage].appTabs,
            postScreen : LanguageObject[selectedLanguage].postScreen,
            findScreen:LanguageObject[selectedLanguage].findScreen,
            postViewScreen : LanguageObject[selectedLanguage].postViewScreen,
            commentsScreen:LanguageObject[selectedLanguage].commentsScreen,
            profileScreen: LanguageObject[selectedLanguage].profileScreen,
            editProfileScreen: LanguageObject[selectedLanguage].editProfileScreen,
            preferencesScreen: LanguageObject[selectedLanguage].preferencesScreen,
            aboutScreen: LanguageObject[selectedLanguage].aboutScreen,
            appearanceScreen: LanguageObject[selectedLanguage].appearanceScreen,
            suggestionsScreen: LanguageObject[selectedLanguage].suggestionsScreen,
            authProvider:LanguageObject[selectedLanguage].authProvider,
        }}>
            {children}
        </LanguageContext.Provider>
    )
};