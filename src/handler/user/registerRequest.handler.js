const registerRequestHandler = async ({ socket, payload, sequence }) => {
  console.log('registerRequestHandler Called');
  console.log(socket);
  console.log(payload);
  const { id, password, email } = payload;
  console.log(id);
  console.log(password);
  console.log(email);
  console.log(sequence);
  return 1;
};

export default registerRequestHandler;