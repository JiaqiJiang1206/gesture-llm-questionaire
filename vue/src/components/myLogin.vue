<template>
	<div id="before-login">
		<div id="icon-wrapper">
			<img id="icon" src="../assets/img/ruler.png" /><!-- 使用图片作为 icon -->
			<div id="line"></div>
			<!-- 添加连接线 -->
		</div>
		<!-- <h1>Login</h1> -->
		<input type="text" v-model="userInput" placeholder="请输入姓名" />
		
		<input type="text" v-model="contactInput" placeholder="请输入联系方式" />
		
		<select v-model="selectGender">
			<option v-for="option in gender" :key="option" :value="option">{{ option }}</option>
		</select>
		
		<input type="number" v-model="ageInput" placeholder="请输入年龄" />
		
		<input type="text" v-model="gradeInput" placeholder="请输入所教年级，如：小学三年级" />
		
		<input v-model="coursesInput" placeholder="请输入所教课程，如：英语"></input>
		
		<button @click="login">登录</button>
	</div>
</template>

<script setup>
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import { userGlobalData } from "../stores/store";
	import axios from "../api/axios";
	let userInput = ref("");
	let contactInput = ref("");
	let ageInput = ref("");
	let gradeInput = ref("");
	let coursesInput = ref("");
	const router = useRouter();

	const gender = ["请选择您的性别","男", "女"];
	const selectGender = ref(gender[0]);

	
	const login = () => {
		if (!userInput.value || !contactInput.value || !ageInput.value || !gradeInput.value || !coursesInput.value) {
			alert("请将表单填写完毕～")
			return;
		}
		userGlobalData.value = {
			name: userInput.value,
			contact: contactInput.value,
			gender: selectGender.value,
			age: ageInput.value,
			grade: gradeInput.value,
			courses: coursesInput.value,
		};
		console.log(userGlobalData.value);
		// 发送信号到后端存储用户数据
		axios.post('/user',userGlobalData.value)
		.then(()=>{
			console.log('用户数据发送');
		}).catch((err)=>{
			console.log('用户数据发送出错：',err);
		})
		// 前端路由跳转
		router.push({
			path: "/formFill"
		});
	};
</script>


<style scoped>
	/*以下全都是登录的css样式*/

	#before-login {
		background-color: #f0f0f0;
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease-in-out;
		max-width: 400px;
		width: 100%;
		text-align: center;
		position: absolute;
		top: 30%;
		left: 35%;
		margin: auto;
	}

	#before-login:hover {
		transform: scale(1.05);
	}

	#before-login input,
	#before-login button,
	#before-login select,
	#before-login textarea {
		width: 100%;
		margin-bottom: 10px;
		padding: 10px;
		box-sizing: border-box;
		font-size: 16px;
	}

	#before-login button {
		background-color: #4caf50;
		color: white;
		border: none;
		padding: 10px 20px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 5px;
	}

	/* 添加 icon 样式 */
	#icon-wrapper {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 30px;
		height: 30px;
		animation: swingIcon 4s infinite linear;
		transform-origin: top right;
	}

	#icon {
		position: absolute;
		top: 20px;
		right: -3px;
		width: 100%;
		height: 100%;
		transform: rotate(-10deg);
	}

	#line {
		position: absolute;
		top: -10px;
		right: 0;
		width: 2px;
		height: 30px;
		background-color: black;
		transform-origin: top right;
	}

	/* 定义 icon 动画 */
	@keyframes swingIcon {
		0% {
			transform: rotate(30deg);
		}

		50% {
			transform: rotate(-30deg);
		}

		100% {
			transform: rotate(30deg);
		}
	}

	@keyframes noname {
		0% {
			transform: translateY(0) scale(1);
		}

		100% {
			transform: translateY(-200px) scale(1.5);
		}
	}
</style>

