import React, { useContext } from 'react';
import { View } from 'react-native';
import { TouchableRipple, Switch, useTheme, Text } from 'react-native-paper';

import { ActionsContext } from '../../userContext/Actions';
import { Divider } from '../../styles/FeedStyles';
import { LanguageContext } from '../../languages/languageContext';

const Appearance = () => {
    const { toggleTheme } = useContext(ActionsContext);
    const {appearanceScreen} = useContext(LanguageContext);
    console.log(appearanceScreen)
    const paperTheme = useTheme();

    return (
        <View>
            <TouchableRipple onPress={() => toggleTheme()}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:15}}>
                    <Text style={{fontSize:16}}>{appearanceScreen.darkThemeRipple}</Text>
                    <View pointerEvents="none">
                        <Switch value={paperTheme.dark}/>
                    </View>
                </View>
            </TouchableRipple>
            <Divider style={{marginTop:0}} />
        </View>
    )
}

export default Appearance;