import UserCard from "./UserCard";

const UserList = ({ title, users }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-3">{title}</h2>
            {users.length === 0 ? (
                <p className="text-gray-400">No users found.</p>
            ) : (
                <div className="space-y-2">
                    {users.map((user, index) => (
                        <UserCard key={index} user={{ username: user.name , userId: user._id}} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserList;
