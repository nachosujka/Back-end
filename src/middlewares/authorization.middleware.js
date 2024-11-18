export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      //Valido que haya una session de estado
      return res.status(401).json({ status: "error", msg: "Unauthorized" });
    if (req.user.role !== role)
      //Valido si el rol del usuario logeado es igual al rol autorizado
      return res.status(403).json({ status: "error", msg: "No permission" });
  };
};
