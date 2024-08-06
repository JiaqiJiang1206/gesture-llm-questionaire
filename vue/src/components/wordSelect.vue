<template>
	<div id="right_sentence">
		<span
			v-for="(word, index) in words"
			:key="index"
			@click="selectWord(index)"
			:class="ifSelected(index)"
		>
			{{ word }}
		</span>
	</div>
</template>

<script setup>
	import { defineProps, defineModel } from "vue";

	const props = defineProps(["words"]);
	console.log(props.words);

	let startAndEndIndex = defineModel();

	let startIndex = -1;
	let endIndex = -1;

	startAndEndIndex.value = { startIndex: startIndex, endIndex: endIndex };

	function selectWord(index) {
		console.log(props.words[index]);
		if (startIndex === -1) {
			// 如果开始索引还未设置，则设置开始索引
			startIndex = index;
		} else if (endIndex === -1) {
			// 如果开始索引已经设置，但是结束索引还未设置，则设置结束索引
			endIndex = index;
		} else {
			// 如果开始索引和结束索引都已经设置，则重新设置开始索引
			startIndex = index;
			endIndex = -1;
		}
		startAndEndIndex.value = { startIndex: startIndex, endIndex: endIndex };
	}

	function ifSelected(index) {
		if (
			index === startAndEndIndex.value.startIndex ||
			index === startAndEndIndex.value.endIndex
		) {
			return "selected";
		}
	}
</script>

<style>
	span {
		display: inline-block;
		padding: 5px;
		margin: 5px;
		border: 1px solid #ccc;
		cursor: pointer;
		border-radius: 5px;
		transition: background-color 0.3s;
	}

	span.selected {
		background-color: #607448;
		color: white;
	}
</style>
