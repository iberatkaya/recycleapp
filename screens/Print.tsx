import React, { PureComponent } from 'react';
import { Text, View, Image, StyleSheet, Dimensions } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { ResponseObj } from './Camera';
const { width, height } = Dimensions.get('window');

interface Props {
   navigation: NavigationStackProp
}

export class Print extends PureComponent<Props>{

   static navigationOptions = () => ({
      title: 'Prediction',
   });

   getMaxValInObj = (obj: ResponseObj) => {
      let maxObj = { max: 0, name: '' };
      for (let i in obj) {
         if (obj[i] > maxObj.max) {
            maxObj = { max: obj[i], name: i };
         }
      }
      return maxObj;
   }

   printData = (obj: ResponseObj) => {
      const max = this.getMaxValInObj(obj);
      return (
         <View>
            <View style={styles.predictionview}>
               <Text style={styles.prediction}>Prediction: {max.name} <Text style={{ color: '#888' }}>{(max.max * 100).toFixed(0)}%</Text></Text>
            </View>
            <Image
               style={styles.image}
               source={{ uri: this.props.navigation.getParam("image") }}
            />
            <View style={styles.textview}>
               <Text style={{...styles.text, fontWeight: 'bold'}}>Predictions:</Text>
               <Text style={styles.text}>Cardboard: {(obj.Cardboard * 100).toFixed(0)}%</Text>
               <Text style={styles.text}>Glass: {(obj.Glass * 100).toFixed(0)}%</Text>
               <Text style={styles.text}>Metal: {(obj.Metal * 100).toFixed(0)}%</Text>
               <Text style={styles.text}>Paper: {(obj.Paper * 100).toFixed(0)}%</Text>
               <Text style={styles.text}>Plastic: {(obj.Plastic * 100).toFixed(0)}%</Text>
               <Text style={styles.text}>Trash: {(obj.Trash * 100).toFixed(0)}%</Text>
            </View>
         </View>
      )
   }

   render() {
      return (
         <SafeAreaView>
            <ScrollView>
               {this.printData(this.props.navigation.getParam("obj"))}
            </ScrollView>
         </SafeAreaView>
      )
   }
}

export default Print;


const styles = StyleSheet.create({
   textview: {
      backgroundColor: '#eee',
      paddingHorizontal: 16,
      paddingVertical: 12
   },
   text: {
      fontSize: 18,
      color: '#444',
   },
   predictionview: {
      paddingVertical: 20,
      backgroundColor: '#e7e7e7'
   },
   prediction: {
      fontSize: 24,
      color: 'black',
      textAlign: 'center'
   },
   image: {
      marginVertical: 12,
      width: width * 0.4,
      height: width * 0.4,
      resizeMode: 'stretch',
      alignSelf: 'center'
   }
})