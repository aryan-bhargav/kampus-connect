import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        axios.get("http://localhost:8000/api/messages", { withCredentials: true })
            .then(response => setMessages(response.data))
            .catch(error => console.error("Error fetching messages:", error));
    }, []);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const response = await axios.post("http://localhost:8000/api/messages", { text: newMessage }, { withCredentials: true });
            setMessages([...messages, response.data]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-white">
            {/* Message Box */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5 }} 
                className="relative z-10 bg-white/10 border border-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-6 md:p-8 max-w-2xl w-full"
            >
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Messages</h2>
                
                {/* Messages Container */}
                <div className="h-64 overflow-y-auto bg-gray-800 p-4 rounded-lg mb-4 scrollbar-thin scrollbar-thumb-gray-700">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => (
                            <div key={index} className="mb-2 p-2 bg-gray-700 rounded-lg text-sm">
                                {msg.text}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-center">No messages yet. Start the conversation!</p>
                    )}
                </div>

                {/* Input Field & Button */}
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={sendMessage} 
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
                    >
                        Send
                    </button>
                </div>
            </motion.div>
        </section>
    );
};

export default Messages;
