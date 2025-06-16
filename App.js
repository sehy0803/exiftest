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
    console.log('react-native-image-picker 카메라 결과:', image);

    const tags = await readAsync(image.uri);
    console.log('exify: ', tags);
  };

  const onLaunchImageLibrary = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeExtra: true,
      useLegacyPicker: false,
    });

    if (result.didCancel || !result.assets || result.assets.length === 0)
      return;

    const image = result.assets[0];
    console.log('react-native-image-picker 갤러리 결과: ', image);

    const tags = await readAsync(image.uri);
    console.log('exify: ', tags);
  };

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
