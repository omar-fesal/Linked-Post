import { useMutation } from '@tanstack/react-query'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { likeAndUnlikePostApi } from '../../Services/PostService'
import { AuthContext } from '../../context/AuthContext'
import { Comment, Heart, HeartFill } from "@gravity-ui/icons";
import { ToggleButton } from "@heroui/react";
import { PostShareDialog } from './PostShareDialog'
import BookmarkBtn from './BookmarkBtn'
import { PostLikesDialog } from './PostLikesDialog'

export default function PostComment({ commentsCount, id, likesCount, post }) {



    const { userData } = useContext(AuthContext)



    const [open, setOpen] = useState(null);
    const [likesOpen, setLikesOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(post?.likes?.includes(userData?.id) || false);
    const [likes, setLikes] = useState(likesCount);


    function likePost() {
        mutate();
    }

    const { mutate, isPending } = useMutation({
        mutationFn: () => likeAndUnlikePostApi(post._id),
        onSuccess: (data) => {
            setIsLiked(data.data.liked);
            setLikes(data.data.likesCount);
        }
    });






    return (
        <>
            <div className="w-full flex justify-between py-3">
                <div className="flex items-center gap-3">

                    <button
                        onClick={() => likes > 0 && setLikesOpen(true)}
                        className={`flex items-center gap-1 transition-opacity ${likes > 0 ? 'hover:opacity-70 cursor-pointer' : 'cursor-default'}`}
                    >
                        <div className="bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center">
                            <HeartFill className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-500 text-sm">
                            {likes}
                        </span>
                    </button>

                    <div className="flex items-center gap-1">
                        <div className="bg-green-500 w-5 h-5 rounded-full flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={12}
                                height={12}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth={2}
                            >
                                <circle cx={18} cy={5} r={3} />
                                <circle cx={6} cy={12} r={3} />
                                <circle cx={18} cy={19} r={3} />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                        </div>

                        <span className="text-gray-500 text-sm">
                            {post?.sharesCount || 0}
                        </span>
                    </div>

                </div>

                <Link to={"/single-post/" + id}>
                    <p className="text-gray-500">
                        {commentsCount} comments
                    </p>
                </Link>
            </div>

            <div className="flex justify-between items-center w-full px-5 my-3 border-t border-divider pt-2">


                <ToggleButton
                    isSelected={isLiked}
                    onChange={() => {
                        if (!isPending) {
                            likePost();
                        }
                    }}
                >
                    {({ isSelected }) => (
                        <>
                            {isSelected ? <HeartFill /> : <Heart />}
                            {isSelected ? "Liked" : "Like"}
                        </>
                    )}
                </ToggleButton>


                <button className="flex flex-row justify-center items-center   space-x-3 cursor-pointer bg-[#ecebeb] rounded-4xl w-fit px-4 py-1 hover:bg-[oklab(0.910812_0.000335261_-0.00114804)] ">
                    <Comment />
                    <span className="font-semibold text-lg text-gray-600">comment</span>
                </button>

                <button
                    onClick={() => setOpen(true)}
                    className="flex flex-row justify-center items-center space-x-3 w-fit px-4 py-1 rounded-4xl cursor-pointer bg-[#ecebeb] hover:bg-[oklab(0.910812_0.000335261_-0.00114804)]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#838383" strokeWidth={2} strokeLinecap="square" strokeLinejoin="round">
                        <circle cx={18} cy={5} r={3} />
                        <circle cx={6} cy={12} r={3} />
                        <circle cx={18} cy={19} r={3} />
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>

                    <span className="font-semibold text-lg text-gray-600">share</span>

                </button>

                <BookmarkBtn
                    postId={post?._id}
                    initialBookmarked={post?.bookmarked || false}
                />

                <PostShareDialog
                    open={open}
                    setOpen={setOpen}
                    postId={id}
                />

                <PostLikesDialog
                    open={likesOpen}
                    setOpen={setLikesOpen}
                    postId={id}
                />
            </div>
        </>
    )
}