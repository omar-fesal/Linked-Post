import { Button, Modal, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { UpdatePostApi } from "../../Services/PostService";
import { useMutation } from "@tanstack/react-query";

export function EditPostDialog({ open, setOpen, postId, postBody, postImg, isShare, callback, onPostUpdated }) {

    const { mutate, isPending } = useMutation({
        mutationFn: (formData) => UpdatePostApi(postId, formData),
        onSuccess: (data) => {
            const updatedPost = data?.data?.post;

            // Update post in-place so UI reflects changes without a full refresh
            if (onPostUpdated && updatedPost) {
                onPostUpdated(updatedPost);
            }

            // Also trigger any parent refetch if provided
            callback?.();
            setOpen(false);
        }
    });

    const variant = "blur";
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    // previewImage = the image shown in the dialog (existing or newly picked)
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        setBody(postBody || "");
        setPreviewImage(postImg || "");
        setImage(null); // reset any previously picked file when dialog reopens
    }, [postBody, postImg, open]);

    function handleImage(e) {
        const file = e?.target?.files?.[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
            e.target.value = '';
        }
    }

    function clearImage() {
        setImage(null);
        setPreviewImage("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        body && formData.append("body", body);
        image && formData.append("image", image);

        mutate(formData);
    }

    return (
        <Modal isOpen={open} onOpenChange={setOpen} key={variant}>
            <Modal.Backdrop variant={variant}>
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-100">
                        <form onSubmit={handleSubmit}>
                            <Modal.CloseTrigger />

                            <Modal.Header>
                                <Modal.Heading>
                                    Edit Post
                                </Modal.Heading>
                            </Modal.Header>

                            <Modal.Body>
                                <Input
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    placeholder="Post content"
                                />


                                {/* Image section — hidden for shared posts */}
                                {!isShare && (
                                    <>
                                        {previewImage && (
                                            <div className="relative mt-2 w-full h-60">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}

                                        <label className='flex gap-2 items-center cursor-pointer hover:text-blue-400 mt-2'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                            </svg>
                                            <span className="text-sm">{previewImage ? "Change photo" : "Add photo"}</span>
                                            <input onChange={handleImage} type='file' accept="image/*" className='hidden' />
                                        </label>
                                    </>
                                )}
                            </Modal.Body>

                            <Modal.Footer>
                                <Button type="submit" className="w-full" isPending={isPending}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </form>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}