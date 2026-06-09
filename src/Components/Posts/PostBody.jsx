import React from 'react'

export default function PostBody({ body, image }) {
    return <>
        {
            body && <p>{body}</p>
        }

        {
            image && <img src={image} alt={body} className='object-cover h-80 w-full'></img>
        }

    </>
}
