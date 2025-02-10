import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import authMiddleware from "./middleware/auth"
import routes from "./routes";
import middlewares from "./middleware";
import { ENV } from "./config";
import { setupSwagger } from "./libs";

const app = express();

// Registering middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, origin);
    },
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(middlewares.limiter);
app.use(cookieParser(ENV.COOKIE_SECRET)); // Use a secret key for signing

// Routes
app.use("/api/v1/auth",routes.authRouter);
app.use("/api/v1/users", authMiddleware.authenticationMiddleWare, routes.userRouter);
app.use("/api/v1/products", authMiddleware.authenticationMiddleWare, routes.productRouter);
app.use("/api/v1/suppliers", authMiddleware.authenticationMiddleWare, routes.supplierRouter);
app.use("/api/v1/competitors", authMiddleware.authenticationMiddleWare, routes.competitorRouter);
app.use("/api/v1/competitor-imports", authMiddleware.authenticationMiddleWare, routes.competitorImportRouter);
app.use("/api/v1/inventories", authMiddleware.authenticationMiddleWare, routes.inventoryRouter);
app.use("/api/v1/imports", authMiddleware.authenticationMiddleWare, routes.importRouter);
app.use("/api/v1/customers", authMiddleware.authenticationMiddleWare, routes.customerRouter);
app.use("/api/v1/transactions", authMiddleware.authenticationMiddleWare, routes.transactionRouter);
app.use("/api/v1/competitor-inventories", authMiddleware.authenticationMiddleWare, routes.competitorInventoryRouter);
app.use("/api/v1/pipelines", authMiddleware.authenticationMiddleWare, routes.pipelineRouter);
app.use("/api/v1/IODMs", authMiddleware.authenticationMiddleWare, routes.IODM_Router);

setupSwagger(app);

// Error handling middleware
app.use(middlewares.routeErrorHandlingMiddleware);

export default app;
