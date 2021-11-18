import React, { useContext } from 'react';
import { View } from 'react-native';
import { TouchableRipple, Switch, useTheme, Text } from 'react-native-paper';

import { AuthContext } from '../../navigation/AuthProvider';

const Appearance = () => {
    const { toggleTheme} = useContext(AuthContext);
    const paperTheme = useTheme();

    return (
        <View>
            <Text>Welcome to the appearance screen !</Text>
            <TouchableRipple onPress={() => toggleTheme()}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                    <Text>Theme Sombre</Text>
                    <View pointerEvents="none">
                        <Switch value={paperTheme.dark}/>
                    </View>
                </View>
            </TouchableRipple>
        </View>
    )
}

export default Appearance;