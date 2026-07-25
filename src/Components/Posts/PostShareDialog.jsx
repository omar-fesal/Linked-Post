import { Button, Modal, Input } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sharePostApi } from "../../Services/PostService";
import { useState } from "react";

export function PostShareDialog({ open, setOpen, postId }) {
    const [body, setBody] = useState("");
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => sharePostApi(postId, body.trim() ? { body: body.trim() } : {}),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"]
            });

            setOpen(false);
            setBody("");
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