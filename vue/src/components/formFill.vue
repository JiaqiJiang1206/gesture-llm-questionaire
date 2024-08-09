<template>
	<div class="container" style="max-width: 100vw">
		<div class="column_left">
			<div class="one_block_left">
				<p style="padding-left: 2%; font-size: 18px; font-weight: bold">
					👇请模仿并录制视频中教师手势，提交录制后填写问卷<br />
				</p>
			</div>
			<div class="one_block_left" style="margin-top: 2%">
				<div
					class="green-card-instruction"
					style="
						padding-left: 2%;
						font-size: 16px;
						margin-top: 2%;
						margin-bottom: 2%;
					"
				>
					📄视频录制说明：<br />
					1️⃣
					练习直到满意，练习与录制时请让上半身（包含头部与手部）出现在镜头中，您与摄像头需要保持约一臂的距离
					<br />
					2️⃣ 点击开始录制，我们有三秒的倒计时321 <br />
					3️⃣ 模仿视频中教师的行为：包含教师所说的话与教师的动作 <br />
					4️⃣ 点击停止录制 <br />
					5️⃣ 满意请点击提交，不满意可点击重录<br />
				</div>
			</div>
			<div class="one_block_left">
				<p
					id="text_content"
					style="padding-left: 2%; font-size: 18px; font-weight: bold"
				>
					{{ "“" + teaching_text + "”" }}<br />
				</p>
			</div>
			<div class="video-wrapper form-element">
				<video
					id="videoPlayer"
					controls
					:src="teacher_video"
					style="width: 100%; height: 100%; padding-left: 6%"
				></video>
			</div>
		</div>
		<div class="column_right" style="padding-left: 8%">
			<bodyRecognize v-if="showFlag" @complete-body-record="switchShow" />
			<!-- 表单 -->
			<form v-else class="form-element">
				<div
					style="
						display: flex;
						overflow: scroll;
						flex-direction: column;
						max-height: 80vh;
						padding: 1%;
					"
				>
					<!-- 开始词与结束词 -->
					<div class="one_block">
						<h2 style="font-size: 18px; font-weight: bold; padding: 0.3% 0%">
							❇️选择视频中教师手势起始时对应的字与结束时对应的字 ：
						</h2>
						<wordSelect
							:words="teaching_text"
							v-model="startAndEndIndex"
						></wordSelect>
					</div>

					<!-- 手势形式 -->
					<div class="one_block">
						<div style="padding: 2% 0%; padding-top: 3.5%">
							<p style="font-size: 18px; font-weight: bold; display: inline">
								❇️请尽可能详细地描述视频中教师的手势 : <br />
							</p>
							<p
								style="
									display: inline;
									text-align: left;
									font-weight: lighter;
									font-size: 14px;
								"
							>
								例1：左手放在原位，右手食指伸出，在空中点击三下。<br />例2：双手十指交叉放在胸前。
							</p>
						</div>
						<voice-button v-model="gesForm"></voice-button>
					</div>

					<!-- 手势理由 -->
					<div class="one_block">
						<div style="padding: 2% 0%; padding-top: 3.5%">
							<p style="font-size: 18px; font-weight: bold; display: inline">
								❇️您认为教师为什么选择使用这样的手势 : <br />
							</p>
						</div>
						<voice-button v-model="gesReason"></voice-button>
					</div>
					<!-- 具身选择 -->
					<!-- 单手还是双手 -->
					<div class="one_block">
						<div style="padding: 2% 0%; padding-top: 3.5%">
							<p style="font-size: 18px; font-weight: bold; display: inline">
								❇️这个手势是用单手还是双手完成的？<br />
							</p>
						</div>
						<input
							type="radio"
							id="ok"
							name="choice1"
							value="单手"
							class="singleoptionkx-input"
						/>
						<label class="singleoptionkx" for="ok" @click="selectHand"
							>单手</label
						>

						<input
							type="radio"
							id="no-ok"
							name="choice1"
							value="双手"
							class="singleoptionkx-input"
						/>
						<label class="singleoptionkx" for="no-ok" @click="selectHand"
							>双手</label
						>
					</div>
					<!-- 是否拿着物品 -->
					<div class="one_block">
						<div style="padding: 2% 0%; padding-top: 3.5%">
							<p style="font-size: 18px; font-weight: bold; display: inline">
								❇️教师手中是否拿着物品？<br />
							</p>
						</div>
						<input
							type="radio"
							id="no-object"
							name="choice3"
							value="未拿物品"
							class="singleoptionkx-input"
						/>
						<label class="singleoptionkx" for="no-object" @click="inputObject"
							>未拿物品</label
						>

						<input
							type="radio"
							id="have-object"
							name="choice3"
							value="拿着物品"
							class="singleoptionkx-input"
						/>
						<label class="singleoptionkx" for="have-object" @click="inputObject"
							>拿着物品
						</label>
						<div v-if="showMultipleSelect">
							<label for="dependency">请选择所拿的物品：</label>
							<br />
							<input type="checkbox" id="mic" />
							<label for="mic">麦克风</label><br />

							<input type="checkbox" id="book" />
							<label for="book">书本</label><br />

							<input type="checkbox" id="pen" />
							<label for="pen">笔</label><br />

							<input type="checkbox" id="others" />
							<label for="others">其他</label><br />
						</div>
					</div>
					<!-- 是否依赖物品 -->
					<div class="one_block">
						<div style="padding: 2% 0%; padding-top: 3.5%">
							<p style="font-size: 18px; font-weight: bold; display: inline">
								❇️这个手势是否依赖教室中的某件物品？<br />
							</p>
						</div>
						<input
							type="radio"
							id="dependency"
							name="choice2"
							value="依赖"
							class="singleoptionkx-input"
						/>
						<label
							class="singleoptionkx"
							for="dependency"
							@click="selectDependency"
							>依赖</label
						>

						<input
							type="radio"
							id="no-dependency"
							name="choice2"
							value="不依赖"
							class="singleoptionkx-input"
						/>
						<label
							class="singleoptionkx"
							for="no-dependency"
							@click="selectDependency"
							>不依赖</label
						>
						<div v-if="ifDependency">
							<br />
							<label for="dependency">如果依赖，请输入所依赖的物品：</label>
							<input
								type="text"
								id="obj"
								style="width: 95%; height: 30px; font-size: 16px; border: solid"
							/>
						</div>
					</div>
					<!-- 任务负荷量 -->
					<div class="one_block">
						<div style="padding: 2% 0%; padding-top: 3.5%">
							<p style="font-size: 18px; font-weight: bold; display: inline">
								❇️任务负荷量表<br />
							</p>
							<p
								style="
									display: inline;
									text-align: left;
									font-weight: lighter;
									font-size: 14px;
								"
							>
							完成这个手势需要多大程度的体力活动？这个过程是轻松、缓慢的、不费力的、可喘息的？还是有挑战性、迅速的、费力的、劳累的？
							</p>
						</div>
						<div class="physical-container">
							<div class="scale">
								<template v-for="i in 21" :key="i">
									<div :class="['line', i % 2 === 1 ? 'long' : 'short']"></div>
									<div
										v-if="i < 21"
										class="segment"
										:data-value="i - 1"
										@click="handleSegment(i - 1)"
									></div>
								</template>
							</div>
						</div>
						<div style="display: flex; justify-content: space-between; transform: translateX(-3%) translateY(-40%);">
							<span class="label-low">非常低</span>
							<span class="label-high">非常高</span>
						</div>
					</div>
					<div class="button_container">
						<button @click.prevent="next_page" class="next_button" id="next">
							下一个
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
	import voiceButton from "../components/voiceButton.vue";
	import wordSelect from "../components/wordSelect.vue";
	import { nextTick, onMounted, ref } from "vue";
	// 获取数据
	import axios from "../api/axios";
	import { useRouter } from "vue-router";
	import {
		userGlobalData,
		currentDataText,
		currentDataIndex,
	} from "../stores/store";
	import bodyRecognize from "../components/bodyRecognize.vue";

	let showFlag = ref(true);
	let showMultipleSelect = ref(false);

	function switchShow() {
		console.log("提交录制结果，切换显示。");
		showFlag.value = !showFlag.value;
	}

	// 获取用户的名字
	const userName = userGlobalData.value.name;

	const router = useRouter();
	let formData = {};
	let teaching_text = ref("");
	let teacher_video = ref("");
	let temp = "";
	// 任务负荷
	let taskLoad = 0;

	function handleSegment(index) {
		// 设置第 index 个 segment 背景为灰色
		
		taskLoad = index + 1;
		console.log('taskLoad', taskLoad);
		const segments = document.querySelectorAll(".segment");
		segments.forEach((segment, i) => {
			if (i === index) {
				segment.classList.add("active");
			} else {
				segment.classList.remove("active");
			}
		});
	}

	// 获取并解析数据
	// axios.get("https://teachernonverbal.asia/data").then((res) => {
	// axios.get("/data").then((res) => {
	// 	// 传输过来的数据是一个对象
	// 	formData = res.data;
	// 	console.log(formData);
	// 	// 去掉 formData.text 中的空格
	// 	temp = formData.text.replace(/\s+/g, "");
	// 	teaching_text.value = temp;
	// 	// 转换 base64 编码的视频为视频路径
	// 	currentDataText.value = temp; // 传递数据到 store
	// 	currentDataIndex.value = formData.id;
	// 	teacher_video.value = base64UrlToFile(
	// 		formData.video,
	// 		"video.mp4",
	// 		"video/mp4"
	// 	);
	// });

	// 选择的开始词索引和结束词索引
	const startAndEndIndex = ref({ startIndex: -1, endIndex: -1 });
	let startWord = "";
	let endWord = "";

	// 手势形式和手势理由
	const gesForm = ref("");
	const gesReason = ref("");

	// 一只手还是两只手
	let oneOrTwoHand = "";
	function selectHand(event) {
		console.log(event.target.innerText);
		oneOrTwoHand = event.target.innerText;
	}

	// 是否拿着物品以及拿了什么物品
	let whatObject = [];
	let inputObjectFlag = false; // 判断 inputObject 事件是否触发
	function inputObject(event) {
		inputObjectFlag = true;
		console.log(event.target.innerText);
		let temp = event.target.innerText;
		if (temp === "拿着物品") {
			showMultipleSelect.value = true; //
		} else {
			showMultipleSelect.value = false;
			whatObject = [];
		}
	}

	// 是否依赖物品以及依赖什么物品
	let ifDependency = ref(false);
	let inputDependencyFlag = false; // 判断 inputDependency 事件是否触发
	function selectDependency(event) {
		inputDependencyFlag = true;
		console.log(event.target.innerText);
		let temp = event.target.innerText;
		if (temp === "依赖") {
			ifDependency.value = true;
		} else {
			ifDependency.value = false;
		}
	}

	// 点击下一个按钮需要处理的逻辑
	let curPage = 0;
	function next_page() {
		console.log("startAndEndIndex", startAndEndIndex.value);
		startWord = teaching_text.value[startAndEndIndex.value.startIndex];
		endWord = teaching_text.value[startAndEndIndex.value.endIndex];
		console.log("开始词", startWord);
		console.log("结束词", endWord);
		console.log("手势描述", gesForm.value);
		console.log("手势理由", gesReason.value);
		// 打印出当前元素位于列表中第几位

		// 循环查找拿着的物品中 checkbox 为 true 的物品放入数组中
		let checkboxes = document.querySelectorAll("input[type=checkbox]");
		checkboxes.forEach((checkbox) => {
			if (checkbox.checked) {
				whatObject.push(checkbox.nextElementSibling.innerText);
			}
		});

		// 判断是否填写完整

		if (
			gesForm.value === "" ||
			gesReason.value === "" ||
			startWord === "" ||
			endWord === "" ||
			// 判断是否选择了单手或双手
			oneOrTwoHand === "" ||
			// 判断是否选择了是否拿着物品
			!inputObjectFlag ||
			// 如果拿着物品，判断是否选择了所拿的物品
			(showMultipleSelect.value && whatObject.length === 0) ||
			// 判断是否选择了是否依赖物品
			!inputDependencyFlag ||
			// 如果依赖物品，判断是否输入了依赖的物品
			(ifDependency.value && document.getElementById("obj").value === "")
		) {
			alert("请填写完整的问卷再点击下一个");
		} else {
			// 发送数据到服务端
			const tobesent = {
				id: currentDataIndex.value,
				text: formData.text,
				user: userName,
				start_end_word: [startWord, endWord],
				description: gesForm.value,
				reason: gesReason.value,
				oneOrTwoHand: oneOrTwoHand,
				object: whatObject,
				dependencyObject: ifDependency.value
					? document.getElementById("obj").value
					: "null",
				taskLoad: taskLoad,
			};
			console.log(tobesent);
			// 发送数据
			axios
				.post(
					// "https://teachernonverbal.asia/submit",
					"/submit",
					JSON.stringify(tobesent),
					{
						headers: {
							"Content-Type": "application/json",
						},
					}
				)
				.then((res) => {
					console.log(res.data);
					// 清空数据
					gesForm.value = "";
					gesReason.value = "";
					startAndEndIndex.value = { startIndex: -1, endIndex: -1 };
					showFlag.value = !showFlag.value;
					whatObject = [];
					showMultipleSelect.value = false;
					inputObjectFlag = false;
					inputDependencyFlag = false;
					ifDependency.value = false;
					oneOrTwoHand = "";
					// 任务负荷量
					taskLoad = 0;
					// 清除选项状态
					document.querySelectorAll("input[type=radio]").forEach((radio) => {
						radio.checked = false;
					});
					document
						.querySelectorAll("input[type=checkbox]")
						.forEach((checkbox) => {
							checkbox.checked = false;
						});

					// 下一页
					curPage++;
					console.log("当前页数", curPage);
					if (curPage === 20) {
						router.push({
							path: "/endPage",
						});
					} else {
						// 切换到下一个数据
						// 获取并解析数据
						setTimeout(() => {
							// 为了等待数据加载完成
							axios.get("/data").then((res) => {
								// 传输过来的数据是一个对象
								formData = res.data;
								console.log(formData);
								// 去掉 formData.text 中的空格
								temp = formData.text.replace(/\s+/g, "");
								teaching_text.value = temp;
								currentDataText.value = temp; // 传递数据到 store
								currentDataIndex.value = formData.id;
								// 转换 base64 编码的视频为视频路径

								teacher_video.value = base64UrlToFile(
									formData.video,
									"video.mp4",
									"video/mp4"
								);
							});
						}, 500);
					}
				});
		}
	}
	// 将 base64 转为视频文件
	function base64UrlToFile(base64Data, filename, type) {
		var byteArray = [];
		var contentType = type || "video/mp4";
		var byteArray = atob(base64Data); // 去除"data:type/subtype;base64,"部分，只处理base64编码部分
		var arrayBuffer = new Uint8Array(byteArray.length);
		for (var i = 0; i < byteArray.length; i++) {
			arrayBuffer[i] = byteArray.charCodeAt(i);
		}
		var blob = new Blob([arrayBuffer], { type: contentType });
		let file = new File([blob], filename, { type: contentType });
		let videoUrl = URL.createObjectURL(file);
		console.log(videoUrl);
		return videoUrl;
	}
	// 具身数据处理逻辑

	// 可否单手 任务负荷 依赖

	onMounted(() => {
		// handleSlider();
	});
