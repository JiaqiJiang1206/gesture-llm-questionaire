<template>
	<div class="body-container">
		<div class="body_button_container">
			<button id="exersizeWebcamButton" @click="toggleExersizeWebcam">
				{{ exersizeButton }}
			</button>
			<button id="webcamButton" @click="toggleWebcam">
				{{ buttonText }}
			</button>
			<button
				id="nextButton"
				@click="$emit('complete-body-record')"
				:style="{ display: ifSubmitButton }"
			>
				提交录制
			</button>
		</div>

		<video style="display: none" id="webcam" autoplay></video>
		<canvas id="output_canvas"></canvas>
	</div>
</template>

<script setup>
	// 引入 vue 组件相关
	import { onMounted, ref, nextTick } from "vue";
	// 引入手势识别相关
	import {
		HandLandmarker,
		FilesetResolver,
		PoseLandmarker,
	} from "../assets/handposejs/task_vision@0.10.1";
	import "../assets/handposejs/drawing_utils";
	import "../assets/handposejs/hands";
	import "../assets/handposejs/pose";
	// 导入数据收发相关
	import axios from "../api/axios";
	// 导入全局数据
	import {
		userGlobalData,
		currentDataText,
		currentDataIndex,
	} from "../stores/store";
	// 定义普通数据
	let handLandmarker = undefined;
	let runningMode = "VIDEO";
	let poseLandmarker = undefined;
	var bodyRecognizeTimer;
	let oneHand = undefined;
	let theOtherHand = undefined;
	let pose = undefined;
	let counts = 0; //记录当前是第几次录制
	let exersizeCounts = 0; // 记录当前是第几次练习
	let lastVideoTime = -1;
	let results = undefined;
	let poseResults = undefined;
	let countdownInterval;
	let animatedFrameId;
	let allBodyResults; // 所有的身体数据
	// 定义响应式数据
	let webcamRunning = ref(false);
	let buttonText = ref("开始录制");
	let exersizeButton = ref("开始练习");
	let ifSubmitButton = ref("none"); // 是否显示提交按钮
	let video = ref(null);
	let canvasElement = ref(null);
	let canvasCtx = ref(null);

	// 初始化手部检测器
	async function createHandLandmarker() {
		const vision = await FilesetResolver.forVisionTasks(
			"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
			// "../../node_modules/@mediapipe/tasks-vision/wasm"
		);
		handLandmarker = await HandLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
				delegate: "GPU",
			},
			runningMode: runningMode,
			numHands: 2,
		});
		poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
			baseOptions: {
				modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
				delegate: "GPU",
			},
			runningMode: runningMode,
			numPoses: 2,
		});
	}
	// 挂载后执行
	onMounted(async () => {
		await createHandLandmarker();
		await nextTick();

		video.value = document.getElementById("webcam");
		canvasElement.value = document.getElementById("output_canvas"); // 创建画布
		canvasCtx.value = canvasElement.value.getContext("2d");
	});

	// 检查是否有摄像头
	const hasGetUserMedia = () => {
		return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
	};

	// 如果没有摄像头，提示用户
	if (!hasGetUserMedia()) {
		alert(
			"Your browser cannot stream from your webcam. Please switch to Chrome."
		);
	}

	// 倒计时和开始录制的逻辑
	function startCountdownAndRecording() {
		let countdown = 3; // Starting countdown value

		// 画倒计时的方法
		function drawCountdown() {
			document.getElementById("output_canvas").style.transform = "scaleX(1)";
			canvasCtx.value.clearRect(
				0,
				0,
				canvasElement.value.width,
				canvasElement.value.height
			); // Clear the canvas
			canvasCtx.value.font = "48px serif";
			canvasCtx.value.textAlign = "center";
			canvasCtx.value.textBaseline = "middle";
			console.log("countdown: ", countdown);
			canvasCtx.value.fillText(
				countdown,
				canvasElement.value.width / 2,
				canvasElement.value.height / 2
			);
		}

		// 更新倒计时的方法
		function updateCountdown() {
			countdown--;
			if (countdown > 0) {
				drawCountdown();
			} else {
				clearInterval(countdownInterval); // Stop the countdown
				canvasCtx.value.clearRect(
					0,
					0,
					canvasElement.value.width,
					canvasElement.value.height
				); // Clear the canvas

				console.log("第" + counts + "次录制开始");
				activateWebcamAndRecord(); // 激活摄像头并开始录制
			}
		}

		// Initial draw
		drawCountdown();
		// Update countdown every second
		countdownInterval = setInterval(updateCountdown, 1000);
	}

	// 激活摄像头并开始录制的逻辑
	function activateWebcamAndRecord() {
		// document.getElementById("webcamButton").style.display = "block"; // 显示按钮
		// 激活摄像头代码，例如之前的 getUserMedia 调用
		navigator.mediaDevices
			.getUserMedia({
				video: true,
				video: { width: 1280, height: 720 }
			})
			.then((stream) => {
				video.value.srcObject = stream;
				video.value.onloadedmetadata = () => {
					video.value.play();
					canvasElement.value.width = video.value.videoWidth;
					canvasElement.value.height = video.value.videoHeight;
					canvasElement.value.style.display = "block";
					canvasCtx.value.fillStyle = "#000000";
					console.log('video.value.videoWidth', video.value.videoWidth);
					console.log('video.value.videoHeight', video.value.videoHeight);

					canvasCtx.value.fillRect(
						0,
						0,
						canvasElement.value.width,
						canvasElement.value.height
					);
					webcamRunning.value = true;
					// toggleWebcam(); // 开始录制
					predictWebcam();
				};
			});
		// 显示画布以及启动定时器的其余代码
		// 0.1 秒钟记录一次
		bodyRecognizeTimer = setInterval(() => {
			if (oneHand || theOtherHand || pose) {
				sendPoseDataToDerver(oneHand, theOtherHand, pose);
			}
		}, 100);
	}

	// 点击按钮，开始录制或结束录制
	function toggleWebcam(event) {
		// 点击开始录制与结束录制按钮后视觉元素发生的变化
		function toggleButtonText() {
			if (webcamRunning.value === true) {
				buttonText.value = "停止录制";
				document.getElementById("webcamButton").style.backgroundColor = "white";
				document.getElementById("webcamButton").style.color = "#607448";
				document.getElementById("webcamButton").style.border = "solid";
			} else {
				if (counts > 0) {
					buttonText.value = "重新录制";
					document.getElementById("webcamButton").style.backgroundColor =
						"#607448";
					document.getElementById("webcamButton").style.color = "white";
					document.getElementById("webcamButton").style.border = "solid";
				}
			}
		}
		if (!handLandmarker) {
			alert("请等待资源加载完成～");
			return;
		}
		// 当摄像头正在运行时，点击按钮会停止录制
		if (webcamRunning.value === true) {
			webcamRunning.value = false;
			console.log("第" + counts + "次录制结束");
			ifSubmitButton.value = "block";
			document.getElementById("exersizeWebcamButton").style.display = "block"; // 显示练习按钮
			toggleButtonText(); // 切换按钮文字：停止录制 -> 开始录制
			// 关闭摄像头
			if (video.value.srcObject) {
				video.value.srcObject.getVideoTracks().forEach((track) => {
					track.stop();
				});
				// 清除画布
				canvasCtx.value.clearRect(
					0,
					0,
					canvasElement.value.width,
					canvasElement.value.height
				);
				// 隐藏画布
				// canvasElement.value.style.display = "none";

				// 清除计时器
				window.clearInterval(bodyRecognizeTimer);
				window.cancelAnimationFrame(animatedFrameId);
			}
		} else {
			counts++; // 记录录制次数
			webcamRunning.value = true; // 切换摄像头状态
			ifSubmitButton.value = "none"; // 隐藏提交按钮
			document.getElementById("exersizeWebcamButton").style.display = "none"; // 隐藏练习按钮
			toggleButtonText(); // 切换按钮文字：开始录制 -> 停止录制
			// 当摄像头没有运行时，点击按钮会开始录制
			startCountdownAndRecording();
		}
	}

	// 点击按钮，开始练习或结束练习
	function toggleExersizeWebcam(event) {
		// 点击开始录制与结束录制按钮后视觉元素发生的变化
		function toggleButtonText() {
			if (webcamRunning.value === true) {
				exersizeButton.value = "停止练习";
				document.getElementById("exersizeWebcamButton").style.backgroundColor =
					"white";
				document.getElementById("exersizeWebcamButton").style.color = "#607448";
				document.getElementById("exersizeWebcamButton").style.border = "solid";
			} else {
				exersizeButton.value = "再次练习";
				document.getElementById("exersizeWebcamButton").style.backgroundColor =
					"#607448";
				document.getElementById("exersizeWebcamButton").style.color = "white";
				document.getElementById("exersizeWebcamButton").style.border = "solid";
			}
		}
		if (!handLandmarker) {
			alert("Hand Landmarker is not loaded yet!");
			return;
		}
		// 当摄像头正在运行时，点击按钮会停止录制
		if (webcamRunning.value === true) {
			webcamRunning.value = false;
			console.log("第" + exersizeCounts + "次练习结束");
			document.getElementById("webcamButton").style.display = "block"; // 显示录制按钮
			toggleButtonText(); // 切换按钮文字：停止录制 -> 开始录制
			// 关闭摄像头
			if (video.value.srcObject) {
				video.value.srcObject.getVideoTracks().forEach((track) => {
					track.stop();
				});
				// 清除画布
				canvasCtx.value.clearRect(
					0,
					0,
					canvasElement.value.width,
					canvasElement.value.height
				);
				// 隐藏画布
				// canvasElement.value.style.display = "none";

				// 清除计时器
				window.clearInterval(bodyRecognizeTimer);
				window.cancelAnimationFrame(animatedFrameId);
			}
		} else {
			exersizeCounts++;
			webcamRunning.value = true; // 切换摄像头状态
			ifSubmitButton.value = "none"; // 隐藏提交按钮
			document.getElementById("webcamButton").style.display = "none"; // 隐藏录制按钮
			toggleButtonText(); // 切换按钮文字：开始练习 -> 停止练习
			activateWebcamAndRecord(); // 激活摄像头并开始录制
			window.clearInterval(bodyRecognizeTimer);
		}
	}

	// 画关节点
	async function predictWebcam() {
		// Now let's start detecting the stream.
		document.getElementById("output_canvas").style.transform = "scaleX(-1)";
		if (video.value) {
			let startTimeMs = performance.now();
			if (lastVideoTime !== video.value.currentTime) {
				lastVideoTime = video.value.currentTime;
				// results = handLandmarker.detectForVideo(video.value, startTimeMs);
				Promise.all([
					handLandmarker.detectForVideo(video.value, startTimeMs),
					poseLandmarker.detectForVideo(video.value, startTimeMs),
				]).then((theResults) => {
					console.log(theResults);
					allBodyResults = theResults;
					results = theResults[0];
					poseResults = theResults[1];
				});
			}
			// canvasCtx.value.save();
			// 清除画布
			canvasCtx.value.clearRect(
				0,
				0,
				canvasElement.value.width,
				canvasElement.value.height
			);
			// 将 video 画到 canvas 上
			// canvasCtx.value.drawImage(
			// 	video.value,
			// 	0,
			// 	0,
			// 	canvasElement.value.width,
			// 	canvasElement.value.height
			// );

			if (results && poseResults && webcamRunning.value) {
				// 画手部关节及连线
				for (const landmarks of results.landmarks) {
					// console.log(canvasCtx.value);
					// 画关节线
					drawConnectors(canvasCtx.value, landmarks, HAND_CONNECTIONS, {
						color: "#00FF00",
						lineWidth: 1,
					});
					// 画关节点
					drawLandmarks(canvasCtx.value, landmarks, {
						color: "#FF0000",
						lineWidth: 1,
						radius: 2,
					});
				}
				// 画身体关节及连线
				for (const landmarks of poseResults.landmarks) {
					// console.log(canvasCtx.value);
					// 画关节线
					drawConnectors(canvasCtx.value, landmarks, POSE_CONNECTIONS, {
						color: "#00FF00",
						lineWidth: 1,
					});
					// 画关节点
					drawLandmarks(canvasCtx.value, landmarks, {
						color: "#FF0000",
						lineWidth: 1,
						radius: 2,
					});
				}
				oneHand = results.landmarks[0];
				theOtherHand = results.landmarks[1];
				pose = poseResults.landmarks[0];
			}
			canvasCtx.value.restore();

			animatedFrameId = window.requestAnimationFrame(predictWebcam);
		}
	}

	// 将结果发送到 Express 服务器
	function sendPoseDataToDerver(oneHandData, theOtherHandData, PoseData) {
		const bodyAndOtherData = {
			counts: counts,
			userName: userGlobalData.value.name,
			currentDataText: currentDataText.value,
			id: currentDataIndex.value,
			// oneHandData: oneHandData,
			// theOtherHandData: theOtherHandData,
			// PoseData: PoseData,
			allBodyResults: allBodyResults
		};
		// 将数据发送到服务器
		axios
			// .post("https://teachernonverbal.asia/savePoseData", {
			.post("/savePoseData", bodyAndOtherData)
			.then((res) => {
				// console.log("canvasElement.value.width:", canvasElement.value.width);
				// console.log("canvasElement.value.height", canvasElement.value.height);
				// console.log("PoseData", PoseData);
			})
			.catch((err) => {
				console.log(err);
			});
	}
</script>

<style>
	#webcam {
		transform: scaleX(-1);
		height: 100%;
	}

	/* #liveView {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	} */
	#output_canvas {
		margin-top: 2%;
		height: 640px;
		width: 480px;
		transform: scaleX(-1);
		border: 2px solid #60744879;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s ease;
	}

	.body_button_container {
		display: flex;
		width: 100%;
		border: none;
		padding: 1%;
		justify-content: space-around;
	}

	#webcamButton,
	#exersizeWebcamButton,
	#nextButton {
		background-color: #607448;
		color: white;
		border: none;
		padding: 1%;
		text-align: center;
		font-size: 16px;
		cursor: pointer;
		border-radius: 5px;
		width: 30%;
	}

	.body-container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
