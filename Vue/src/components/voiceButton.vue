<template>
	<div>
		<textarea
			rows="2"
			cols="60"
			v-model="recognizeText"
		></textarea>
		<div
			class="image-container"
			@click="startRecognition"
		>
			<img
				:src="startEndImage"
				alt="voice recognition"
			/>
		</div>
	</div>
</template>

<script setup>
	import { ref, defineModel } from "vue";
	import "../assets/voicejs/jquery";
	import "../assets/voicejs/speechrecognizer"; // TODO 记录一下这里的方法：https://stackoverflow.com/questions/76191154/the-requested-module-does-not-provide-an-export-named-default

	let config = {
		secretKey: "nUNCpJoBXmw32rU7d0FKDev8AC8wZ4Tt",
		secretId: "AKID1reH0vuHaihaqwqX7raBbpBZ9fHuWA0l",
		appId: 1320064243,
	};
	window.config = config;

	const startImage = new URL("../assets/img/voicestart.png", import.meta.url)
		.href;
	const endImage = new URL("../assets/img/voiceend.png", import.meta.url).href;

	let startEndImage = ref(startImage);
	let toStart = ref(true);
	let recognizeText = defineModel();

	const params = {
		// signCallback: signCallback, // 鉴权函数，若直接使用默认鉴权函数。可不传此参数
		// 用户参数
		secretid: config.secretId,
		secretkey: config.secretKey,
		appid: config.appId,
		// 临时密钥参数，非必填
		// token: config.token,
		// 实时识别接口参数
		engine_model_type: "16k_zh", // 因为内置WebRecorder采样16k的数据，所以参数 engineModelType 需要选择16k的引擎，为 '16k_zh'
		// 以下为非必填参数，可跟据业务自行修改
	};

	let webAudioSpeechRecognizer = new WebAudioSpeechRecognizer(params);
	recognizeText.value = "";

	function startRecognition() {
		if (!toStart.value) {
			// 隐藏结束识别图片，显示开始识别图片
			startEndImage.value = startImage;
			console.log("识别结束");
			toStart.value = true;
			webAudioSpeechRecognizer.stop();
		} else {
			webAudioSpeechRecognizer = new WebAudioSpeechRecognizer(params);
			recognizeText.value = "";
			webAudioSpeechRecognizer.OnRecognitionStart = (res) => {
				console.log("开始识别", res);
			};
			// 一句话开始
			webAudioSpeechRecognizer.OnSentenceBegin = (res) => {
				console.log("一句话开始", res);
			};
			// 识别变化时
			webAudioSpeechRecognizer.OnRecognitionResultChange = (res) => {
				console.log("识别变化", res);
				recognizeText.value = res.result.voice_text_str;
			};
			// 一句话结束
			webAudioSpeechRecognizer.OnSentenceEnd = (res) => {
				console.log("一句话结束", res);
				recognizeText.value = res.result.voice_text_str;
			};
			// 识别结束
			webAudioSpeechRecognizer.OnRecognitionComplete = (res) => {
				console.log("识别结束", res);
			};
			// 识别错误
			webAudioSpeechRecognizer.OnError = (res) => {
				console.log("识别失败", res);
			};
			// 隐藏开始识别图片，显示结束识别图片
			startEndImage.value = endImage;
			console.log("识别开始啦！");

			webAudioSpeechRecognizer.start();
			toStart.value = false;
		}
	}
</script>

<style scoped>
	textarea {
		width: 95%;
		font-size: 16px;
	}

	.image-container {
		display: flex;
		align-items: center; /* 垂直居中 */
		justify-content: center; /* 水平居中 */
		cursor: pointer;
	}

	img {
		width: 100px;
	}
</style>
