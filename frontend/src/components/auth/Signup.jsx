import { useState, useEffect } from "react"; 
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaUniversity, FaCodeBranch, FaChevronDown } from "react-icons/fa";


const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [college, setCollege] = useState("");
    const [branch, setBranch] = useState("");
    const [section, setSection] = useState("");

    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState([]);

    const [filteredColleges, setFilteredColleges] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);

    const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
    const [showBranchDropdown, setShowBranchDropdown] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/auth/colleges`)
            .then(response => {
                setColleges(response.data);
                setFilteredColleges(response.data);
            })
            .catch(error => console.error("Error fetching colleges:", error));
    }, []);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/auth/branches`)
            .then(response => {
                const branchList = response.data.map(branch => ({ name: branch }));
                setBranches(branchList);
                setFilteredBranches(branchList);
            })
            .catch(error => console.error("Error fetching branches:", error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, college, branch, section }),
        });

        const data = await response.json();
        if (response.ok) alert("Signup Successful");
        else alert("Signup Failed: " + data.message);
    };

    const handleCollegeChange = (e) => {
        setCollege(e.target.value);
        setFilteredColleges(colleges.filter(col => col.name.toLowerCase().includes(e.target.value.toLowerCase())));
        setShowCollegeDropdown(true);
    };

    const handleBranchChange = (e) => {
        setBranch(e.target.value);
        setFilteredBranches(branches.filter(br => br.name.toLowerCase().includes(e.target.value.toLowerCase())));
        setShowBranchDropdown(true);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl rounded-2xl p-6 md:p-8 max-w-md w-full"
            >
                <h2 className="text-white text-3xl font-bold text-center mb-6">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div className="flex items-center bg-white/10 border border-white/30 rounded-md px-3 py-2">
                        <FaUser className="text-gray-400 mr-2" />
                        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-transparent outline-none text-white w-full placeholder-gray-300" />
                    </div>

                    {/* Email Input */}
                    <div className="flex items-center bg-white/10 border border-white/30 rounded-md px-3 py-2">
                        <FaEnvelope className="text-gray-400 mr-2" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-transparent outline-none text-white w-full placeholder-gray-300" />
                    </div>

                    {/* Password Input */}
                    <div className="flex items-center bg-white/10 border border-white/30 rounded-md px-3 py-2">
                        <FaLock className="text-gray-400 mr-2" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-transparent outline-none text-white w-full placeholder-gray-300" />
                    </div>

                    {/* College Dropdown */}
                    <div className="relative">
                        <div className="flex items-center bg-white/10 border border-white/30 rounded-md px-3 py-2 cursor-pointer">
                            <FaUniversity className="text-gray-400 mr-2" />
                            <input type="text" placeholder="College" value={college} onChange={handleCollegeChange} className="bg-transparent outline-none text-white w-full placeholder-gray-300" />
                            <FaChevronDown className={`text-gray-400 cursor-pointer transform transition-transform ${showCollegeDropdown ? "rotate-180" : ""}`} onClick={() => setShowCollegeDropdown(!showCollegeDropdown)} />
                        </div>
                        {showCollegeDropdown && (
                            <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-md shadow-md rounded-md mt-1 max-h-40 overflow-y-auto z-20">
                                {filteredColleges.map((col, index) => (
                                    <div key={index} className="px-3 py-2 text-white hover:bg-white/20 cursor-pointer" onClick={() => { setCollege(col.name); setShowCollegeDropdown(false); }}>
                                        {col.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Branch Dropdown */}
                    <div className="relative">
                        <div className="flex items-center bg-white/10 border border-white/30 rounded-md px-3 py-2 cursor-pointer">
                            <FaCodeBranch className="text-gray-400 mr-2" />
                            <input type="text" placeholder="Branch" value={branch} onChange={handleBranchChange} className="bg-transparent outline-none text-white w-full placeholder-gray-300" />
                            <FaChevronDown className={`text-gray-400 cursor-pointer transform transition-transform ${showBranchDropdown ? "rotate-180" : ""}`} onClick={() => setShowBranchDropdown(!showBranchDropdown)} />
                        </div>
                        {showBranchDropdown && (
                            <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-md shadow-md rounded-md mt-1 max-h-40 overflow-y-auto z-20">
                                {filteredBranches.map((br, index) => (
                                    <div key={index} className="px-3 py-2 text-white hover:bg-white/20 cursor-pointer" onClick={() => { setBranch(br.name); setShowBranchDropdown(false); }}>
                                        {br.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Section Input */}
                    <div className="flex items-center bg-white/10 border border-white/30 rounded-md px-3 py-2">
                        <input type="text" placeholder="Section" value={section} onChange={(e) => setSection(e.target.value)} required className="bg-transparent outline-none text-white w-full placeholder-gray-300" />
                    </div>

                    {/* Sign Up Button */}
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit" 
                        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all"
                    >
                        Sign Up
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;
