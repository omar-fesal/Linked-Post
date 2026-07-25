import { Button, Dropdown } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function PhotoDropDownMenu({ logout }) {
    const { isLogged, setIsLogged, userData, setUserData } = useContext(AuthContext)
    const navigate = useNavigate()

    function handleAction(key) {
        if (key === 'change-password') {
            navigate('/change-password')
        }
    }

    return (
        <Dropdown>
            <Button
                aria-label="Menu"
                variant="light"
                className="p-0 min-w-0 bg-transparent"
            >
                <div className="flex items-center gap-1">
                    <img
                        src={userData?.photo}
                        alt="user"
                        className="w-10 h-10 rounded-full"
                    />
                    <ChevronDown size={16} />
                </div>
            </Button>
            <Dropdown.Popover>
                <Dropdown.Menu onAction={handleAction}>
                    <Dropdown.Item id="change-password" key="change-password">
                        Change Password
                    </Dropdown.Item>

                    <Dropdown.Item
                        id="logout"
                        key="logout"
                        className="text-danger"
                        color="danger"
                        onClick={logout}
                    >
                        Logout
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}