// data.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DataSchema = new Schema({
    id: { type: Number, required: true },
    text: { type: String, required: true },
    videoname: { type: String, required: true },
    counts: { type: Number, required: true }, // 记录这条数据被标注的次数
}, { collection: 'Data' });

const Data = mongoose.model('Data', DataSchema); 

const findData = () => {
    // 优先返回 counts 为 0 的数据，如果没有则返回任意一条数据，
    return Data.findOne({ counts: 0 }).exec();
}

module.exports = { Data, findData };