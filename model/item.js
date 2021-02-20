let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ItemSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 200 },
  img_url:{type:String,required:false},
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  imdb: { type: Number, required: true, max: 10, min: 0 },
});

ItemSchema.virtual('url').get(function () {
  return '/catalog/item/' + this._id;
});

module.exports = mongoose.model('Item', ItemSchema);
