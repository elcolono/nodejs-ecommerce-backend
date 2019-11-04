const express = require("express");
const router = express.Router();

const {
    create,
    productById,
    read,
    remove,
    update,
    list,
    listRelated,
    listCategories,
    listBySearch,
    photo,
    listSearch
} = require("../controllers/product");
const { requireSignin, isAuth, isAdmin, isVendor } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { categoryBySlugId } = require("../controllers/category");

router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isVendor, create);
router.delete(
    "/product/:productId/:userId",
    requireSignin,
    isAuth,
    isVendor,
    remove
);
router.put(
    "/product/:productId/:userId",
    requireSignin,
    isAuth,
    isVendor,
    update
);

router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.get("/products/search", listSearch);
router.post("/products/by/search/:categorySlugId", listBySearch);
router.get("/product/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);
router.param("categorySlugId", categoryBySlugId);


module.exports = router;
