import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { handlePermissions } from './permission';
// import RNFS from 'react-native-fs';
// import exifReader from 'exif-reader';
// import { decode as atob } from 'base-64';
// import { readExif } from 'react-native-exif-reader';
// import { Buffer } from 'buffer';
import { readAsync } from '@lodev09/react-native-exify';
import { pick } from '@react-native-documents/picker'
// import { read } from 'react-native-fs';

export default function TestScreen() {
  useEffect(() => {
    handlePermissions();
  }, []);

  const onLaunchCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      includeExtra: true,
      saveToPhotos: true, // 촬영 후 갤러리에 저장 (선택)
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
      includeExtra: true,
      selectionLimit: 1,
      useLegacyPicker: false,
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
          const [pickResult] = await pick({mode:'import', presentationStyle: 'fullScreen'})
          console.log('파일 선택기 결과:', pickResult);
          await readExif(pickResult.uri);
        } catch (err) {
          if (err.code === 'OPERATION_CANCELED') {
            return;
          }
          console.error('파일 선택 오류:', err);
        }
  };

  const readExif = async (uri) => {
    try {
      const tags = await readAsync(uri);
      console.log('EXIF 데이터:', tags);
    } catch (error) {
      console.error('EXIF 데이터 읽기 오류:', error);
    }
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

          <Text>react-native-documents-picker</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => onDocumentPicker()}
          >
            <Text>파일 선택기</Text>
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
});
