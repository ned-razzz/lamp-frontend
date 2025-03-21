export const convertHeicToJpg = async (heicFile: File) => {
  //라이브러리 동적 로드
  //heic2any는 브라우저 환경에서만 로드 가능
  const heic2any = (await import("heic2any")).default;
  try {
    // Check if heic2any library is available
    if (typeof heic2any !== "function") {
      throw new Error("heic2any library is required. Please include the script in your project.");
    }

    // Check file extension or type
    const fileName = heicFile.name.toLowerCase();
    const isHeic = fileName.endsWith(".heic") || fileName.endsWith(".heif");
    if (!isHeic) {
      throw new Error("File may not be in HEIC format.");
    }
    // Convert HEIC to JPG using heic2any
    const jpgBlob = (await heic2any({
      blob: heicFile,
      toType: "image/jpeg",
      quality: 0.5,
    })) as Blob;

    // Generate filename with .jpg extension
    const jpgFilename = fileName.replace(/\.(heic|heif)$/i, ".jpg");
    const jpgFile = new File([jpgBlob], jpgFilename, { type: "image/jpeg" });

    return jpgFile;
  } catch (error) {
    console.error(error);
  }
};
