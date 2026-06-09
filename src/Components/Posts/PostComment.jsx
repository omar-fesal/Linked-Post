import React, { useContext } from 'react'
import placeholder from '../../assets/placeholder.png'
import { AuthContext } from './../../context/AuthContext';


export default function PostFooter({ comment, userId, setFormForUpdate }) {
    const { userData } = useContext(AuthContext)
    return <>

        {
            <div className="flex items-center space-x-2 p-4 text-md">
                <div className="flex  self-start cursor-pointer">
                    <img onError={(e) => e.target.src = placeholder}
                        src={comment.commentCreator.photo}
                        alt={comment.commentCreator.photo}
                        className="h-8 w-8 object-fill rounded-full" />
                </div>
                <div className="flex items-center justify-center space-x-2">
                    <div className="block">
                        <div className="bg-gray-100 w-auto rounded-xl px-2 pb-2">
                            <div className="font-medium">
                                <span className="hover:underline text-sm">
                                    <small>{comment.commentCreator.name}</small>
                                </span>
                            </div>
                            <div className="text-xs">
                                {comment.content}
                            </div>
                        </div>
                        <div className="flex justify-start items-center text-xs w-full">
                            <div className="font-semibold text-gray-700 px-2 flex items-center justify-center space-x-1">
                                {userId === userData._id && userData._id === comment.commentCreator._id &&
                                    <>
                                        <span onClick={() => setFormForUpdate(comment)}
                                            className="hover:underline cursor-pointer">
                                            <small>Update</small>
                                        </span>
                                        <small className="self-center">.</small>
                                        <span className="hover:underline cursor-pointer">
                                            <small>Delete</small>
                                        </span>


                                    </>}


                                <small className="self-center">.</small>
                                <span>
                                    {comment.createdAt.split('.', 1)[0].replace('T', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="self-stretch flex justify-center items-center transform transition-opacity duration-200 opacity-0 translate -translate-y-2 hover:opacity-100">
                    <span className=''>
                        <div className="text-xs cursor-pointer flex h-6 w-6 transform transition-colors duration-200 hover:bg-gray-100 rounded-full items-center justify-center">
                            <svg className="w-4 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                        </div>
                    </span>
                </div>
            </div>



        }
    </>
}

