import React, { useContext } from 'react';
import { View } from 'react-native';
import { TouchableRipple, Switch, useTheme, Text } from 'react-native-paper';

import { AuthContext } from '../../navigation/AuthProvider';
import { Divider } from '../../styles/FeedStyles';

const Appearance = () => {
    const { toggleTheme} = useContext(AuthContext);
    const paperTheme = useTheme();

    return (
        <View>
            <TouchableRipple onPress={() => toggleTheme()}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:15}}>
                    <Text style={{fontSize:16}}>Theme Sombre</Text>
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