export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation 미제공 브라우저'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        //resolve({ latitude, longitude });

        resolve({ latitude: 37.400113, longitude: 127.106766 }); //유스페이스
      },
      (error) => {
        reject(error);
        console.log(`위치 정보 요청 실패: ${error.message}`);
      },
    );
  });
};
