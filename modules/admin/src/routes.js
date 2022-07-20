"use strict";

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const { CREXCH_CTRL, ADM_BANK_CTRL, ADM_PROVIDER, PERMISSON } = use(
  "Root/utils/constants"
);
/* AUTH */
Route.get("/generate", "@provider:Admin/CustomerController.generate");
Route.group(() => {
  Route.post("/login", "@provider:Admin/AuthController.login");
  Route.post("/forgot-password", "@provider:Admin/AuthController.forgot");
  Route.post("/new-password", "@provider:Admin/AuthController.confirmForgot");
  Route.get(
    "/user-profile",
    "@provider:Admin/AuthController.userProfile"
  ).middleware(["adminAuthApi"]);
  Route.get("/logout", "@provider:Admin/AuthController.logout").middleware([
    "adminAuthApi",
  ]);
}).prefix("api/v1/admin");

/* SETTING */
Route.group(() => {
  Route.get("/list", "@provider:Admin/SettingController.list").middleware([
    "permission:settingPaymentView",
  ]);
  Route.get(
    "/find-key",
    "@provider:Admin/SettingController.findKey"
  ).middleware(["permission:settingPaymentView"]);
  Route.post("/update", "@provider:Admin/SettingController.update").middleware([
    "permission:settingPaymentView",
  ]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/setting");

Route.get("/info", "@provider:Admin/SettingController.info").prefix(
  "api/v1/admin/setting"
);

/* Withdraw */
Route.group(() => {
  /* request withdraw user */
  Route.post("/approve", "@provider:Admin/WithdrawController.approveWithdraw");
  Route.get("/list", "@provider:Admin/WithdrawController.listWithdraw");
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/withdraw");

/* Combo */
Route.group(() => {
  Route.get("/list", "@provider:Admin/ComboController.list").middleware([
    "permission:comboView",
  ]);
  Route.post("/create", "@provider:Admin/ComboController.create").middleware([
    "permission:comboCreate",
  ]);
  Route.get("/edit", "@provider:Admin/ComboController.edit");
  Route.post("/update", "@provider:Admin/ComboController.update").middleware([
    "permission:comboUpdate",
  ]);
  Route.get("/delete", "@provider:Admin/ComboController.delete").middleware([
    "permission:comboDelete",
  ]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/combo");

/* Level */
Route.group(() => {
  Route.get("/list", "@provider:Admin/LevelController.list");
  //.middleware(['permission:levelView'])
  Route.post("/create", "@provider:Admin/LevelController.create");
  //.middleware(['permission:levelCreate'])
  Route.get("/edit", "@provider:Admin/LevelController.edit");
  Route.post("/update", "@provider:Admin/LevelController.update");
  //.middleware(['permission:levelUpdate'])
  Route.get("/delete", "@provider:Admin/LevelController.delete");
  //.middleware(['permission:levelDelete'])
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/level");

Route.post(
  "/update/position",
  "@provider:Admin/LevelController.updatePosition"
).prefix("api/v1/admin");

/* Exchange rate */
Route.group(() => {
  Route.get("/list", `${CREXCH_CTRL}.list`).middleware([
    `${PERMISSON}:exchangeRateView`,
  ]);
  Route.post("/create", `${CREXCH_CTRL}.create`).middleware([
    `${PERMISSON}:exchangeRateCreate`,
  ]);
  Route.get("/edit", `${CREXCH_CTRL}.edit`);
  Route.post("/update", `${CREXCH_CTRL}.update`).middleware([
    `${PERMISSON}:exchangeRateUpdate`,
  ]);
  Route.get("/delete", `${CREXCH_CTRL}.delete`).middleware([
    `${PERMISSON}:exchangeRateDelete`,
  ]);
})
  .namespace(ADM_PROVIDER)
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/exchange");

/* admin bank */
Route.group(() => {
  Route.get("/list", `${ADM_BANK_CTRL}.list`).middleware([
    `${PERMISSON}:admBankView`,
  ]);
  Route.post("/create", `${ADM_BANK_CTRL}.create`).middleware([
    `${PERMISSON}:admBankCreate`,
  ]);
  Route.post("/update", `${ADM_BANK_CTRL}.update`).middleware([
    `${PERMISSON}:admBankUpdate`,
  ]);
  Route.get("/delete", `${ADM_BANK_CTRL}.delete`).middleware([
    `${PERMISSON}:admBankDelete`,
  ]);
})
  .namespace(ADM_PROVIDER)
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/bank");

/* Commissions */
Route.group(() => {
  Route.get("/list", "CommissionsController.list");
  //.middleware(['permission:commissionsView'])
  Route.post("/update", "CommissionsController.update");
  //.middleware(['permission:commissionsUpdate'])
})
  .namespace(ADM_PROVIDER)
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/commissions");

/* PACKAGE */
Route.group(() => {
  Route.get("/list", "@provider:Admin/PackageController.list").middleware([
    "permission:salePackageView",
  ]);
  Route.post("/create", "@provider:Admin/PackageController.create").middleware([
    "permission:salePackageCreate",
  ]);
  Route.get("/edit", "@provider:Admin/PackageController.edit");
  Route.post("/update", "@provider:Admin/PackageController.update").middleware([
    "permission:salePackageUpdate",
  ]);
  Route.get("/delete", "@provider:Admin/PackageController.delete").middleware([
    "permission:salePackageDelete",
  ]);

  /* ------------------------------------ CONFIG COMMISSIONS ----------------------------------*/

  Route.post(
    "/create",
    "@provider:Admin/PackageController.configCreate"
  ).prefix("config");
  Route.get("/list", "@provider:Admin/PackageController.configList").prefix(
    "config"
  );
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/package");

/* PACKAGE promotion */
Route.group(() => {
  Route.get("/list", "@provider:Admin/PromotionController.list").middleware([
    "permission:promotionView",
  ]);
  Route.post(
    "/create",
    "@provider:Admin/PromotionController.create"
  ).middleware(["permission:promotionCreate"]);
  Route.get("/edit", "@provider:Admin/PromotionController.edit");
  Route.post(
    "/update",
    "@provider:Admin/PromotionController.update"
  ).middleware(["permission:promotionUpdate"]);
  Route.get(
    "/delete",
    "@provider:Admin/PromotionController.delete"
  ).middleware(["permission:promotionDelete"]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/promotion");

/* PACKAGE CATEGORY */
Route.group(() => {
  Route.get(
    "/list",
    "@provider:Admin/PackageCategoryController.list"
  ).middleware(["permission:salePackageCategoryView"]);
  Route.post(
    "/create",
    "@provider:Admin/PackageCategoryController.create"
  ).middleware(["permission:salePackageCategoryCreate"]);
  Route.get("/edit", "@provider:Admin/PackageCategoryController.edit");
  Route.post(
    "/update",
    "@provider:Admin/PackageCategoryController.update"
  ).middleware(["permission:salePackageCategoryUpdate"]);
  Route.get(
    "/delete",
    "@provider:Admin/PackageCategoryController.delete"
  ).middleware(["permission:salePackageCategoryDelete"]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/package-category");

/* GROUP */
Route.group(() => {
  Route.get("/list", "@provider:Admin/GroupController.list");
  Route.post("/create", "@provider:Admin/GroupController.create");
  Route.get("/edit", "@provider:Admin/GroupController.edit");
  Route.post("/update", "@provider:Admin/GroupController.update");
  Route.get("/delete", "@provider:Admin/GroupController.delete");
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/group");

/* PERMISSION */
Route.group(() => {
  Route.get("/list", "@provider:Admin/PermissionController.list");
  Route.get("/group-list", "@provider:Admin/PermissionController.groupList");
  Route.post("/create", "@provider:Admin/PermissionController.create");
  Route.get("/edit", "@provider:Admin/PermissionController.edit");
  Route.post("/update", "@provider:Admin/PermissionController.update");
  Route.get("/delete", "@provider:Admin/PermissionController.delete");
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/permission");

/* ROLE */
Route.group(() => {
  Route.get("/list", "@provider:Admin/RoleController.list").middleware([
    "permission:userRoleView",
  ]);
  Route.post("/create", "@provider:Admin/RoleController.create").middleware([
    "permission:userRoleCreate",
  ]);
  Route.get("/edit", "@provider:Admin/RoleController.edit");
  Route.post("/update", "@provider:Admin/RoleController.update").middleware([
    "permission:userRoleUpdate",
  ]);
  Route.get("/delete", "@provider:Admin/RoleController.delete").middleware([
    "permission:userRoleDelete",
  ]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/role");

/* USER */
Route.group(() => {
  Route.get("/list", "@provider:Admin/UserController.list").middleware([
    "permission:userView",
  ]);
  Route.post("/create", "@provider:Admin/UserController.create").middleware([
    "permission:userCreate",
  ]);
  Route.get("/edit", "@provider:Admin/UserController.edit");
  Route.post("/update", "@provider:Admin/UserController.update").middleware([
    "permission:userUpdate",
  ]);
  Route.get("/delete", "@provider:Admin/UserController.delete").middleware([
    "permission:userDelete",
  ]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/user");

/* Agency */
Route.group(() => {
  Route.get("/list", "@provider:Admin/AgencyController.list").middleware([
    "permission:agencyView",
  ]);
  Route.post("/create", "@provider:Admin/AgencyController.create").middleware([
    "permission:agencyCreate",
  ]);
  Route.get("/edit", "@provider:Admin/AgencyController.edit");
  Route.post("/update", "@provider:Admin/AgencyController.update").middleware([
    "permission:agencyUpdate",
  ]);
  Route.get("/delete", "@provider:Admin/AgencyController.delete").middleware([
    "permission:agencyDelete",
  ]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/agency");

/* ICBNews */
Route.group(() => {
  Route.get("/list", "@provider:Admin/ICBNewsController.list");
  //.middleware(['permission:agencyView'])
  Route.post("/create", "@provider:Admin/ICBNewsController.create");
  //.middleware(['permission:agencyCreate'])
  Route.get("/edit", "@provider:Admin/ICBNewsController.edit");
  Route.post("/update", "@provider:Admin/ICBNewsController.update");
  //.middleware(['permission:agencyUpdate'])
  Route.get("/delete", "@provider:Admin/ICBNewsController.delete");
  //.middleware(['permission:agencyDelete'])
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/news");

/* CUSTOMER */
Route.group(() => {
  Route.get("/list", "@provider:Admin/CustomerController.list").middleware([
    "permission:customerView",
  ]);
  Route.post(
    "/create",
    "@provider:Admin/CustomerController.create"
  ).middleware(["permission:customerCreate"]);
  Route.get("/edit", "@provider:Admin/CustomerController.edit");
  Route.post(
    "/update",
    "@provider:Admin/CustomerController.update"
  ).middleware(["permission:customerUpdate"]);
  Route.get("/delete", "@provider:Admin/CustomerController.delete").middleware([
    "permission:customerDelete",
  ]);
  Route.get(
    "/show-detail",
    "@provider:Admin/CustomerController.showDetail"
  ).middleware(["permission:customerView"]);
  Route.get(
    "/ref-tree",
    "@provider:Admin/CustomerController.refInfoUser"
  ).middleware(["permission:customerView"]);

  Route.post(
    "/update-active",
    "@provider:Admin/CustomerController.updateActive"
  ).middleware(["permission:customerUpdate"]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/customer");

/* Order */
Route.group(() => {
  Route.get("/list", "@provider:Admin/OrderController.list").middleware([
    "permission:saleOrderView",
  ]);
  Route.post("/create", "@provider:Admin/OrderController.create").middleware([
    "permission:saleOrderCreate",
  ]);
  Route.get("/edit", "@provider:Admin/OrderController.edit");
  Route.post("/update", "@provider:Admin/OrderController.update").middleware([
    "permission:saleOrderUpdate",
  ]);
  Route.get(
    "/detail",
    "@provider:Admin/OrderController.showDetail"
  ).middleware(["permission:saleOrderDetail"]);
  Route.post("/change", "@provider:Admin/OrderController.change").middleware([
    "permission:saleOrderDelete",
  ]);
  Route.get("/delete", "@provider:Admin/OrderController.delete").middleware([
    "permission:saleOrderDelete",
  ]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/order");

/* Transaction */
Route.group(() => {
  Route.get("/list", "@provider:Admin/TransactionController.list");
  // .middleware(['permission:transactionOrderView'])
  Route.post("/create", "@provider:Admin/TransactionController.create");
  // .middleware(['permission:transactionOrderCreate'])

  Route.get("/detail", "@provider:Admin/TransactionController.showDetail");
  // .middleware(['permission:transactionOrderDetail'])

  Route.get(
    "/list-order-pending",
    "@provider:Admin/TransactionController.listOrderPending"
  );
  // .middleware(['permission:transactionOrderDetail'])

  Route.get(
    "/total-transaction-order",
    "@provider:Admin/TransactionController.getTotalTransacrion"
  );
  // .middleware(['permission:transactionOrderDetail'])

  Route.get("/delete", "@provider:Admin/TransactionController.delete");
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/transaction");

/* REPORT */
Route.group(() => {
  Route.get(
    "/sales-report",
    "@provider:Admin/ReportController.reportView"
  ).middleware(["permission:reportView"]);
  Route.get(
    "/sales-report-detail",
    "@provider:Admin/ReportController.reportViewDetail"
  ).middleware(["permission:reportViewDetail"]);
  Route.get(
    "/transaction-history",
    "@provider:Admin/ReportController.transactionHistory"
  ).middleware(["permission:reportTransactionHistory"]);
  Route.get(
    "/payment-report",
    "@provider:Admin/ReportController.paymentsReport"
  ).middleware(["permission:paymentsReport"]);
  Route.get(
    "/commissions-report",
    "@provider:Admin/ReportController.commissionsReport"
  ).middleware(["permission:commissionsReport"]);
  Route.get(
    "/commissions-report-customer",
    "@provider:Admin/ReportController.commissionsReportForUser"
  ).middleware(["permission:commissionsReport"]);

  Route.get(
    "/report-partner",
    "@provider:Admin/ReportController.reportPartner"
  ).middleware(["permission:commissionsReport"]);

  Route.get(
    "/report-package",
    "@provider:Admin/ReportController.reportPackage"
  ).middleware(["permission:commissionsReport"]);
})
  .middleware(["adminAuthApi"])
  .prefix("api/v1/admin/report");
