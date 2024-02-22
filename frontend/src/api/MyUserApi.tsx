import { useMutation } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {

    id: string,
    email: string,
};


export const useCreateMyUser = () => {
    const createMyUserRequest = async (user: CreateUserRequest) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/my/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                throw new Error("FAILED TO CREATE USER");
            }

            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    };

    const { mutateAsync: createUser, isLoading, isError, isSuccess } = useMutation(createMyUserRequest);

    return {
        createUser, isLoading, isError, isSuccess
    };
};
