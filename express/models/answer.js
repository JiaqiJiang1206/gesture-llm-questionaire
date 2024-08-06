const { text } = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Data } = require("./data");

const AnswerSchema = new Schema({
	text: { type: String, required: true },
	user: { type: String, required: true },
	description: { type: String, required: true },
	reason: { type: String, required: true },
	start_end_word: { type: Array, required: true },
	oneOrTwoHand: { type: String, required: true },
	object: { type: Array, required: true },
	dependencyObject: { type: String, required: true },
	taskLoad: { type: Number, required: true },
});

const Answer = mongoose.model("Answer", AnswerSchema);

// 添加条目
const addAnswer = async (jsonResult) => {
	// 将 jsonResult 的内容插入到数据库
	const answer = new Answer({
		id: jsonResult.id,
		text: jsonResult.text,
		user: jsonResult.user,
		description: jsonResult.description,
		reason: jsonResult.reason,
		start_end_word: jsonResult.start_end_word,
		oneOrTwoHand: jsonResult.oneOrTwoHand,
		object: jsonResult.object,
		dependencyObject: jsonResult.dependencyObject,
		taskLoad: jsonResult.taskLoad,
	});
	await answer.save();

	// 更新 Data 表中的 counts
	async function updateData(jsonResult) {
		try {

			console.log("id: " + jsonResult.id);
			await Data.updateOne({ id: jsonResult.id }, { $inc: { counts: 1 } });
			
		} catch (error) {
			console.error("Error updating data:", error);
		}
	}

	// Call the function and await its completion
	updateData(jsonResult);
};

// Export the model
module.exports = { Answer, addAnswer };
