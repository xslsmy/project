//封装读取和存储数据到本地的方法
export const SET_TOKEN = (token:string)=>{
    localStorage.setItem("TOKEN",token)
}
export const GET_TOKEN = ()=>{
    return localStorage.getItem("TOKEN")
}
//退出登录
export const REMOVE_TOKEN = ()=>{
    localStorage.removeItem('TOKEN');
}