import { encryptPassword } from "../helpers/encryptPassword.js";
import { generateToken } from "../helpers/generateToken.js";
import { response } from "../helpers/response.js";
import { userModel } from "../models/user.model.js";

const userCtrl = {};

userCtrl.register = async (req, reply) => {
  try {
    const { email, password, name } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      return response(
        reply,
        409,
        false,
        "",
        "La dirección de correo electrónico ya está siendo usada por alguien más."
      );
    }

    const passwordEncrypt = encryptPassword(password);

    const newUser = new userModel({email, password: passwordEncrypt, name});

    await newUser.save();

    const token = generateToken({user: newUser._id});

    response(reply, 201, true, {...newUser.toJSON(), password: null ,token}, "El usuario ha sido creado con éxito.")

  } catch (error) {
    response(reply, 500, false, "", error.message);
  }
}; 

// Función para loguearse
userCtrl.login = async(req, reply) => {
    try {
        const {password, email} = req.body;
        const user = await userModel.findOne({email});

        if (user && user.matchPassword(password)){
            const token = generateToken({user: user._id});
            return response(reply, 200, true, {...user.toJSON(), password: null, token}, "Bienvenida(o)")
        }

        response(reply, 400, false, "", "Las credenciales no son correctas, inténtalo de nuevo.")
    } catch (error) {
        response(reply, 500, false, "", error.message);
    }
}

export default userCtrl;
