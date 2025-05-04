import SendRequest from "./SendRequest";

const UserCard = ({ user, onlyUsername }) => {
    return (
        <div className="p-3 bg-gray-700 rounded-lg flex justify-between items-center">
            <div>
                <h3 className="text-white font-bold">{user.username}</h3>
                {!onlyUsername && <p className="text-gray-300">{user.email}</p>}
            </div>
            {!onlyUsername && <SendRequest userId={user.userId} />}
        </div>
    );
};

export default UserCard;
