import * as ImageManipulator from "expo-image-manipulator";

const compressImageHook = () => {
  const compressImage = async (base64: string): Promise<string | null> => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        `data:image/png;base64,${base64}`,
        [{ resize: { width: 800 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      return manipulatedImage.base64
        ? `data:image/jpeg;base64,${manipulatedImage.base64}`
        : null;
    } catch (error) {
      console.error("Error compressing image:", error);
      return null;
    }
  };
  return { compressImage };
};

export default compressImageHook;
