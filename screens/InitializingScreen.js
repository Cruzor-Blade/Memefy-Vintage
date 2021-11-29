import React, { useEffect, useRef } from 'react';
import { Image, View, StyleSheet, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';

const InitializingScreen = () => {
    const currentTheme = useTheme();
    const moveTime = 1000;
    const bar1Scale = useRef(new Animated.Value(0)).current;
    const bar2Scale = useRef(new Animated.Value(0)).current;
    const bar3Scale = useRef(new Animated.Value(0)).current;
    const bar4Scale = useRef(new Animated.Value(0)).current;
    const bar5Scale = useRef(new Animated.Value(0)).current;
    const bar6Scale = useRef(new Animated.Value(0)).current;
    const bar7Scale = useRef(new Animated.Value(0)).current;
    const bar8Scale = useRef(new Animated.Value(0)).current;

    const barList = [bar1Scale, bar2Scale, bar3Scale, bar4Scale, bar5Scale, bar6Scale, bar7Scale, bar8Scale]

    function animateBar(barScale, number) {
        Animated.timing(barScale, {
            toValue:1.7,
            duration:moveTime/3,
            useNativeDriver:true,
            delay: number*(moveTime/7)
        }).start();
        setTimeout(() => { 
            Animated.timing(barScale, {
                toValue:1,
                duration:moveTime/3,
                useNativeDriver:true,
                delay: number*(moveTime/7)
            }).start();
        }, moveTime*1.2)
    }
    
    useEffect (() => {
        barList.map(barscale => barscale.setValue(1));
        barList.map(barscale => animateBar(barscale, barList.indexOf(barscale)))
    })
    setInterval(() => {
        barList.map(barscale => animateBar(barscale, barList.indexOf(barscale)));
    }, 2.4*moveTime+moveTime/7)
    
    return (
        <View style={{alignItems:'center', justifyContent:'center', flex:1, flexDirection:'column', backgroundColor: currentTheme.dark ? "#444" :"dadcdc"}}>
            <Image  
                style={styles.logo}
                source={require("../assets/onboarding/onboarding-1.png")}
                style={styles.logo}
                />
            <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row'}}>
                <Animated.Image
                    source={require("../assets/onboarding/loadingBar.png")}
                    style={[styles.barStyle, {transform : [{scaleY:bar1Scale}]}]}
                    />
                <Animated.Image
                    source={require("../assets/onboarding/loadingBar.png")}
                    style={[styles.barStyle, {transform : [{scaleY:bar2Scale}]}]}
                />
                <Animated.Image
                    source={require("../assets/onboarding/loadingBar.png")}
                    style={[styles.barStyle, {transform : [{scaleY:bar3Scale}]}]}
                />
                <Animated.Image
                    source={require("../assets/onboarding/loadingBar.png")}
                    style={[styles.barStyle, {transform : [{scaleY:bar4Scale}]}]}
                />
                <Animated.Image
                    source={require("../assets/onboarding/loadingBar.png")}
                    style={[styles.barStyle, {transform : [{scaleY:bar5Scale}]}]}
                />
                <Animated.Image
                    source={require("../assets/onboarding/loadingBar.png")}
                    style={[styles.barStyle, {transform : [{scaleY:bar6Scale}]}]}
                    />
                <Animated.Image
                    source={require("../assets/onboarding/loadingBar.png")}
                    style={[styles.barStyle, {transform : [{scaleY:bar7Scale}]}]}
                    />
                <Animated.Image
                    source={require("../assets/onboarding/loadingBar.png")}
                    style={[styles.barStyle, {transform : [{scaleY:bar8Scale}]}]}
                    />
            </View>
        </View>
        )
}

export default InitializingScreen;

const styles = StyleSheet.create({
    barStyle : {
        height:12,
        width:4.17,
        resizeMode:'stretch',
        marginHorizontal:1.5
    },
    logo: {
      height: 80,
      width: 80,
      resizeMode: 'cover',
      marginBottom:30,
      marginVertical:'auto',
    },
})