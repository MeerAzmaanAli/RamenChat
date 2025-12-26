import "./list.css"
import UserInfo from "./userInfo/UserInfo";
import ChatList from "./chatList/ChatList";
import { auth } from "../../lib/firebase";

const List = ()=> {
    return (
        
        <div className='list'>
            <UserInfo/>
            <ChatList/>
            <div className ="sap">
                <button className= "logout" onClick={()=>auth.signOut()}> Logout </button>
            </div>
            
        </div>

    )
        
    
}

export default List