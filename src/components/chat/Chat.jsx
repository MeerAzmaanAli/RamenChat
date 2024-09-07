import { useEffect, useRef, useState } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react";
import { doc,arrayUnion,updateDoc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/UserStore";
import upload from "../../lib/upload";
import{format} from "timeago.js"




const Chat = ()=> {

    const[chat,setChat]=useState();
    const[open,setOpen]=useState(false);
    const[text,setText]=useState("");
    const[img, setImg]= useState({
        file:null,
        url:"",
    });


    const endRef = useRef(null);
    const {chatId,user,isCurrentUserBlocked, isReceiverBlocked} = useChatStore();
    const {currentUser}=useUserStore();

    const openImageInNewTab = (url) => {
        window.open(url, '_blank');
      };


    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    const handleEmoji=(e) =>{
        setText((prev)=>prev+e.emoji);
    }
    const handleImg = (e) =>{
        if(e.target.files[0]){
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
        
    };

    useEffect(()=>{

        const unSub = onSnapshot(doc(db,"chats",chatId),(res)=>{
            setChat(res.data());
        });

        return ()=>{
            unSub();
        }
    },[chatId]);
    
    const handleSend= async ()=>{

        if(!img.file && text ==="")return;
        
        let imgUrl = null;

        
        try {
            const prompt = `${text} this is the dialogue for the character, creat a black and white manga style panel consisting of a single male character such that the characters pose matches the dialogue also add callout for dialogue `;
            sendMessage(prompt);

            if(img.file){
                imgUrl = await upload(img.file);
            }
            await updateDoc(doc(db,"chats",chatId),{
                message:arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userIDs = [currentUser.id,user.Id];



            userIDs.forEach( async (id) => {
                const userChatRef =doc(db,"userChats", id);
                const userChatsSnapshot = await getDoc(userChatRef);

                if(userChatsSnapshot.exists()){
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex((c) =>c.chatId === chatId);
                
                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id? true:false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatRef, {
                        chats:userChatsData.chats,

                    });
                }
        });


        } catch (err) {
            console.log(err);
        }finally{
            setImg({
                file:null,
                url:"",
            });
            setText("");
        }
        
    };

    async function sendMessage(text) {
        const response = await fetch('/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: text })
        });
    
        const data = await response.json();
        displayImage(data.imageUrl);
    }
    
    function displayImage(imageUrl) {
        setImg({
            file: "",
            url: imageUrl
        });
    }

    return (
        
        <div className='chat'>
            <div className="top">
                <div className="user">
                    <img src={user?.avatar||"./avatar.png"} alt="" />
                    <div className="text">
                        <span>{user?.username}</span>
                        <p>ganja goli</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chat?.message?.map((message)=>(
                    <div
                        className={message.senderId === currentUser?.id ? "message own":"message"} key={message?.createAt}>                   
                            {message.img && <div className="messageImg"><img src={message.img} onClick={() => openImageInNewTab(message.img)} alt="" /></div>}
                           <div className="text" disabled={message.img}>    
                                <p>{message.text}</p>
                                <span>{format(message.createAt.toDate())}</span>
                            </div>
                    </div>))}
                {img.url && (
                    <div className="message own">
                        <div className="text">
                        <img src={img.url} onClick={() => openImageInNewTab(img.url)}  alt="" />
                        </div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>
            <div className="bottom" disabled={isCurrentUserBlocked||isReceiverBlocked}>
                <div className="icons">
                    <label htmlFor="file">
                         <img src="./img.png" alt="" />
                    </label>
                    <input type="file" id="file" style={{display:"none"}} onChange={handleImg} disabled={isCurrentUserBlocked||isReceiverBlocked}/>
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text"placeholder="message..." 
                    value ={text} onChange={e=>setText(e.target.value)} 
                    disabled={isCurrentUserBlocked||isReceiverBlocked}/>
                <div className="emoji">
                    <img src={open?"./cross.png":"./emoji.png"} alt="" onClick={()=>setOpen((prev)=>!prev)} />
                    <div className="picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                    </div>
                   
                </div>
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked||isReceiverBlocked}>Send</button>
            </div>
        </div>

    );
        
    
};

export default Chat;