const { PrismaClient } = require("@prisma/client"),
  utils = require("../utils"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");

require("dotenv").config();
const secret_key = process.env.JWT_KEY || "no_secret";
const prisma = new PrismaClient();

module.exports = {
  registerUser: async (req, res) => {
    try {
      const user = await prisma.users.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: await utils.cryptPassword(req.body.password),
          profile: {
            create: {
              identity_number: req.body.identity_number,
              identity_type: req.body.identity_type,
              address: req.body.address,
            },
          },
        },
        include: {
          profile: true,
        },
      });
      return res.json({
        user
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  },

  loginUser: async (req, res) => {
    try {
      const findUser = await prisma.users.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!findUser) {
        return res.status(404).json({ error: "User not exists" });
      }

      if (bcrypt.compareSync(req.body.password, findUser.password)) {
        const token = jwt.sign({ id: findUser.id }, secret_key, {
          expiresIn: "6h",
        });
        return res.status(200).json({
          data: {
            name: findUser.name,
            email: findUser.email,
            token,
          },
        });
      }
      return res.status(403).json({
        error: "Invalid credentials",
      });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await prisma.users.findMany({
        select : {
          name: true,
          email: true,
        }
      });
      res.json(user);
    } catch (error) {
      return res.status(500).json({
        error,
      });
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
      return res.status(500).json({
        error,
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          id: res.user.id,
        },
        include: {
          profile: {
            select: {
              identity_type: true,
              identity_number: true,
              address: true,
              user_id: true,
            },
          },
        },
      });
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({
        error,
      });
    }
  },
};
