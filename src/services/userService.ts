import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createUser = async (data: Prisma.UserCreateInput) => {
    try {
        return prisma.user.create({ data });
    } catch (err) { return false }
};

export const findUserByEmail = async (email: string) => {
    try {
        return prisma.user.findUnique({ where: { email } });
    } catch (err) { return false }
};

export const findUserById = async (id: number) => {
    try {
        return prisma.user.findUnique({ where: { user_id: id } });
    } catch (err) { return false }
};

type UserUpdate = Prisma.Args<typeof prisma.user, 'update'>['data'];
export const update = async (id: number, data: UserUpdate) => {
    try {
        return prisma.user.update({ where: { user_id: id }, data });
    } catch (err) { return false }
};