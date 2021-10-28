import React, {useState} from "react";

import {View, Text, StyleSheet, TextInput, TouchableOpacity, Link} from 'react-native';


const Donate = () =>{

    const [suggestion, setSuggestion] = useState("")

    return(
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text>
                    Soutenez nous en nous faisant un don. Ceci aidera l'equipe a botenir le strict necessaire pour le developementr de l'application
                </Text>
                <Text>
                    Grace a votre geste, vous pourrez aider la communaute des bloggeurs et memeurs a se sentir encore plus chez eux ici --parcequ'ils le sont deja ;)
                </Text>
            </View>
            {/* <Link to="http://wa.me/+237669818830">
                <TouchableOpacity>
                    <View>
                        <Text>Envoyer</Text>
                    </View>
                </TouchableOpacity>
            </Link> */}
        </View>
    )
}


export default Donate;

const styles= StyleSheet.create({
    container:{
        flex:1
    },
    textContainer:{
        padding:10,
        flex:1
    }
})