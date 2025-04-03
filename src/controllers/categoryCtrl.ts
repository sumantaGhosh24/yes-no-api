import {Request, Response} from "express";

import Category from "../models/categoryModel";
import Question from "../models/questionModel";

const categoryCtrl = {
  getCategories: async (req: Request, res: Response) => {
    try {
      const categories = await Category.find();

      res.json(categories);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  getCategory: async (req: Request, res: Response) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(400).json({message: "Category does not exists."});
        return;
      }

      res.json(category);
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  createCategory: async (req: Request, res: Response) => {
    try {
      const {name, image} = req.body;

      if (!name || !image) {
        res.status(400).json({message: "Please fill all fields."});
        return;
      }

      const category = await Category.findOne({name});
      if (category) {
        res.status(400).json({message: "This category already exists."});
        return;
      }

      const newCategory = new Category({
        name: name.toLowerCase(),
        image,
      });
      await newCategory.save();

      res.json({message: "Category created successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  updateCategory: async (req: Request, res: Response) => {
    try {
      const {name, image} = req.body;

      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(400).json({message: "Category does not exists."});
        return;
      }

      if (name) category.name = name.toLowerCase();
      if (image) category.image = image;
      await category.save();

      res.json({message: "Category updated successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
  deleteCategory: async (req: Request, res: Response) => {
    try {
      const question = await Question.findOne({category: req.params.id});
      if (!question) {
        res.status(400).json({
          message: "Please delete all question of this category first.",
        });
        return;
      }

      await Category.findByIdAndDelete(req.params.id);

      res.json({message: "Category deleted successfully."});
      return;
    } catch (error: any) {
      res.status(500).json({message: error.message});
      return;
    }
  },
};

export default categoryCtrl;
