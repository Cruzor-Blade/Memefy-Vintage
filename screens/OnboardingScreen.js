import React from 'react';
import {View, Text, Button, TouchableOpacity, Image } from 'react-native';

import Onboarding from 'react-native-onboarding-swiper';


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
        SkipButtonComponent={Skip}
        NextButtonComponent={Next}
        DoneButtonComponent={Done}
        DotComponent={Dot}
        onSkip= {() => navigation.navigate("Login")}
        onDone= {() => navigation.navigate("Login")}
        pages={[
            {
                backgroundColor: '#a6e4d0',
                image: <Image source={require('../assets/onboarding-img1.png')}/>,
                title:"Connectez vous avec le monde",
                subtitle:"Un nouveau moyen de rire et de partager des memes"

            },
            {
                backgroundColor: '#fdeb93',
                image: <Image source={require('../assets/onboarding-img2.png')}/>,
                title: 'Exprimez vous...',
                subtitle: 'Partagez vos favoris et reagissez tout autrement aux publixations qui vous marquent',

            },
            {
                backgroundColor: '#e9bcbe',
                image: <Image source={require('../assets/onboarding-img3.png')}/>,
                title: 'Soyez vous meme',
                subtitle: 'Parce que Memebit, c est chez vous !',

            }
        ]}
        />
    )
};

export default OnboardingScreen;

