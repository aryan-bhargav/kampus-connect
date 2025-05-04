import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black text-white">
      {/* Animated Loader */}
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, repeat: Infinity }}
      ></motion.div>
      
      {/* Loading Text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="ml-4 text-xl font-semibold"
      >
        Loading... Wait bitch
      </motion.p>
    </div>
  );
};

export default Loading;
