// src/utils/image.ts
import * as ImageManipulator from 'expo-image-manipulator';

export const compressImage = async (
  uri: string,
  maxWidth = 400,
  maxHeight = 400,
  quality = 0.6
): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth, height: maxHeight } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );
  return `data:image/jpeg;base64,${result.base64}`;
};