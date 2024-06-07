<template>
	<div id="before-login">
		<div id="icon-wrapper">
			<img
				id="icon"
				src="../assets/img/ruler.png"
			/><!-- 使用图片作为 icon -->
			<div id="line"></div>
			<!-- 添加连接线 -->
		</div>
		<h2>Login</h2>
		<input
			type="text"
			v-model="userInput"
			placeholder="请输入姓名"
		/>
		<button @click="login">登录</button>
	</div>
</template>

<script setup>
	import { ref } from "vue";
	import { useRouter } from "vue-router";
	import { userGlobalName } from "@/stores/store";
	let userInput = ref("");
	const router = useRouter(); 
	
	// 前端路由跳转
	const login = () => {
		router.push({
			path: "/formFill",
		});
		userGlobalName.value = userInput.value;
	};
</script>

<style>
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
		/* right: 0;
    bottom: 10%; */
		margin: auto;
	}

	#before-login:hover {
		transform: scale(1.05);
	}

	#before-login input,
	#before-login button {
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
		/* 设置宽度 */
		height: 30px;
		/* 设置高度 */
		animation: swingIcon 4s infinite linear;
		/* 使用动画，匀速摆动 */
		transform-origin: top right;
		/* 设置旋转原点为右上角 */
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
		/* 设置旋转原点为右上角 */
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
