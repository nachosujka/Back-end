export const createUserTypeError = (user) => {
  return `Uno o mas de tus valores enviados no es valido. Se esperaba las siguientes condiciones:
    *username: Se esperaba un stringify, se recibio${user.username}
    *email: Se esperaba un string, se recibio ${user.email}`;
};

export const createUserUniqueEmailError = (user) => {
  return `El email ${user.email} ingresado ya se encuentra registrado`;
};
