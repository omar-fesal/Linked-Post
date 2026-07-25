import { Button, Modal, Input } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { sharePostApi } from "../../Services/PostService";
import { useState } from "react";
import toast from "react-hot-toast";

export function PostShareDialog({ open, setOpen, postId, onShared, onPostShared }) {
    const [body, setBody] = useState("");

    const { mutate, isPending } = useMutation({
        mutationFn: () => sharePostApi(postId, body.trim() ? { body: body.trim() } : {}),

        onSuccess: (data) => {
            const newPost = data?.data?.post
            // Update share count on the original post instantly
            const newCount = newPost?.sharedPost?.sharesCount
            if (newCount !== undefined) onShared?.(newCount)
            // Prepend the new share post to the feed instantly
            if (newPost) onPostShared?.(newPost)

            toast.success('Post shared successfully 🔁')
            setOpen(false);
            setBody("");
        },

        onError: () => {
            toast.error('Failed to share post. Please try again.')
        }
    });

    return (
        <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Backdrop variant="blur">
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-125">
                        <Modal.CloseTrigger />

                        <Modal.Header>
                            <Modal.Heading>Share Post</Modal.Heading>
                        </Modal.Header>

                        <Modal.Body>
                            <Input
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Say something about this..."
                            />


                        </Modal.Body>

                        <Modal.Footer>
                            <Button
                                color="primary"
                                className="w-full"
                                isLoading={isPending}
                                onClick={() => mutate()}
                            >
                                Share Post
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}