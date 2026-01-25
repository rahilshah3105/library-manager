import { Injectable } from '@angular/core';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
    username: string;
    role: UserRole;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly STORAGE_KEY = 'library_auth_user';
    private currentUser: AuthUser | null = null;

    constructor() {
        this.loadUser();
    }

    private loadUser(): void {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }

    private saveUser(): void {
        if (this.currentUser) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem(this.STORAGE_KEY);
        }
    }

    login(username: string, password: string): boolean {
        // Simplified flow: Any credential grants 'admin' access
        if (username.trim() && password.trim()) {
            this.currentUser = { username, role: 'admin' };
            this.saveUser();
            return true;
        }

        return false;
    }

    logout(): void {
        this.currentUser = null;
        this.saveUser();
    }

    getCurrentUser(): AuthUser | null {
        return this.currentUser;
    }

    isLoggedIn(): boolean {
        return this.currentUser !== null;
    }

    isAdmin(): boolean {
        return this.currentUser?.role === 'admin';
    }

    isUser(): boolean {
        return this.currentUser?.role === 'user';
    }

    getRole(): UserRole | null {
        return this.currentUser?.role || null;
    }

    getUsername(): string {
        return this.currentUser?.username || '';
    }
}
