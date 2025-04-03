import mongoose, {Document} from "mongoose";

export interface ICategory extends Document {
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

const categorySchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true, unique: true},
    image: {type: Object, required: true},
  },
  {timestamps: true}
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
