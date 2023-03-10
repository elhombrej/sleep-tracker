const {
  findUserByEmail,
  findUserById,
  updatePassword,
} = require("../functions/user");
const bcrypt = require("bcrypt");
const { STRIPE_SECRET_KEY } = process.env;
const Stripe = require("stripe");
const JWT_SECRET = "CVDF61651BV231TR894VBCX51LIK5LÑK84";
const jwt = require("jsonwebtoken");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});
const { User, Plan } = require("../db.js");
const nullUser = {
  dataValues: "",
};

const postUser = async (req, res) => {
  try {
    const { email, password, names, lastNames, nationality, birthday } =
      req.body;
    if (!email || !names || !lastNames) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const hashedPassword = await bcrypt.hash(password, 10); //la segunda variable es el numero de rondas que se encriptara
    const customer = await stripe.customers.create(
      {
        email,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );
    const bodyInfo = {
      email,
      hashedPassword,
      names,
      lastNames,
      nationality,
      birthday,
      stripeCustomerId: customer.id,
    };
    const oldUser = await findUserByEmail(email);
    if (oldUser.id !== 0) {
      return res.status(406).send(`El email ya esta registrado en la BD`);
    }
    let createdUser = await User.create(bodyInfo);
    res.status(201).json(createdUser); //201 es que fue creado
  } catch (error) {
    console.log("El error controllers user postUser es:", error.message);
    res
      .status(401)
      .send("El error controllers user postUser es:", error.message);
  }
};

const postGoogleUser = async (req, res) => {
  try {
    const { email, names, lastNames } = req.body;
    const user = await findUserByEmail(email);
    if (user.deletedAt) {
      return res.status(203).send(user);
    }
    const customer = await stripe.customers.create(
      {
        email,
      },
      {
        apiKey: process.env.STRIPE_SECRET_KEY,
      }
    );
    if (!email || !names || !lastNames) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const bodyInfo = { email, names, lastNames, stripeCustomerId: customer.id };
    const oldUser = await findUserByEmail(email);
    if (oldUser.id !== 0) {
      return res.status(202).send(oldUser);
    } else {
      let createdUser = await User.create(bodyInfo);
      res.status(201).json(createdUser.dataValues); //201 es que fue creado
    }
  } catch (error) {
    console.log("El error controllers user postGoogleUser es:", error.message);
    res.status(401).send("El error controllers user postGoogleUser es");
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const oldUser = await findUserByEmail(email);
    if (oldUser.id === 0) {
      return res.status(202).send({ status: "el usuario no existe" });
    }
    const secret = JWT_SECRET + oldUser.hashedPassword;
    const token = jwt.sign({ email: oldUser.email, id: oldUser.id }, secret, {
      expiresIn: "50m",
    });
    const link = `${process.env.BASE_FRONT_URL}/reiniciar_contrasena/${oldUser.id}/${token}`;
    res.status(200).json(link); //201 es que fue creado
  } catch (error) {
    console.log("El error controllers user forgotPassword es:", error.message);
    res.status(401).send("El error controllers user forgotPassword es");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    if (!id || !token || !password) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const oldUser = await User.findOne({ where: { id: id } });
    if (!oldUser) {
      return res.status(202).send("el usuario no existe");
    }
    const secret = JWT_SECRET + oldUser.hashedPassword;
    const verify = jwt.verify(token, secret);
    const hashedPassword = await bcrypt.hash(password, 10);
    updatePassword(id, hashedPassword);
    res.status(200).send("Verificado");
  } catch (error) {
    console.log("El error controllers resetPassword es:", error.message);
    res.status(400).send("Sin verificar");
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const user = await findUserByEmail(email);
    if (user.id === 0) {
      return res.status(204).send(nullUser);
    } else {
      return res.status(200).send(user);
    }
  } catch (error) {
    console.log("El error controllers user getUserByEmail es:", error.message);
    res
      .status(401)
      .send("El error controllers user getUserByEmail es:", error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id, password, idAdmin } = req.params;
    function copareHash(password, hashed) {
      return bcrypt.compareSync(password, hashed);
    }
    const userDelete = await findUserById(id);
    console.log(userDelete);

    if (idAdmin && idAdmin !== "NoAdmin") {
      // Solo para el Admin
      const userAdmin = await findUserById(idAdmin);
      if (userAdmin && userAdmin.isAdmin && userDelete) {
        const result = await User.destroy({ where: { id: id } });
        if (result) return res.status(200).send("Usuario eliminado");
      }
    } else {
      if (!id || !password) {
        return res.status(428).send("Falta enviar datos obligatorios"); // Validacion de datos
      }

      if (!userDelete) {
        return res.status(202).send("el usuario no existe"); // Validacion de Usuario existente
      }

      if (copareHash(password, userDelete.hashedPassword)) {
        // Validacion de contraseña
        const result = await User.destroy({ where: { id: id } });
        if (result) {
          return res.status(200).send("Usuario eliminado");
        }
      }
    }
  } catch (error) {
    return res.status(400).send("No se pudo eliminar el usuario");
  }
};

const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const user = await findUserById(id);
    if (!user) {
      return res.status(202).send("el usuario no existe");
    }
    await User.restore({
      where: {
        id: id,
      },
    });
    return res.status(200).send("Usuario restaurado");
  } catch (error) {
    return res.status(400).send("No se pudo restaurar el usuario");
  }
};

const restoreUserByJustEmail = async (req, res) => {
  try {
    const { email } = req.params;
    let user = await findUserByEmail(email);
    if (!user) {
      return res.status(202).send("el usuario no existe");
    }
    const restoredUser = await User.restore({
      where: {
        email: email,
      },
    });
    user = await findUserByEmail(email);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).send("No se pudo restaurar el usuario");
  }
};

const updateProfile = async (req, res) => {
  const { id } = req.params;
  const info = req.body;
  try {
    const update = await User.update(info, {
      where: {
        id: id,
      },
    });
    if (update) {
      const user = await User.findOne({
        where: { id: id },
        include: {
          model: Plan,
          attributes: ["id", "name", "price", "endTime"],
        },
      });
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
const getUserInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const user = await findUserById(id);
    if (user.id === 0) {
      return res.status(204).send(nullUser);
    } else {
      return res.status(200).send(user);
    }
  } catch (error) {
    console.log("El error controllers user getUserInfoById es:", error.message);
    res
      .status(401)
      .send("El error controllers user getUserInfoById es:", error.message);
  }
};

const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!id || !newPassword) {
      return res.status(428).send("Falta enviar datos obligatorios");
    }
    const oldUser = await findUserById(id);
    if (!oldUser) {
      return res.status(202).send("el usuario no existe");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(id, hashedPassword);
    const newUser = await User.findOne({
      where: { id: id },
      include: {
        model: Plan,
        attributes: ["id", "name", "price", "endTime"],
      },
    });
    return res.status(200).json(newUser);
  } catch (error) {
    res.status(400).send("Sin verificar");
  }
};

module.exports = {
  postUser,
  postGoogleUser,
  forgotPassword,
  resetPassword,
  getUserByEmail,
  deleteUser,
  updateProfile,
  changeUserPassword,
  getUserInfoById,
  restoreUser,
  restoreUserByJustEmail,
};
