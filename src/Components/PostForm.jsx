import { Button, Textarea } from '@heroui/react'
import React from 'react'
import { useState } from 'react'
import { createPostApi } from '../Services/PostService';
import placeholder from '../assets/placeholder.png'

export default function PostForm({ getAllPosts }) {
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    function handleImage(e) {
        setImage(e?.target.files[0])
        setImageUrl(e && URL.createObjectURL(e.target.files[0]))
        if (e) {
            e.target.value = ''
        }
    }

    async function createPost(e) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData();
        body && formData.append('body', body)
        image && formData.append('image', image)

        const resp = await createPostApi(formData)
        if (resp.message == 'success') {
            await getAllPosts()
            setBody('')
            setImageUrl('')
        }
        setLoading(false)

    }

    return <>

        <div className="p-4 mt-4 rounded-md shadow">
            <form onSubmit={createPost} >
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="What's on your mind  "></Textarea>

                <div className="flex mt-3 justify-between items-center">
                    <label className='flex gap-2 cursor-pointer hover:text-blue-400'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>



                        <input onChange={handleImage} type='file' className='hidden' />
                    </label>
                    <Button isDisabled={!(image || body)} isLoading={loading} type='submit'> post</Button>
                </div>

                {
                    imageUrl && <div className="mt-3  relative">
                        <svg className="size-6 absolute top-4 right-4 cursor-pointer" onClick={() => handleImage(null)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>

                        <img src={imageUrl} className='w-full rounded-md' />
                    </div>
                }
            </form>
        </div>
    </>
}
