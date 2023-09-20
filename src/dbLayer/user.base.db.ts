import User from "../model/user";
interface IUserObj {
    id: number;
    username?: string;
}
export const getOrCreateUser = async (userObj:IUserObj) => {
    const { id, username } = userObj;
    const user = await User.findOne({ id });
    if (!user) {
        const newUser = new User({ id });
        if (username) {
            newUser.username = username;
        }
        await newUser.save();
        return newUser;
    }
    return user;
};

export const addBalance = async (id: number, balance: number) => {
    const user = await getOrCreateUser({id});
    //console.log(`user.balance: ${user.balance},userid: ${id}, user:`, user);
    user.balance += balance;
    await user.save();
    return user.balance;
};
