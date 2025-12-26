import { useEffect, useState } from "react"
import "./chatList.css"
import AddUser from "./addUser/AddUser";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useUserStore } from "../../../lib/UserStore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const ChatList = ()=> {
    const[chats,setChats]=useState([]);
    const[addMode,setAddMode]=useState(false);
    const [input, setInput] = useState("");

    const {currentUser} = useUserStore();
    const {changeChat,chatId} = useChatStore();

    useEffect(()=>{
        const unSub = onSnapshot(doc(db, "userChats", currentUser.id), async (res) => {
            const items = res.data()?.chats || [];

            // Remove duplicates by chatId, keeping the most recent one
            const uniqueItems = items.reduce((acc, item) => {
                const existing = acc.find(chat => chat.chatId === item.chatId);
                if (!existing || item.updatedAt > existing.updatedAt) {
                    // Remove existing duplicate if found
                    const filtered = acc.filter(chat => chat.chatId !== item.chatId);
                    return [...filtered, item];
                }
                return acc;
            }, []);

            const promises = uniqueItems.map(async(item) =>{
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);
                
                const user = userDocSnap.data();

                return{...item, user};

            });
            const chatData = await Promise.all(promises);

            // Filter out any chats where user data is missing
            const validChats = chatData.filter(chat => chat.user);

            setChats(validChats.sort((a,b)=>b.updatedAt - a.updatedAt));

        });

        return()=>{
            unSub();
        };
    },[currentUser.id]);

    const handleSelect = async (chat) =>{
        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;
          });
      
        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );
      
        userChats[chatIndex].isSeen = true;
      
        const userChatsRef = doc(db, "userChats", currentUser.id);
      
        try {
            await updateDoc(userChatsRef, {
              chats: userChats,
            });
            changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.log(err);
        }
    };
    const filteredChats = chats.filter((c) =>
        c.user?.username?.toLowerCase().includes(input.toLowerCase())
      );

    return (
        
        <div className='chatList'>
            
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" onChange={(e) => setInput(e.target.value)} />
                </div>
                <img src= {addMode ? "./minus.png": "./plus.png"} alt="" className="add" onClick={()=>setAddMode((prev)=>!prev)}/>
            </div>
            {filteredChats.map((chat, index)=>(
                <div className="item" key={`${chat.chatId}-${chat.receiverId}-${index}`} onClick={()=>handleSelect(chat)} style={{backgroundColor:chat?.isSeen?
                "lightgrey":"white"}}>
                    <img src={chat.user?.avatar || "./avatar.png"} alt="" />
                    <div className="text">
                        <span>{chat.user?.username || "Unknown User"}</span>
                        <p>{chat.lastMessage || ""}</p>
                    </div>
                </div>
            ))}
            
            {addMode && <AddUser/>}
        </div>

    )
        
    
}

export default ChatList