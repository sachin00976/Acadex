const isSameUserMessage=(messages,i)=>{

    if((i===messages.length-1) || (messages[i+1].sender._id!==messages[i].sender._id))
    {
        return true
    }
    else{
        return false
    }
}
export {isSameUserMessage}