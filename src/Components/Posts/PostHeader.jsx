import { Dropdown } from '@heroui/react'
import React, { useContext } from 'react'
import { AuthContext } from './../../context/AuthContext';
import { deletPostApi } from '../../Services/PostService';
import { EditPostDialog } from './editPostDialog';
import { useState } from 'react';
import { Loader2, UserCheck, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';


export default function PostHeader({ post, photo, name, date, userId, postId, callback, setIsDeletPost, onPostUpdated, isFollow, usersId, onFollowToggle, isFollowPending }) {



    const { userData } = useContext(AuthContext)


    const [open, setOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const isOwner = usersId === userData?._id;
    async function deletPost() {
        setIsDeletPost(true)
        const resp = await deletPostApi(postId)
        if (resp.message == 'success') {
            await callback()
        }
        setIsDeletPost(false)
    }


    return <>
        <div className="w-full h-16 flex items-center  justify-between ">
            <Link
                to={isOwner ? '/profile' : `/user/${userId}`}
                className="flex items-center hover:opacity-80 transition-opacity"
            >
                <img className="rounded-full w-10 h-10 mr-3 object-cover" src={photo} alt={name} />
                <div>
                    <h3 className="text-md font-semibold">{name}</h3>
                    <p className="text-xs text-gray-500">{date}</p>
                </div>
            </Link>


            {userId === userData?._id &&
                <Dropdown isOpen={open} onOpenChange={setOpen}>
                    <Dropdown.Trigger>
                        <svg className="w-16 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2}
                            strokeLinecap="square"
                            strokeLinejoin="round">
                            <circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} />
                            <circle cx={5} cy={12} r={1} /></svg>
                    </Dropdown.Trigger>
                    <Dropdown.Popover>
                        <Dropdown.Menu
                            aria-label="Static Actions"
                            onAction={(key) => {
                                if (key === 'edit') {
                                    setOpen(false)
                                    setIsEditOpen(true);
                                } else if (key === 'delete') {
                                    deletPost()
                                }
                            }}
                        >
                            <Dropdown.Item id="edit" className='text-blue-500'>
                                Edit
                            </Dropdown.Item>
                            <Dropdown.Item id="delete" className="text-danger" color="danger">
                                Delete
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>}


            {!isOwner && (
                isFollow ? (
                    <div
                        onClick={() => !isFollowPending && onFollowToggle()}
                        className={`flex items-center gap-2 cursor-pointer select-none text-blue-600 transition-opacity ${isFollowPending ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-70'}`}
                    >
                        {isFollowPending ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
                        <span className="text-sm font-medium">Following</span>
                    </div>
                ) : (
                    <div
                        onClick={() => !isFollowPending && onFollowToggle()}
                        className={`flex items-center gap-2 cursor-pointer select-none text-gray-600 transition-opacity ${isFollowPending ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-70'}`}
                    >
                        {isFollowPending ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
                        <span className="text-sm font-medium">Follow</span>
                    </div>
                )
            )}
        </div>

        {isEditOpen && (
            <EditPostDialog
                open={isEditOpen}
                setOpen={setIsEditOpen}
                postId={postId}
                postBody={post?.body}
                postImg={post?.image}
                isShare={post?.isShare}
                callback={callback}
                onPostUpdated={onPostUpdated}
            />
        )}
    </>
}
