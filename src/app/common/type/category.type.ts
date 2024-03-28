import { Pill } from "../enum";

export type Category = {
    id: number;
    group?: {
        id: number;
        name: string;
        color: Pill;
    };
    wording: string;
    description: string;
}