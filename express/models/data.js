// data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
	{
		id: { type: Number, required: true },
		text: { type: String, required: true },
		videoname: { type: String, required: true },
		counts: { type: Number, required: true }, // 记录这条数据被标注的次数
	},
	{ collection: "Data" }
);

const Data = mongoose.model("Data", DataSchema);

const findData = () => {
	return Data.findOne({ counts: 0 }) // 查找第一个 counts === 0 的文档
		.exec() // 执行查询，返回一个Promise
		.then((data) => { // 处理查询结果
			if (data) { 
				return data;
			} else {
				return Data.aggregate([{ $sample: { size: 1 } }]).exec(); // 从集合中随机返回一条数据
			}
		});
};

module.exports = { Data, findData };