</script>

<style scoped>
	/* Your CSS goes here */
	.container {
		display: grid;
		grid-template-columns: minmax(40%, 45%) 1fr;
		padding-top: 2%;
	}

	.one_block_left {
		width: 92%;
		border: 0.2px solid #60744879;
		background-color: #fff;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s ease;
		border-radius: 5px;
		margin-bottom: 2%;
		margin-left: 6%;
		padding: 2%;
		text-align: left;
	}

	/* 隐藏原始的单选按钮 */
	.one_block input[type="radio"] {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.option {
		cursor: pointer;
		display: inline-block;
		padding: 5px 5px;
		margin-right: 5px;
		border: 1px solid #607448;
		border-radius: 5px;
	}

	.option:hover {
		background-color: lightgray;
		cursor: pointer;
		font-weight: bold;
		color: black;
	}

	/* 设置选中时的样式 */
	.single_options input[type="radio"]:checked + .option {
		background-color: #607448;
		color: #fff;
	}

	/* 样式化外围的边框 */

	.one_block {
		width: 85%;
		padding-bottom: 2%;
		padding-top: 2%;
		padding-left: 6%;
		border: 0.2px solid #60744879;
		background-color: #fff;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s ease;
		border-radius: 5px;
		margin-bottom: 2%;
		text-align: left;
	}

	.text_block {
		width: 100%;
		padding-bottom: 1%;
		padding-top: 1%;
		/* padding-left: 6%; */
		border: 0.2px solid #60744879;
		background-color: #fff;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		transition: box-shadow 0.3s ease;
		border-radius: 5px;
		margin-bottom: 2%;
	}

	.button_container {
		display: flex;
		justify-content: center;
		width: 85%;
	}

	.next_button {
		background-color: #607448;
		color: white;
		border: none;
		padding: 1.5%;
		padding-left: 6%;
		text-align: center;
		font-size: 16px;
		cursor: pointer;
		border-radius: 5px;
		width: 100%;
	}

	.column_left {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* 具身选择的样式 */
	/* 设置选中时的样式 */
	.singleoptionkx {
		display: inline-block;
		border: 1px solid #607448;
		padding: 1%;
		border-radius: 8px;
	}

	.singleoptionkx:hover {
		background-color: lightgray;
		cursor: pointer;
		font-weight: bold;
		color: black;
	}

	.singleoptionkx-input:checked + .singleoptionkx {
		background-color: #607448;
		color: #fff;
	}

	.multioptionkx:hover {
		background-color: lightgray;
		cursor: pointer;
		font-weight: bold;
		color: black;
	}
	.physical-container {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10px;
		margin-bottom: 36px;
	}
	.scale {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
		height: 20px; /* Set a height for demonstration */
		border: solid 1px black;
		transform: translateX(-2%);
	}

	.line {
		width: 2px;
		background-color: black;
	}

	.line.long {
		height: 20px;
	}

	.line.short {
		height: 10px;
	}
	.segment {
		width: 11%; /* This sets the width of each segment to 10% of the parent (scale) */
		height: 20px;
		cursor: pointer;
	}

	.segment.active {
		background-color: gray;
	}
</style>
