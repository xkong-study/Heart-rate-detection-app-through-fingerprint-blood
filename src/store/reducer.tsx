import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState { // 定义初始化状态的类型
    value0: number,
    value1: number,
    value2:number,
    value3:number,
    click: number,
    move : number,
}
const initialState: CounterState = { // 初始化状态
    value0: 0,
    value1: 0,
    value2: 0,
    value3: 0,
    click: 0,
    move: 0,
}

export const counterSlice = createSlice({
    name: 'hidden',
    initialState,
    reducers: {
        Payment0: (state, action: PayloadAction<number>) => {
            state.value0 = action.payload
        },
        Payment1: (state, action: PayloadAction<number>) => {
            state.value1 = action.payload
        },
        Payment2:(state,action:PayloadAction<number>)=>{
            state.value2 = action.payload
        },
        Payment3:(state,action:PayloadAction<number>)=>{
            state.value3 = action.payload
        },
        Click:(state, action: PayloadAction<number>) => {
            state.click = action.payload
        },
        Move:(state,action:PayloadAction<number>)=>{
            state.move = action.payload
        },
    }
})

export const { Payment0, Payment1, Payment2, Payment3, Click, Move } = counterSlice.actions // 导出操作state的喊出
export default counterSlice.reducer // 导出当前reducer在store/index.ts中记性全局挂载（这种也可以不用挂载到全局）
