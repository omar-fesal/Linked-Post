import { UserPlus, UserCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { followAndUnFollowApi } from "../../Services/PostService";
import profileImage from "../../assets/placeholder.png";
import { Link } from "react-router-dom";

export default function FriendCard({ user }) {
    const [isFollowing, setIsFollowing] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: () => followAndUnFollowApi(user._id),
        onSuccess: (data) => {
            if (data?.data?.following !== undefined) {
                setIsFollowing(data.data.following);
            } else {
                setIsFollowing((prev) => !prev);
            }
        },
    });

    return (
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            {/* Avatar + Info */}
            <Link to={`/user/${user._id}`} className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
                <img
                    src={user.photo || profileImage}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
                    onError={(e) => { e.target.src = profileImage; }}
                />
                <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{user.name}</h3>
                    <p className="text-gray-400 text-xs truncate">
                        @{user.username || "postify-user"}
                    </p>
                    <div className="flex items-center gap-1 text-xs mt-0.5 text-gray-500">
                        <span>{user.followersCount ?? 0} followers</span>
                        <span>•</span>
                        <span className="text-green-500 font-semibold">
                            {user.mutualFollowersCount ?? 0} mutual
                        </span>
                    </div>
                </div>
            </Link>

            {/* Follow / Following button — same pattern as SuggestedFriends in feed */}
            {isFollowing ? (
                <div
                    onClick={() => !isPending && mutate()}
                    className={`flex items-center gap-1.5 cursor-pointer select-none px-4 py-2 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 border border-blue-200 transition-all flex-shrink-0 ml-3 ${
                        isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-100"
                    }`}
                >
                    {isPending ? <Loader2 size={15} className="animate-spin" /> : <UserCheck size={15} />}
                    <span>Following</span>
                </div>
            ) : (
                <div
                    onClick={() => !isPending && mutate()}
                    className={`flex items-center gap-1.5 cursor-pointer select-none px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white shadow-sm transition-all flex-shrink-0 ml-3 ${
                        isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600 hover:shadow-md active:scale-95"
                    }`}
                >
                    {isPending ? <Loader2 size={15} className="animate-spin" /> : <UserPlus size={15} />}
                    <span>{isPending ? "Follow..." : "Follow"}</span>
                </div>
            )}
        </div>
    );
}