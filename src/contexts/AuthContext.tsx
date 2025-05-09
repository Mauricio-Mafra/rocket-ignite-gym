import { createContext, ReactNode, useEffect, useState } from 'react';

import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';

import {
    storageUserGet,
    storageUserSave,
    storageUserRemove,
} from '@storage/storageUser';
import {
    storageAuthTokenGet,
    storageAuthTokenRemove,
    storageAuthTokenSave,
} from '@storage/storageAuthToken';

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
    isLoadingUserStorageData: boolean;
};

type AuthContextProviderProps = {
    children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
    {} as AuthContextDataProps,
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO);
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
        useState(true);

    async function updateUserAndToken(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        setUser(userData);
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string) {
        try {
            setIsLoadingUserStorageData(true);
            await storageUserSave(userData);
            await storageAuthTokenSave(token);
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const { data } = await api.post('/sessions', { email, password });
            console.log(data);

            if (data.user && data.token) {
                await storageUserAndTokenSave(data.user, data.token);

                updateUserAndToken(data.user, data.token);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function signOut() {
        try {

            setIsLoadingUserStorageData(true);
            setUser({} as UserDTO);
            await storageUserRemove();
            await storageAuthTokenRemove();

        } catch (error) {
            throw error;

        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    async function updateUserProfile(updatedUser: UserDTO){
        try {
            setUser(updatedUser);
            await storageUserSave(updatedUser);

        } catch (error) {
            throw error;
        }
    }

    async function loadUserData() {
        try {
            setIsLoadingUserStorageData(false);

            const loggedUser = await storageUserGet();
            const token = await storageAuthTokenGet();

            if (token && loggedUser) {
                updateUserAndToken(loggedUser, token);
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                signIn,
                signOut,
                updateUserProfile,
                isLoadingUserStorageData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
