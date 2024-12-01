const resizeImageBlob = async (blob, maxWidth, maxHeight, quality = 0.8) => {
  // 1. Blob을 이미지 객체로 읽어오기
  const img = await new Promise((resolve, reject) => {
    const imgElement = new Image();
    imgElement.onload = () => resolve(imgElement);
    imgElement.onerror = reject;
    imgElement.src = URL.createObjectURL(blob);
  });

  // 2. Canvas에 이미지 그리기
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // 비율 계산
  let { width, height } = img;
  if (width > maxWidth || height > maxHeight) {
    const scale = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  // Canvas 크기 설정 및 이미지 그리기
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  // 3. Canvas 데이터를 압축된 Blob으로 변환
  return new Promise(resolve => {
    canvas.toBlob(
      compressedBlob => {
        resolve(compressedBlob);
      },
      'image/jpeg', // 압축 포맷 (JPEG)
      quality, // 압축 품질 (0.0 ~ 1.0)
    );
  });
};
export default resizeImageBlob;
