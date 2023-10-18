const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(5);
  return bcrypt.hash(password, salt);
};

const prisma = new PrismaClient();

module.exports = {
  registerUser: async (req, res) => {
    const user = await prisma.users.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: await cryptPassword(req.body.password),
        profile: {
          create: {
            identity_number: req.body.identity_number,
            identity_type: req.body.identity_type,
            address: req.body.address,
          },
        },
      },
    });
    return res.json({
      data: user,
    });
  },

  loginUser: async (req, res) => {
    const findUser = await prisma.users.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!findUser) {
      return res.status(404).json({ error: "User not exists" });
    }

    if (bcrypt.compareSync(req.body.password, findUser.password)) {
      const token = jwt.sign({ id: findUser.id }, "secret_key", {
        expiresIn: "6h",
      });
      return res.status(200).json({
        data: {
          token,
        },
      });
    }
    return res.status(403).json({
      error: "Invalid credentials",
    });
  },

  getUser: async (req, res) => {
    try {
      const user = await prisma.users.findMany();
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const userById = parseInt(req.params.id);
      const user = await prisma.users.findUnique({
        where: {
          id: userById,
        },
        select: {
          name: true,
          email: true,
          profile: true,
        },
      });
      return res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getProfile: async (req, res) => {
    const user = await prisma.users.findUnique({
      where: {
        id: res.user.id,
      },
     include : {
      profile : {
        select : {
          identity_number : true,
          identity_type : true,
          address : true,
        }
      }
     }
    });
    return res.status(200).json({ data: user });
  },
};
