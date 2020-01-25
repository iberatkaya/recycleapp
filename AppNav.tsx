import React, { Component } from 'react';
import { Text, View, ScrollView, Linking, ToastAndroid, TouchableOpacity, Dimensions, Image, PermissionsAndroid, StyleSheet } from 'react-native';
import { createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Home from './screens/Home';
import Camera from './screens/Camera';
import Print from './screens/Print';
import { mainColor } from './screens/globals';

const {width, height} = Dimensions.get('window');


const stack = createStackNavigator({
   Home: Home,
   Camera: Camera,
   Print: Print
}, {
   defaultNavigationOptions: {
      headerStyle: {
         backgroundColor: mainColor,
         elevation: 2
      },
      headerTintColor: 'white',
   }
});

const drawer = createDrawerNavigator({
   Home: {
      screen: stack
   }
},
   {
      drawerWidth: width * 0.8,
      contentComponent: () => <Drawer />
   }
);

class Drawer extends Component {
   render() {
      return (
         <ScrollView>
            <Image
               source={require('./assets/header.png')}
               style={{ width: width * 0.8, height: height * 0.23, resizeMode: 'stretch' }}
            />
            <View>
               <TouchableOpacity
                  style={{ paddingLeft: 16, paddingVertical: 14.5 }}
                  onPress={() => { Linking.openURL("https://play.google.com/store/apps/details?id=com.kaya.recycler"); }}
               >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <Icon name="star" size={24} color="#888888" />
                     <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>Rate App</Text>
                  </View>
               </TouchableOpacity>
               <TouchableOpacity
                  style={{ paddingLeft: 16, paddingVertical: 14.5 }}
                  onPress={() => { Linking.openURL("https://play.google.com/store/apps/developer?id=IBK+Apps"); }}
               >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <Icon name="google-play" size={24} color="#888" />
                     <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>View Other Apps</Text>
                  </View>
               </TouchableOpacity>
               <TouchableOpacity
                  style={{ paddingLeft: 16, paddingVertical: 14.5 }}
                  onPress={() => { Linking.openURL("mailto:ibraberatkaya@gmail.com?subject=Recycler Feedback"); }}
               >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     <Icon name="email" size={24} color="#888888" />
                     <Text style={{ fontSize: 14, fontWeight: 'bold', paddingLeft: 32, color: 'black' }}>Feedback</Text>
                  </View>
               </TouchableOpacity>
            </View>
         </ScrollView>
      )
   }
}


export default createAppContainer(drawer);