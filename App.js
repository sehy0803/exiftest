import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { handlePermissions } from './permission';
// import RNFS from 'react-native-fs';
import { readAsync } from '@lodev09/react-native-exify';
import { pick } from '@react-native-documents/picker';
// import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentScanner from 'react-native-document-scanner-plugin';

export default function TestScreen() {
  useEffect(() => {
    handlePermissions();
  }, []);

  const readExif = async uri => {
    try {
      const tags = await readAsync(uri);
      console.log('EXIF 데이터:', tags);
    } catch (error) {
      console.error('EXIF 데이터 읽기 오류:', error);
    }
  };

  const onLaunchCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      saveToPhotos: true,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0)
      return;

    const image = result.assets[0];
    console.log('이미지 피커 카메라 결과:', image);
    await readExif(image.uri);
  };

  const onLaunchImageLibrary = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      presentationStyle: 'fullScreen',
    });

    if (result.didCancel || !result.assets || result.assets.length === 0)
      return;

    const image = result.assets[0];
    console.log('이미지 피커 갤러리 결과: ', image);
    await readExif(image.uri);
  };

  const onDocumentPicker = async () => {
    try {
      const [pickResult] = await pick({
        mode: 'import',
        presentationStyle: 'fullScreen',
      });
      console.log('파일 선택기 결과:', pickResult);
      await readExif(pickResult.uri);
    } catch (error) {
      if (error.code === 'OPERATION_CANCELED') {
        return;
      }
      console.error('파일 선택기 오류:', error);
    }
  };

  const onCropPickerCamera = async () => {
    try {
      ImagePicker.openCamera({
        mediaType: 'photo',
        includeExif: true,
        // writeTempFile: false,
        cropping: false,
        compressImageQuality: 1,
      }).then(image => {
        console.log('크롭 피커 카메라 결과:', image);
      });
    } catch (error) {
      console.error('크롭 피커 카메라 오류:', error);
    }
  };

  const onCropPickerPhoto = async () => {
    try {
      ImagePicker.openPicker({
        mediaType: 'photo',
        includeExif: true,
        // writeTempFile: false,
        cropping: false,
        compressImageQuality: 1,
      }).then(image => {
        console.log('크롭 피커 갤러리 결과:', image);
        readExif(image.path);
      });
    } catch (error) {
      console.error('크롭 피커 갤러리 오류:', error);
    }
  };

  const onScanner = async () => {
    const { scannedImages } = await DocumentScanner.scanDocument();
    if (scannedImages.length > 0) {
      console.log('스캔 결과: ', scannedImages);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <Text>Image Picker</Text>
          <TouchableOpacity style={styles.btn} onPress={() => onLaunchCamera()}>
            <Text>카메라</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onLaunchImageLibrary()}
          >
            <Text>갤러리</Text>
          </TouchableOpacity>

          <View style={styles.line} />

          <Text>Crop Picker</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onCropPickerCamera()}
          >
            <Text>카메라</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onCropPickerPhoto()}
          >
            <Text>갤러리</Text>
          </TouchableOpacity>

          <View style={styles.line} />

          <Text>Documents Picker</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onDocumentPicker()}
          >
            <Text>파일 선택기</Text>
          </TouchableOpacity>

          <View style={styles.line} />

          <Text>Scanner Plugin</Text>
          <TouchableOpacity style={styles.btn} onPress={() => onScanner()}>
            <Text>스캐너</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 30,
    gap: 10,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: 'orange',
    elevation: 4,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
});
