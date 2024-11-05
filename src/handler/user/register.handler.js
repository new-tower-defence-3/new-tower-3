const registerUser = async ({ socket, userId, payload }) => {
  try {
    const { id, email, password } = payload;
    // 회원가입 기능 추가
    console.log('회원 가입은 아직 미구현');
  } catch (e) {
    console.error(e);
  }
};

export default registerUser;
