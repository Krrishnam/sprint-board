import api from "@/lib/axios";
import{
    RegisterRequest,
    LoginRequest,
    AuthResponse
} from "@/types/auth";

export const registerUser = async(
    data : RegisterRequest
) => {
    const response = await api.post("/auth/register",data);

    return response.data;
};

export const loginUser = async(
    data: LoginRequest
): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
        "/auth/login",
        data
    );

    return response.data;
}
