const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {
    registAccount: async (req, res) => {
      const userId = parseInt(req.body.user_id);
      try {
        const user = await prisma.users.findUnique({
          where: {
            id: userId,
          },
        });
    
        if (!user) {
          return res.status(404).json({ error: 'User Not Found' });
        }
    
        const addAccount = await prisma.bank_accounts.create({
          data: {
            bank_name: req.body.bank_name,
            bank_account_number: req.body.bank_account_number,
            balance: BigInt(req.body.balance), 
            user: { connect: { id: userId } },
          },
        });
        
        return res.json({
          data: {
            user_id: addAccount.user_id,
            bank_name: addAccount.bank_name,
            bank_account_number: addAccount.bank_account_number,
            balance: Number(addAccount.balance),
          },
        });      
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while adding the account' });
      }
    },


  getAccounts: async (req, res) => {
    try {
      const account = await prisma.bank_accounts.findMany({
        select : {
          id: true,
          user_id: true,
          bank_name: true,
          bank_account_number: true,
          balance: true,
        }
      });
      const formattedAccounts = account.map(account => ({
        ...account,
        balance: Number(account.balance),
        user_id: Number(account.user_id),
      }));
  
      res.json(formattedAccounts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getAccountById : async (req, res) => {
    try {
      const accountById = parseInt(req.params.id);
      const account = await prisma.bank_accounts.findUnique ({
        where : {
          id : accountById
        },
        include : {
          user : {
            select : {
              name : true,
              email : true,
            }
          }
        },
        
      })
      if (!account) {
        return res.status(404).json({
          error: 'Account Not Found'
        })
      }
      
      const data = {
        id: account.id,
        user_id: account.user_id,
        bank_name: account.bank_name,
        bank_account_number: account.bank_account_number,
        balance: Number(account.balance),
        user: {
          name: account.user.name,
          email: account.user.email,
        }
      }
      return res.json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: 'Internal Server Error'})
    }
  }
};



