


const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  value: { type: String,required: true },
  imageUrl: { type: Number, required: true },


},{timeStamps:true});


module.exports = mongoose.model('Categories', categorySchema);