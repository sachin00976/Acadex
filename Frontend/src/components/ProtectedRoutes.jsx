import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useSelector(store=>store.auth);
    console.log(isAuthenticated);
    

    if(!isAuthenticated){
        return <Navigate to="/"/>
    }

    return children;
}

export const AuthenticatedUser = ({children}) => {
    const {isAuthenticated,role} = useSelector(store=>store.auth);
    console.log(role);
    
    if(isAuthenticated){
        return <Navigate to={`/${role}`}/>
    }

    return children;
}
