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

    useEffect(() => {
        const currentLanguage = RNLocalize.findBestAvailableLanguage(
            Object.keys(LanguageObject)
        );

        setSelectedLanguage(currentLanguage?.languageTag || 'en')
    }, [])


    
    return (
        <LanguageContext.Provider value={{
            setSelectedLanguage,
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
        }}>
            {children}
        </LanguageContext.Provider>
    )
};