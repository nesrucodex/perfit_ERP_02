import { StatusCodes } from "http-status-codes";
import { asyncWrapper, RouteError, sendApiResponse } from "../utils";
import { db, zodErrorFmt } from "../libs";
import { transactionValidator, queryParamIDValidator } from "../validators";

// Get All Transactions
export const getTransactionsController = asyncWrapper(async (req, res) => {
  const transactions = await db.transaction.findMany({
    include: {
      customer: true,
      salesPerson: true,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transactions retrieved successfully.",
    result: transactions,
  });
});

// Get Transaction By ID
export const getTransactionByIDController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryParamIDValidator(
    "Transaction ID not provided or invalid."
  ).safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const transaction = await db.transaction.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
    include: {
      customer: true,
      salesPerson: true,
    },
  });

  if (!transaction)
    throw RouteError.NotFound("Transaction not found with the provided ID.");

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction retrieved successfully.",
    result: transaction,
  });
});

// Create Transaction
export const createTransactionController = asyncWrapper(async (req, res) => {
  const bodyValidation = transactionValidator.createTransactionSchema.safeParse(
    req.body
  );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const newTransaction = await db.transaction.create({
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Transaction created successfully.",
    result: newTransaction,
  });
});

// Update Transaction
export const updateTransactionController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryParamIDValidator(
    "Transaction ID not provided or invalid."
  ).safeParse(req.params);
  const bodyValidation = transactionValidator.updateTransactionSchema.safeParse(
    req.body
  );

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  if (!bodyValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(bodyValidation.error)[0].message,
      zodErrorFmt(bodyValidation.error)
    );

  const existingTransaction = await db.transaction.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingTransaction)
    throw RouteError.NotFound("Transaction not found with the provided ID.");

  const updatedTransaction = await db.transaction.update({
    where: {
      id: queryParamValidation.data.id,
    },
    data: bodyValidation.data,
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction updated successfully.",
    result: updatedTransaction,
  });
});

// Delete Transaction
export const deleteTransactionController = asyncWrapper(async (req, res) => {
  const queryParamValidation = queryParamIDValidator(
    "Transaction ID not provided or invalid."
  ).safeParse(req.params);

  if (!queryParamValidation.success)
    throw RouteError.BadRequest(
      zodErrorFmt(queryParamValidation.error)[0].message,
      zodErrorFmt(queryParamValidation.error)
    );

  const existingTransaction = await db.transaction.findUnique({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  if (!existingTransaction)
    throw RouteError.NotFound("Transaction not found with the provided ID.");

  await db.transaction.delete({
    where: {
      id: queryParamValidation.data.id,
    },
  });

  return sendApiResponse({
    res,
    statusCode: StatusCodes.OK,
    success: true,
    message: "Transaction deleted successfully.",
    result: null,
  });
});
