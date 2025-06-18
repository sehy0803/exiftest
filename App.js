import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { handlePermissions } from './permission';
// import RNFS from 'react-native-fs';
import { readAsync } from '@lodev09/react-native-exify';
import { pick } from '@react-native-documents/picker';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
// import Geolocation from 'react-native-geolocation-service';
import ImagePicker from "react-native-image-crop-picker";

export default function TestScreen() {
  const [showVisionCamera, setShowVisionCamera] = useState(false);
  const device = useCameraDevice('back');
  const camera = useRef(null);

  useEffect(() => {
    handlePermissions();
  }, []);

  const onVisionCamera = async () => {
    try {
      const photo = await camera.current?.takePhoto();
      if (photo?.path) {
        const fullPath = `file://${photo.path}`;
        console.log('📷 촬영된 사진 경로:', fullPath);
        await readExif(fullPath);
      } else {
        console.log('❌ 사진 경로 없음');
      }
    } catch (err) {
      console.error('📸 촬영 실패:', err);
    } finally {
      setShowVisionCamera(false);
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
    console.log('image-picker 카메라 결과:', image);
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
    console.log('image-picker 갤러리 결과: ', image);
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
    } catch (err) {
      if (err.code === 'OPERATION_CANCELED') {
        return;
      }
      console.error('파일 선택 오류:', err);
    }
  };

  const readExif = async uri => {
    try {
      const tags = await readAsync(uri);
      console.log('EXIF 데이터:', tags);
    } catch (error) {
      console.error('EXIF 데이터 읽기 오류:', error);
    }
  };

  const onCropPickerCamera = async () => {
    try {
      ImagePicker.openCamera({
        mediaType: 'photo',
        includeExif: true,
      }).then((image) => {
        console.log('react-native-image-crop-picker 카메라 결과:', image);
      });
    } catch (error) {
      console.error('react-native-image-crop-picker 카메라 오류:', error);
    }
  };

  const onCropPickerPhoto = async () => {
    try {
      ImagePicker.openPicker({
        mediaType: 'photo',
        includeExif: true,
      }).then((image) => {
          console.log('react-native-image-crop-picker 갤러리 결과:', image);
      });
    } catch (error) {
      console.error('react-native-image-crop-picker 갤러리 오류:', error);
    }
  };

  if (showVisionCamera && device != null) {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          device={device}
          photo={true}
          isActive={true}
          ref={camera}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 40,
            alignSelf: 'center',
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 8,
          }}
          onPress={onVisionCamera}
        >
          <Text>촬영</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            right: 20,
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 8,
          }}
          onPress={() => setShowVisionCamera(false)}
        >
          <Text>닫기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <Text>react-native-image-picker</Text>
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

          <Text>react-native-image-crop-picker</Text>
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
          
          <Text>react-native-documents-picker</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onDocumentPicker()}
          >
            <Text>파일 선택기</Text>
          </TouchableOpacity>
          
          <View style={styles.line} />

          <Text>vision camera</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setShowVisionCamera(true)}
          >
            <Text>카메라</Text>
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
  }
});
