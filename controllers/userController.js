const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
  registerUser: async (req, res) => {
    const user = await prisma.users.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
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

  getUser: async (req, res) => {
    try {
      const user = await prisma.users.findMany();
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUserById: async(req,res) => {
    try {
      const userById = parseInt(req.params.id);
      const user = await prisma.users.findUnique ({
        where : {
          id : userById
        },
        select : {
          name : true,
          email : true,
          profile : true,
        },
      })
      return res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
