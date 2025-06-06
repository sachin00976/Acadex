
const getOtherUser=(chat,user)=>{
    const chatUsers=chat.users
    if(chatUsers[0].user._id===user._id) return chatUsers[1]
    else return chatUsers[0]
}
export {getOtherUser}