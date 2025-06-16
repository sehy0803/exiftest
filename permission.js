import { PermissionsAndroid } from 'react-native';

export const checkPermissions = async () => {
  try {
    const cameraGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    const mediaGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );

    const allGranted = cameraGranted && mediaGranted;
    return allGranted;
  } catch (error) {
    console.error('❌ [checkPermissions] 오류:', error.message);
    return false;
  }
};

export const requestPermissions = async () => {
  try {
    const result = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    ]);

    const cameraResult = result[PermissionsAndroid.PERMISSIONS.CAMERA];
    const mediaResult =
      result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES];

    if (
      cameraResult === PermissionsAndroid.RESULTS.GRANTED &&
      mediaResult === PermissionsAndroid.RESULTS.GRANTED
    ) {
      return 'granted';
    } else if (
      cameraResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
      mediaResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
    ) {
      return 'never_ask_again';
    } else {
      return 'denied';
    }
  } catch (error) {
    console.error('❌ [requestPermissions] 오류:', error.message);
  }
};

export const handlePermissions = async () => {
  try {
    const granted = await checkPermissions();
    if (!granted) {
      const result = await requestPermissions();
      console.log('권한 요청 결과: ', result);
    }
  } catch (error) {
    console.error('❌ [handlePermissions] 오류:', error.message);
  }
};
