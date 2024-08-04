import { Library } from "@/models/Library";

export interface ApiResponse {
    success: boolean;
    message: string;
    token?: string;
    libary?: Library;
    // TODO: Adding data as array of objects
    // data?:Array[];
}