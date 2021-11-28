import React from 'react';
import {View, Text, TouchableOpacity, Image } from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';
import { windowWidth } from '../utils/Dimentions';


const Skip = ({...props}) =>{
    return(
        <TouchableOpacity
            style={{marginHorizontal:10}}
            {...props}
        >
            <Text style={{fontSize:16}}>Passer</Text>
        </TouchableOpacity>
    )
}

const Next = ({...props}) =>{
    return(
        <TouchableOpacity
            style={{marginHorizontal:10}}
            {...props}
        >
            <Text style={{fontSize:16}}>Suivant</Text>
        </TouchableOpacity>
    )
}

const Done = ({...props}) =>{
    return(
        <TouchableOpacity
            style={{marginHorizontal:10}}
            {...props}
        >
            <Text style={{fontSize:16}}>TERMINE</Text>
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

const OnboardingScreen = ({navigation}) => {
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
                    image: <Image source={require('../assets/onboarding/onboarding-1.png')}/>,
                    title:"Bienvenue sur MemeBit",
                    subtitle:"L'application pour rire et partager des memes"

                },
                {
                    backgroundColor: '#fdeb93',
                    image: <Image source={require('../assets/onboarding/onboarding-2.png')} style={{width:windowWidth, height:windowWidth/1.2853, resizeMode:'contain'}}/>,
                    title: "Gardez le sourire...",
                    subtitle: "Riez et echangez sur des blagues tres drôles pour votre sourire quotidien",

                },
                {
                    backgroundColor: '#e9bcbe',
                    image: <Image source={require('../assets/onboarding/onboarding-3.png')} style={{width:windowWidth*0.95, height:windowWidth/2.17, resizeMode:'contain'}}/>,
                    title: "Soyez vous meme",
                    subtitle: "Parce que MemeBit, c'est comme chez vous !",

                }
            ]}
        />
    )
};

export default OnboardingScreen;

