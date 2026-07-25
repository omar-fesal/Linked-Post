import { Modal, Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { Heart } from '@gravity-ui/icons';
import { Link } from 'react-router-dom';
import { getPostLikesApi } from '../../Services/PostService';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export function PostLikesDialog({ open, setOpen, postId }) {
    const { userData } = useContext(AuthContext);

    const { data, isLoading } = useQuery({
        queryKey: ['post-likes', postId],
        queryFn: () => getPostLikesApi(postId),
        enabled: !!open && !!postId,
    });

    const likes = data?.data?.likes || [];
    const total = data?.meta?.pagination?.total ?? 0;

    return (
        <Modal isOpen={open} onOpenChange={setOpen}>
            <Modal.Backdrop variant="blur">
                <Modal.Container>
                    <Modal.Dialog className="sm:max-w-md w-full">
                        <Modal.CloseTrigger />

                        {/* Header */}
                        <Modal.Header>
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-500 w-7 h-7 rounded-full flex items-center justify-center">
                                    <Heart className="w-4 h-4 text-white" />
                                </div>
                                <Modal.Heading className="text-lg font-semibold">
                                    {total} {total === 1 ? 'Like' : 'Likes'}
                                </Modal.Heading>
                            </div>
                        </Modal.Header>

                        {/* Body */}
                        <Modal.Body className="py-2 max-h-[60vh] overflow-y-auto">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-10">
                                    <Spinner />
                                </div>
                            ) : likes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
                                    <Heart className="w-8 h-8 opacity-30" />
                                    <p className="text-sm">No likes yet</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {likes.map((user) => {
                                        const isMe = user._id === userData?._id;
                                        return (
                                            <li key={user._id}>
                                                <Link
                                                    to={isMe ? '/profile' : `/user/${user._id}`}
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-3 px-1 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <img
                                                        src={user.photo}
                                                        alt={user.name}
                                                        className="w-11 h-11 rounded-full object-cover shrink-0 ring-2 ring-white shadow"
                                                    />
                                                    <div className="flex flex-col leading-tight min-w-0">
                                                        <span className="text-sm font-semibold text-gray-900 truncate">
                                                            {user.name}
                                                            {isMe && (
                                                                <span className="ml-1 text-xs font-normal text-blue-500">
                                                                    (You)
                                                                </span>
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-gray-400 truncate">
                                                            @{user.username}
                                                        </span>
                                                    </div>

                                                    {/* follower/following mini stats */}
                                                    <div className="ml-auto flex gap-3 text-xs text-gray-400 shrink-0">
                                                        <span>
                                                            <span className="font-semibold text-gray-600">
                                                                {user.followersCount}
                                                            </span>{' '}
                                                            followers
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
