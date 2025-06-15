import { Router } from "express";

const {
  addFavorite,
  getFavoritesByUserId,
  deleteFavorite,
} = require("../controllers/favorite");

const favoriteRouter = Router();

favoriteRouter.post("/", addFavorite);
favoriteRouter.get("/:userId", getFavoritesByUserId); 
favoriteRouter.delete("/delete/:id", deleteFavorite);

export default favoriteRouter;
