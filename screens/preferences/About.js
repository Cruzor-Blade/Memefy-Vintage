import React from "react";

import {View, Text, StyleSheet} from 'react-native';


const About = () =>{
    return (
        <View style={styles.container}>
            <View>
                <Text>
                    Nous sommes un groupe de developpeurs :)
                </Text>
            </View>
            <View>
                <Text>
                        Nous concevons pour vous des sites web, applications web et mobiles.
                </Text>
            </View>
            <View>
                    <Text>
                        Nous aimons ce que nous faisons, et c'est pourquoi nous le faisons encore mieux. Faites nous confiance, pour toujours etre satisfait
                    </Text>
            </View>
        </View>
    )
}



export default About;


const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        padding:10
    }
});