import { ref } from 'vue';

export const userGlobalData = ref({

    name: 'undefined',
    contact: '00000000',
    gender: 'undefined',
    age: 'undefined',
    grade: 'undefined',
    courses: 'undefined',

}); // 默认姓名
export const currentDataText = ref('no text'); // 当前数据项
export const currentDataIndex = ref(0); // 当前数据索引