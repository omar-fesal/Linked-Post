import { Card, Input } from "@heroui/react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Search, UserPlus, UserCheck, Loader2 } from "lucide-react";
import { GetFollowSuggest } from "../../Services/FollowSuggest";
import { followAndUnFollowApi } from "../../Services/PostService";
import profileImage from '../../assets/placeholder.png';
import { useState } from "react";
import { Link } from "react-router-dom";

function FriendRow({ friend }) {
    const [isFollowing, setIsFollowing] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: () => followAndUnFollowApi(friend._id),
        onSuccess: (data) => {
            if (data?.data?.following !== undefined) {
                setIsFollowing(data.data.following);
            } else {
                // toggle optimistically if API doesn't return following field
                setIsFollowing(prev => !prev);
            }
        },
    });

    return (
        <div className="flex justify-between items-center">
            <Link to={`/user/${friend._id}`} className="flex gap-3 items-center hover:opacity-80 transition-opacity">
                <img
                    className="size-14 rounded-full object-cover"
                    src={friend.photo || profileImage}
                    alt={friend.name}
                />

                <div>
                    <h3 className="font-semibold">
                        {friend.name}
                    </h3>

                    <p className="text-sm text-default-500">
                        @{friend.username}
                    </p>

                    <p className="text-xs text-default-400">
                        {friend.followersCount} followers •{" "}
                        <span className="text-green-500">
                            {friend.mutualFollowersCount} mutual
                        </span>
                    </p>
                </div>
            </Link>

            {isFollowing ? (
                <div
                    onClick={() => !isPending && mutate()}
                    className={`flex items-center gap-1.5 cursor-pointer select-none text-blue-600 transition-opacity ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-70'}`}
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                    <span className="text-sm font-medium">Following</span>
                </div>
            ) : (
                <div
                    onClick={() => !isPending && mutate()}
                    className={`flex items-center gap-1.5 cursor-pointer select-none text-gray-600 transition-opacity ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-70'}`}
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                    <span className="text-sm font-medium">Follow</span>
                </div>
            )}
        </div>
    );
}

export default function SuggestedFriends({ followersLimit }) {
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['follow suggest'],
        queryFn: () => GetFollowSuggest(followersLimit),
    });

    const allSuggestions = data?.data.suggestions ?? [];
    const filteredSuggestions = allSuggestions.filter((friend) => {
        const q = searchQuery.toLowerCase();
        return (
            friend.name?.toLowerCase().includes(q) ||
            friend.username?.toLowerCase().includes(q)
        );
    });

    return (
        <Card className="w-[320px] p-5 rounded-3xl">
            <div className="flex items-center gap-3 mb-5">
                <h2 className="text-2xl font-bold">
                    Suggested Friends
                </h2>

                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-semibold">
                    {filteredSuggestions.length}
                </div>
            </div>

            <Input
                placeholder="Search friends..."
                startContent={<Search size={18} />}
                radius="lg"
                className="mb-5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="space-y-4">
                {filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((friend) => (
                        <FriendRow key={friend._id || friend.id} friend={friend} />
                    ))
                ) : (
                    <p className="text-sm text-default-400 text-center py-2">No results found</p>
                )}
            </div>

            <div
                className="mt-5 text-sm font-medium text-green-600 cursor-pointer hover:opacity-70 transition-opacity"
            >
                <Link to={'/suggestion'} >View More</Link>

            </div>
        </Card>
    );
}
