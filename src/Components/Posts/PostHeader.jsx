import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react'
import React, { useContext } from 'react'
import { AuthContext } from './../../context/AuthContext';
import { deletPostApi } from '../../Services/PostService';

export default function PostHeader({ photo, name, date, userId, postId, callback, setIsDeletPost }) {


    const { userData } = useContext(AuthContext)

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
            <div className="flex">
                <img className=" rounded-full w-10 h-10 mr-3" src={photo} alt={name} />
                <div>
                    <h3 className="text-md font-semibold ">{name}</h3>
                    <p className="text-xs text-gray-500">{date}</p>
                </div>
            </div>

            {userId === userData._id &&
                <Dropdown>
                    <DropdownTrigger>
                        <svg className="w-16 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width={27} height={27} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2}
                            strokeLinecap="square"
                            strokeLinejoin="round">
                            <circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} />
                            <circle cx={5} cy={12} r={1} /></svg>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="edit">Edit file</DropdownItem>
                        <DropdownItem onClick={deletPost} key="delete" className="text-danger" color="danger">
                            Delete file
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>}


        </div>




    </>
}
