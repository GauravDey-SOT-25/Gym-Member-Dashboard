// api.js
import { API } from "./js/data.js";

export async function fetchMemberProfile() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, data: API.getMember() });
        }, 1000);
    });
}

export async function fetchMembershipStatus() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, data: API.getMembership() });
        }, 1200);
    });
}