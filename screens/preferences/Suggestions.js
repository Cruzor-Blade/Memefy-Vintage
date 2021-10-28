import React, {useState} from "react";

import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';


const Suggestions = () =>{

    const [suggestion, setSuggestion] = useState("")

    return(
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text>
                    Parceque nous savons que notre app n'est pas parfaite, mais que nous souhaitons l'ameliorer.
                </Text>
                <Text>
                    Entrez votre suggestion dans la zone de texte ci dessous.
                </Text>
            </View>
            <View>
                <TextInput
                placeholder="Entrez une suggstion"
                onChangeText = {(text) => setSuggestion(text)}
                />
            </View>

            <TouchableOpacity>
                <View>
                    <Text>Envoyer</Text>
                </View>
            </TouchableOpacity>

            <View>
                <View>
                    <Text>Vous pouvez faire un don pour permettre l'ajout de nouvelles fonctionalites plus rapiement</Text>
                </View>
                <TouchableOpacity><Text>En savoir plus</Text></TouchableOpacity>
            </View>

        </View>
    )
}


export default Suggestions;

const styles= StyleSheet.create({
    container:{
        flex:1
    },
    textContainer:{
        padding:10,
        flex:1
    }
})