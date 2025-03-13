import { UserModel } from '../../Models/User/UserModel';
import { UserUpdateModel } from '../../Models/User/UserUpdateModel';
import { UserLoginModel } from '../../Models/User/UserLoginModel';
import { UserCreateModel } from '../../Models/User/UserCreateModel';

export interface IUserService {
    Create(user: UserCreateModel): Promise<any>;
    Update(user: UserUpdateModel): Promise<any>;
    GetUserByUsername(user: string, userLog: string): Promise<any>;
    GetUserByID(id: string | undefined): Promise<any>;
    ChangeStatus(id: string): Promise<any>;
    LogIn(user: UserLoginModel): Promise<any>;
    RecoverCount(user: UserModel): Promise<any>;
    SearchUser(key: string, section: number): Promise<any>;
    GetExplorerUsers(section: number): Promise<any>;
}