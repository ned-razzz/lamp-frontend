import exifr from "exifr";

export const extractDateFromImage = async (imageFile: File): Promise<Date | undefined> => {
  try {
    // 유효한 이미지 파일인지 확인
    if (!imageFile || !imageFile.type.startsWith("image/")) {
      throw new Error("not valid image");
    }

    // EXIF 데이터 파싱
    const exifData = await exifr.parse(imageFile);

    //  날짜 필드 확인 (우선순위 순)
    const dateString =
      exifData.DateTimeOriginal || exifData.CreateDate || exifData.ModifyDate || exifData.DateTime;

    if (!dateString) {
      throw new Error("cannot extract date data from image file");
    }

    return new Date(dateString);
  } catch (error) {
    console.warn("Failed function extractDateFromImage(): ", error);
  }
};
