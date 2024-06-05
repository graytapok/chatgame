import { useMutation } from "@tanstack/react-query";
import { apiClient } from "..";

interface ForgotPasswordParams {
    login: string;
}

const postForgotPassword = async (params: ForgotPasswordParams) => {
    const res = await apiClient.post("/auth/forgot_password", params)
    return res.data
}

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: postForgotPassword,
        mutationKey: ["auth", "forgotPassword"]
    })
}