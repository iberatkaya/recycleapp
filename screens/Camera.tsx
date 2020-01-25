import React, { Component, createRef } from 'react'
import { Text, View, ToastAndroid, TouchableOpacity, ActivityIndicator, PermissionsAndroid, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { NavigationStackProp } from 'react-navigation-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import * as tf from '@tensorflow/tfjs';
import base64Array from 'base64-arraybuffer';
import { decodeJpeg } from '../decode_image';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { mainColor } from './globals';
import ImagePicker from 'react-native-image-picker';

interface Props {
   navigation: NavigationStackProp
}

interface LooseObj {
   [key: string]: number
}

export interface ResponseObj extends LooseObj {
   Cardboard: number,
   Glass: number,
   Metal: number,
   Paper: number,
   Plastic: number,
   Trash: number
}

interface State {
   flashColor: typeof mainColor | "#99FFFF",
   flashMode: typeof RNCamera.Constants.FlashMode.off | typeof RNCamera.Constants.FlashMode.on,
   buttonclickable: boolean
}

export class Camera extends Component<Props, State> {

   constructor(props: Props) {
      super(props);
      this.state = {
         flashColor: mainColor,
         flashMode: RNCamera.Constants.FlashMode.off,
         buttonclickable: false
      };
   }

   camera = createRef<RNCamera>();

   async componentDidMount() {
      await tf.ready();
      this.setState({ buttonclickable: true });
   }


   predict = async (base64: string) => {
      const modelJson = require('../model.json');
      const modelWeights = require('../weights.bin');
      const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      const rawImageData = base64Array.decode(base64);
      let imageTensor = decodeJpeg(rawImageData);
      let resized = tf.image.resizeBilinear(imageTensor, [100, 100]);
      const tensorstack = tf.stack([resized]);
      const pred = model.predict(tensorstack) as tf.Tensor3D;
      const data = await pred.data();
      imageTensor.dispose();
      resized.dispose();
      model.dispose()
      tensorstack.dispose();
      pred.dispose();
      return { Cardboard: parseFloat(data[0].toFixed(2)), Glass: parseFloat(data[1].toFixed(2)), Metal: parseFloat(data[2].toFixed(2)), Paper: parseFloat(data[3].toFixed(2)), Plastic: parseFloat(data[4].toFixed(2)), Trash: parseFloat(data[5].toFixed(2)) } as ResponseObj;
   }

   render() {
      return (
         <RNCamera
            style={{ flex: 1 }}
            captureAudio={false}
            flashMode={this.state.flashMode}
            ref={this.camera}
         >
            {this.state.buttonclickable ?
               <View></View>
               :
               <View style={styles.loading}>
                  <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10, color: 'white' }}>Scanning</Text>
                  <ActivityIndicator
                     size={46}
                     color="white"
                  />
               </View>
            }
            <TouchableOpacity
               style={styles.flash}
               disabled={!this.state.buttonclickable}
               onPress={() => {
                  if (this.state.flashMode == RNCamera.Constants.FlashMode.off)
                     this.setState({ flashMode: RNCamera.Constants.FlashMode.torch, flashColor: "#99FFFF" });
                  else if (this.state.flashMode == RNCamera.Constants.FlashMode.torch)
                     this.setState({ flashMode: RNCamera.Constants.FlashMode.off, flashColor: mainColor });
               }}
            >
               <Icon name="md-flash" size={36} color={this.state.flashColor} />
            </TouchableOpacity>
            <TouchableOpacity
               style={styles.gallery}
               disabled={!this.state.buttonclickable}
               onPress={async () => {
                  this.setState({ flashMode: RNCamera.Constants.FlashMode.off, flashColor: mainColor, buttonclickable: false }, async () => {
                     const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
                     if (res == 'granted') {
                        ImagePicker.launchImageLibrary({ noData: false, maxWidth: 200 }, async (data) => {
                           console.log(data);
                           if (data.didCancel)
                              this.setState({ flashMode: RNCamera.Constants.FlashMode.off, buttonclickable: true });
                           else {
                              const res = await this.predict(data.data);
                              this.setState({ buttonclickable: true }, () => this.props.navigation.navigate("Print", { obj: res, image: data.uri }));
                           }
                        });
                     }
                     else {
                        ToastAndroid.show("Permission was denied.", ToastAndroid.LONG);
                     }
                  });
               }}
            >
               <Icon name="md-photos" size={36} color={mainColor} />
            </TouchableOpacity>
            <TouchableOpacity
               style={styles.scan}
               disabled={!this.state.buttonclickable}
               onPress={async () => {
                  this.setState({ buttonclickable: false }, async () => {
                     const data = await this.camera.current!.takePictureAsync({ base64: true, width: 200 });
                     const res = await this.predict(data.base64!);
                     this.setState({ buttonclickable: true }, () => this.props.navigation.navigate("Print", { obj: res, image: data.uri }));
                  });
               }} >
               <Text style={{ fontSize: 20, color: 'white' }}>Scan</Text>
            </TouchableOpacity>
         </RNCamera>
      )
   }
}

export default Camera;


const styles = StyleSheet.create({
   scan: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: '4.5%',
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: mainColor,
      borderColor: 'white',
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 16
   },
   gallery: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: "5%",
      right: "6%",
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: 'white',
      borderRadius: 16
   },
   flash: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: "5%",
      left: "6%",
      flexDirection: 'row',
      justifyContent: 'center',
      backgroundColor: "#ffffff",
      paddingHorizontal: 18,
      paddingVertical: 6,
      borderRadius: 16
   },
   loading: {
      backgroundColor: mainColor,
      padding: 20,
      borderRadius: 32,
      position: 'absolute',
      top: '30%',
      alignSelf: 'center'
   }
})