import { Pill } from "../enum";

export type Group = {
    id: number;
    name: string;
    color: Pill;
    categories: {
        id: number;
        wording: string;
        description: string;
    }[];
}

