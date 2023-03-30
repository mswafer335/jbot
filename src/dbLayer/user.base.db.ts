import User from "../model/user";

export const getOrCreateUser = async (id: number) => {
    const user = await User.findOne({ id });
    if (!user) {
        const newUser = new User({ id });
        await newUser.save();
        return newUser;
    }
    return user;
};

export const addBalance = async (id: number, balance: number) => {
    const user = await getOrCreateUser(id);
    //console.log(`user.balance: ${user.balance},userid: ${id}, user:`, user);
    user.balance += balance;
    await user.save();
    return user.balance;
};
