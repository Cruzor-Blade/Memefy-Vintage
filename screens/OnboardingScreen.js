import React, { useContext } from 'react';
import {View, Text, TouchableOpacity, Image } from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';
import { windowWidth } from '../utils/Dimentions';
import { LanguageContext } from '../languages/languageContext';





const OnboardingScreen = ({navigation}) => {
    const {onboardingScreen} = useContext(LanguageContext);

    const Skip = ({...props}) =>{
        return(
            <TouchableOpacity
                style={{marginHorizontal:10}}
                {...props}
            >
                <Text style={{fontSize:16}}>{onboardingScreen.skipLabel}</Text>
            </TouchableOpacity>
        )
    }    

    const Next = ({...props}) =>{
        return(
            <TouchableOpacity
                style={{marginHorizontal:10}}
                {...props}
            >
                <Text style={{fontSize:16}}>{onboardingScreen.nextLabel}</Text>
            </TouchableOpacity>
        )
    }

    const Done = ({...props}) =>{
        return(
            <TouchableOpacity
                style={{marginHorizontal:10}}
                {...props}
            >
                <Text style={{fontSize:16}}>{onboardingScreen.doneLabel}</Text>
            </TouchableOpacity>
        )
    }
    
    const Dot = ({selected}) =>{
        let backgroundColor= selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)' ;
        return(
            <View
                style={{width:5, height:5, marginHorizontal:3, backgroundColor}}
            />
        )
    }



    return(
        <Onboarding
            allowFontScaling={false}
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}
            DotComponent={Dot}
            onSkip= {() => navigation.navigate("Login")}
            onDone= {() => navigation.navigate("Login")}
            pages={[
                {
                    backgroundColor: '#a6e4d0',
                    image: <Image source={require('../assets/onboarding/onboarding-1.png')} style={{height:200, width:200}} />,
                    title:onboardingScreen.onboarding_1_Title,
                    subtitle:onboardingScreen.onboarding_1_Subtitle

                },
                {
                    backgroundColor: '#fdeb93',
                    image: <Image source={require('../assets/onboarding/onboarding-2.png')} style={{width:windowWidth, height:windowWidth/1.2853, resizeMode:'contain'}}/>,
                    title: onboardingScreen.onboarding_2_Title,
                    subtitle: onboardingScreen.onboarding_2_Subtitle,

                },
                {
                    backgroundColor: '#e9bcbe',
                    image: <Image source={require('../assets/onboarding/onboarding-3.png')} style={{width:windowWidth*0.95, height:windowWidth/2.17, resizeMode:'contain'}}/>,
                    title: onboardingScreen.onboarding_3_Title,
                    subtitle: onboardingScreen.onboarding_3_Subtitle,

                }
            ]}
        />
    )
};

export default OnboardingScreen;

