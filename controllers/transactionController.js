const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
module.exports = {
  createTransaction: async (req, res) => {
    try {
      const sourceAccountId = parseInt(req.body.source_account_id);
      const destinationAccountId = parseInt(req.body.destination_account_id);
      const amount = BigInt(req.body.amount);

      // Mengambil cata akun pengirim
      const sourceAccount = await prisma.bank_accounts.findUnique({
        where: { id: sourceAccountId },
        include: {
          user: true,
        },
      });

      // Mengambil data akun penerima
      const destinationAccount = await prisma.bank_accounts.findUnique({
        where: { id: destinationAccountId },
        include: {
          user: true,
        },
      });

      // validasi akun pengirim dan penerima
      if (!sourceAccount || !destinationAccount) {
        return res
          .status(404)
          .json({ error: "Sender's or Recipient's Account Not Found!" });
      }

      // validasi saldo akun pengirim
      if (sourceAccount.balance < amount) {
        return res
          .status(400)
          .json({ error: "The Sender's Account Balance is Insufficient" });
      }

      // operasi transaksi akun pengirim dan penerima
      const transaction = await prisma.$transaction([
        prisma.bank_account_transactions.create({
          data: {
            source_account_id: sourceAccountId,
            destination_account_id: destinationAccountId,
            amount,
          },
          include: {
            source_account: true,
            destination_account: true,
          },
        }),

        prisma.bank_accounts.update({
          where: { id: sourceAccountId },
          data: { balance: sourceAccount.balance - amount },
        }),
        prisma.bank_accounts.update({
          where: { id: destinationAccountId },
          data: { balance: destinationAccount.balance + amount },
        }),
      ]);

      return res.json({
        data: {
          transaction_id: transaction.id,
          source_account_id: transaction.sourceAccountId,
          source_account_id: sourceAccount.id,
          source_account_name: sourceAccount.user.name,
          destination_account_id: transaction.destinationAccountId,
          destination_account_id: destinationAccount.id,
          destination_account_name: destinationAccount.user.name,
          amount: Number(amount),
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An Error Occurred while Processing the Transaction" });
    }
  },

  getAllTransaction: async (req, res) => {
    try {
      const transactions = await prisma.bank_account_transactions.findMany({
        include: {
          source_account: {
            include: {
              user: true,
            },
          },
          destination_account: {
            include: {
              user: true,
            },
          },
        },
      });

      const formatedTransactions = transactions.map((transaction) => ({
        transaction_id: transaction.id,
        source_account_id: transaction.source_account_id,
        source_account_name: transaction.source_account.user.name,
        destination_account_id: transaction.destination_account_id,
        destination_account_name: transaction.destination_account.user.name,
        amount: Number(transaction.amount),

      }));
      return res.json({ data: formatedTransactions });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An Error Occurred while Retrieving Transactions" });
    }
  },

  getTransactionById: async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);

      const transaction = await prisma.bank_account_transactions.findUnique({
        where: { id: transactionId },
        include: {
          source_account: {
            include: {
              user: true,
            },
          },
          destination_account: {
            include: {
              user: true,
            },
          },
        },
      });
      if (!transaction) {
        return res.status(404).json({ error: "Transaction Not Found!" });
      }
      const transactionById = {
        transaction_id: transaction.id,
        source_account_id: transaction.source_account_id,
        source_account_name: transaction.source_account.user.name,
        destination_account_id: transaction.destination_account_id,
        destination_account_name: transaction.destination_account.user.name,
        amount: Number(transaction.amount),
      };
      return res.json({ data: transactionById });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An Error Occurred while Retrieving Transaction" });
    }
  },
};
