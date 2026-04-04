import mongoose from "mongoose";

const blocklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "token is required to be aded in blocklist"],
    },
  },
  { timestamps: true },
);
const blocklistModel = new mongoose.model("blocklist", blocklistSchema);
export default blocklistModel;
