let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let CategorySchema = new Schema({
  name: { type: String, maxlength: 300, required: true },
  description: { type: String, maxlength: 300, required: true },
});

CategorySchema.virtual('url').get(function () {
  return '/catalog/category/' + this._id;
});

module.exports = mongoose.model('Category', CategorySchema);
