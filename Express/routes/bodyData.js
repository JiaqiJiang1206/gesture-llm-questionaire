let express = require("express");
const fs = require("fs");
const path = require("path");
let router = express.Router();
let bodyData;
let bodyStringData;
let preCount = 0;

router.post("/savePoseData", function (req, res, next) {
	try {
        console.log('save data');
		// 处理收到的数据
		JsonData = req.body; // 收到的数据格式为 JSON，是个对象
        let count = JsonData.counts;
        // 去掉 Json 中的 counts
        delete JsonData.count;
        let userName = JsonData.userName;
        // 将 userName 转为字符串,去掉引号
        let userNameString = JSON.stringify(userName).replace(/\"/g, "");
        let presentTime = Date.now();
        // 将 presentTime 放入 JsonData 中
        JsonData.presentTime = presentTime;
        bodyStringData = JSON.stringify(JsonData, null, 2); // 将 JSON 对象转为字符串
		let currentIndex = JsonData.id;
        
		if (bodyStringData) {
			// 定义文件名
            const fileName = "bodyData/" + userNameString + "_" + currentIndex + ".json";
            // 如果当前计数器比之前的大，说明重新录制过
            if(count > preCount){
                preCount = count;
                // 清空文件中内容
                fs.writeFile(fileName, "", (err) => {
                    if(err){
                        console.error('文件写入出错',err);
                    }else{
                        console.log('文件写入成功');
                    }
                });
            }
            if(count === preCount){
                // 保存数据
                continueJsonFile(fileName, bodyStringData);
            }
		}
		res.send("收到数据啦");
	} catch (error) {
		console.error("出错啦", error);
	}
});

// 定义一个续写 json 文件的函数，stringData 的类型为 string
function continueJsonFile(fileName, stringData) {
	fs.readFile(fileName, "utf-8", (err, fileContent) => {
        // 处理报错
		if (err && err.code !== "ENOENT") {
			console.error("Error reading file", err);
			return;
		}
		// 处理文件不存在
		if (err && err.code == "ENOENT") {
			// 新建文件
			
            console.log('文件不存在，尝试新建');
            stringData = '[' + stringData + ']';
			fs.writeFile(fileName, stringData, (err) => {
                if(err){
                    console.error('文件写入出错',err);
                }else{
                    console.log('文件写入成功');
                }
            });
            return;
		}
		
        // 将字符串数据追加到文件内容后面
		stringData = fileContent.slice(0, -1) + "," + stringData + "\n]";
		
		// 写入原文件
		fs.writeFile(fileName, stringData, (writeErr) => {
			if (writeErr) {
				console.error("Error writing to file", writeErr);
			} else {
				console.log("Succesfully appending data to file", fileName);
			}
		});
	});
}

module.exports = router;
