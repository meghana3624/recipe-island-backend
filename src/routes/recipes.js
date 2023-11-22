import express from "express";
import { RecipeModel } from "../models/Recipes.js";

import mongoose from "mongoose";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipeModel(req.body);
  try {
    const response = await recipe.save();
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

router.post("/update", verifyToken, async (req, res) => {
  try {
    // Find the recipe by name and update it with the new data
    const updatedRecipe = await RecipeModel.findOneAndUpdate(
      { name: req.body.name },
      req.body,
      { new: true }
    );

    // Check if the recipe was found and updated
    if (updatedRecipe) {
      res.json(updatedRecipe);
    } else {
      res.status(404).send("Recipe not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to fetch a recipe by name
router.post("/fetch", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findOne({ name: req.body.name });
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).send("Recipe not found");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/delete", verifyToken, async (req, res) => {
  try {
    // Find the recipe by name and update it with the new data
    const deletedRecipe = await RecipeModel.findOneAndDelete(
      { name: req.body.name },
      req.body
    );

    // Check if the recipe was found and updated
    if (deletedRecipe) {
      res.json({ message: "Recipe deleted successfully" });
    } else {
      res.status(404).send("Recipe not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/search", verifyToken, async (req, res) => {
  try {
    const searchQuery = req.body.name;
    const searchRegex = new RegExp(searchQuery, "i"); // 'i' for case-insensitive

    const recipes = await RecipeModel.find({ name: { $regex: searchRegex } });

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    user.savedRecipes.push(recipe);
    await user.save();
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });

    res.json({ savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

router.get;
export { router as recipesRouter };
