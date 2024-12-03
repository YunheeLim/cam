import CryptoJS from 'crypto-js';

const encrypt = () => {
  // 암호화 키 (비밀키)
  const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY?.toString() ?? '';

  // 생성된 ID
  const currentTime = new Date();
  const createdId = currentTime.getTime();

  // 암호화
  const encryptedId = CryptoJS.AES.encrypt(
    createdId.toString(),
    secretKey,
  ).toString();

  const sanitizedEncryptedId = encryptedId.replace(/[^a-zA-Z0-9]/g, '');

  // 복호화
  const decryptedId = CryptoJS.AES.decrypt(encryptedId, secretKey).toString(
    CryptoJS.enc.Utf8,
  );

  return sanitizedEncryptedId;
};

export default encrypt;
