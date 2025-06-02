const IsLoggedInUser=(msg,user)=>{
    if(msg.sender._id===user._id)
    {
        return true
    }
    return false
}
 
export {IsLoggedInUser}