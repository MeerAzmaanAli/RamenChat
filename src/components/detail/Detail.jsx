import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth, db } from "../../lib/firebase"
import "./detail.css"
import { useUserStore } from "../../lib/UserStore";
import { useEffect, useState } from "react";
import{format} from "timeago.js"

const Detail = ()=> {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } = useChatStore();
    const { currentUser } = useUserStore();
    const[chat,setChat]=useState();

        const handleBlock = async () => {
            if (!user) return;
        
            const userDocRef = doc(db, "users", currentUser.id);
        
            try {
              await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
              });
              changeBlock();
            } catch (err) {
              console.log(err);
            
            };
        
        };
        const openImageInNewTab = (url) => {
            window.open(url, '_blank');
          };

          
        useEffect(()=>{

            const unSub = onSnapshot(doc(db,"chats",chatId),(res)=>{
                setChat(res.data());
            });
    
            return ()=>{
                unSub();
            }
        },[chatId]);

    return (
        
        <div className='detail'>
            <div className="user">
                <img src={user?.avatar||"./avatar.png"} alt="" />
                <h2>{user?.username}</h2>
                <p></p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Setting</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Chat Setting</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Media</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>
                    <div className="photos">
                        {chat?.message?.map((messageimg)=>(
                            <div className="photoList">{messageimg.img && (
                                <div className="photoItem" key={messageimg.createAt} >
                                    <div className="photoDetail"> 
                                        <img src={messageimg.img} onClick={() => openImageInNewTab(messageimg.img)} alt="" />
                                        <span onClick={() => openImageInNewTab(messageimg.img)}>{format(messageimg.createAt.toDate())}</span>
                                    </div>
                                    <img src="./download.png" alt="" className="icons" onClick={() =>openImageInNewTab(messageimg.img)}/>
                                </div>)}
                            </div>))}  
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <button onClick={handleBlock}>
                    {isCurrentUserBlocked ? "You are Blocked!":
                    isReceiverBlocked ? "User blocked": "Block User"}
                    </button>                
             </div>          
        </div>
    );
};

export default Detail;