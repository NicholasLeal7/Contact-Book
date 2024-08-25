import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getAll = async (id: number) => {
    try {
        return await prisma.contact.findMany({ where: { user_id: id } });
    } catch { return false };
};

export const getOne = async (user_id: number, contact_id: number) => {
    try {
        return await prisma.contact.findUnique({ where: { user_id, contact_id } });
    } catch { return false };
};

type CreateContact = Prisma.Args<typeof prisma.contact, 'create'>['data'];
export const add = async (data: CreateContact) => {
    try {
        return await prisma.contact.create({ data });
    } catch { return false };
};

type UpdateContact = Prisma.Args<typeof prisma.contact, 'update'>['data'];
export const update = async (id: number, data: UpdateContact) => {
    try {
        return await prisma.contact.update({ where: { contact_id: id }, data });
    } catch { return false };
};

export const remove = async (user_id: number, contact_id: number) => {
    try {
        return await prisma.contact.delete({ where: { user_id, contact_id } });
    } catch { return false };
};