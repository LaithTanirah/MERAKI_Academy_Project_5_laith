import { Router } from "express";
import authentication from "../middleware/authentication";
const {
  addFavorite,
  getFavoritesByUserId,
  deleteFavorite,
} = require("../controllers/favorite");

const favoriteRouter = Router();

favoriteRouter.post("/", authentication, addFavorite);
favoriteRouter.get("/:userId", authentication, getFavoritesByUserId);
favoriteRouter.delete("/delete/:id", authentication, deleteFavorite);

export default favoriteRouter;
