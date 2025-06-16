import { Platform, PermissionsAndroid } from 'react-native';
import {
  PERMISSIONS,
  check,
  request,
  RESULTS,
} from 'react-native-permissions';

// Android 권한 확인
const checkAndroidPermissions = async () => {
  const cameraGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  const mediaGranted = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  );
  return cameraGranted && mediaGranted;
};

// ✅ Android 권한 요청
const requestAndroidPermissions = async () => {
  const result = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
  ]);

  const cameraResult = result[PermissionsAndroid.PERMISSIONS.CAMERA];
  const mediaResult = result[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES];

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
};

// iOS 권한 요청
const requestIOSPermissions = async () => {
  const camera = await request(PERMISSIONS.IOS.CAMERA);
  const photo = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

  if (camera === RESULTS.GRANTED && photo === RESULTS.GRANTED) {
    return 'granted';
  } else if (
    camera === RESULTS.BLOCKED ||
    photo === RESULTS.BLOCKED
  ) {
    return 'never_ask_again';
  } else {
    return 'denied';
  }
};

// 전체 권한 체크 함수
export const handlePermissions = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await checkAndroidPermissions();
      if (!granted) {
        const result = await requestAndroidPermissions();
        console.log('Android 권한 요청 결과:', result);
      }
    } else {
      const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
      const photoStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

      if (
        cameraStatus !== RESULTS.GRANTED ||
        photoStatus !== RESULTS.GRANTED
      ) {
        const result = await requestIOSPermissions();
        console.log('iOS 권한 요청 결과:', result);
      }
    }
  } catch (e) {
    console.error('❌ 권한 처리 오류:', e);
  }
};
