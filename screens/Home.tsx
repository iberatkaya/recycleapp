import React, { PureComponent } from 'react';
import { Text, View, ScrollView, StatusBar, TouchableOpacity, PermissionsAndroid, StyleSheet } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons'
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { mainColor } from './globals';
//@ts-ignore
import { AdMobBanner } from 'react-native-admob'
import { adunitid/* , demobanner */ } from './appid';
 

interface Props {
   navigation: NavigationStackProp
}

interface Nav {
   navigation: {openDrawer: Function}
}

export class Home extends PureComponent<Props>{

   static navigationOptions = ({ navigation }: Nav) => ({
      title: 'Home',
      headerLeft: () => (
         <TouchableOpacity
            onPress={() => {
               navigation.openDrawer();
            }}
         >
            <MIcon
               style={{ paddingLeft: 12 }}
               size={32}
               color="white"
               name="menu"
            />
         </TouchableOpacity>
      )
   });

   render() {
      return (
         <SafeAreaView style={{height: '100%'}}>
            <StatusBar backgroundColor="#7cc" />
            <ScrollView>
               <TouchableOpacity
                  style={styles.scanButton}
                  onPress={async () => {
                     const perm = await PermissionsAndroid.request('android.permission.CAMERA');
                     if (perm === 'granted')
                        this.props.navigation.navigate("Camera");
                  }}
               >
                  <Text style={styles.scanText}>Scan</Text>
                  <Icon name="md-camera" size={40} style={{ marginTop: 4 }} color="white" />
               </TouchableOpacity>
               <View style={{ backgroundColor: '#ddd', height: 1, marginBottom: 24 }} />
               <View style={{ marginHorizontal: 12, marginBottom: 12 }}>
                  <Text style={{ color: '#555', fontSize: 18, fontFamily: 'sans-serif-light', }}>{'\t\t\t'}Confused about whether your garbage is recyclable? Now with recycler, you can classify recyclable objects. Press scan to start helping the environment!</Text>
               </View>
            </ScrollView>
            <AdMobBanner 
               style={{position: 'absolute', bottom: 0}}
               adSize="smartBannerPortrait"
               adUnitID={adunitid}
               onAdFailedToLoad={(error: string) => console.error(error)}
            />
         </SafeAreaView>
      )
   }
}

export default Home;

const styles = StyleSheet.create({
   scanButton: {
      marginVertical: 36,
      alignSelf: 'center',
      paddingHorizontal: 48,
      borderRadius: 120,
      alignItems: 'center',
      backgroundColor: mainColor,
      paddingVertical: 36,
   },
   scanText: {
      fontSize: 28,
      color: 'white',
      fontFamily: 'sans-serif-light'
   }
})