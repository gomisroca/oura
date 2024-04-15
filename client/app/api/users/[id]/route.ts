import { verifyUser } from "@/utils/auth";
import prisma from "@/utils/db";
import { Role, User } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

interface UpdateInputs{
    firstName: string; 
    lastName: string; 
    email: string; 
    role: Role;
    new_password?: string;
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user: User | null = await prisma.user.findUnique({
            where: {
                id: params.id
            }
        });
        if (user){
            return NextResponse.json(user, { status: 200 });
        } else{
            return NextResponse.json('USER_404', { status: 404 })
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json("UNCAUGHT_ERROR", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { firstName, lastName, email, role, new_password }: UpdateInputs = await req.json();

        const user: User | null = await prisma.user.findUnique({
            where: {
                id: params.id
            }
        });

        if(user){
            const session_user = verifyUser(req.headers);

            if(session_user && session_user.id !== user.id && session_user.role !== 'ADMIN'){
                return NextResponse.json({ message: 'INVALID_CREDENTIALS'}, { status: 403 });
            }
            if(firstName.toLowerCase() !== user.firstName.toLowerCase()){
                user.firstName = firstName;
            }
            if(lastName !== user.lastName.toLowerCase()){
                user.lastName = lastName;
            }
            if(email.toLowerCase() !== user.email.toLowerCase()){
                user.email = email.toLowerCase();
            } 
            if(role !== user.role){
                user.role = role as Role;
            }
            if(new_password){
                let encryptedPassword: string = await bcrypt.hash(new_password, 10);
                user.password = encryptedPassword;
            }

            const updatedUser: User = await prisma.user.update({ 
                where: {
                    email: email.toLowerCase(),
                },
                data: user,
            })

            let access_token: string = jwt.sign(
                { 
                    id: updatedUser.id, 
                    email: updatedUser.email, 
                    firstName: updatedUser.firstName, 
                    lastName: updatedUser.lastName, 
                    role: updatedUser.role 
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h",
                }
            );

            return NextResponse.json(access_token, { status: 200 });
        } else{
            return NextResponse.json('INVALID_CREDENTIALS', { status: 403 })
        }
    } catch (err) {
        console.log(err)
        return NextResponse.json("UNCAUGHT_ERROR", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
){
    try{
        const user: User | null = await prisma.user.findUnique({ 
            where: {
                id: params.id,
            },
        })
        
        if(user){
            const session_user = verifyUser(req.headers);

            if(session_user && session_user.id !== user.id && session_user.role !== 'ADMIN'){
                return NextResponse.json({ message: 'INVALID_CREDENTIALS'}, { status: 403 });
            }
            await prisma.user.delete({ 
                where: {
                    id: params.id,
                }
            });
            return NextResponse.json({ status: 200 })
        }
    } catch(err: unknown){
        return NextResponse.json({message: err},  { status: 500 })
    } finally {
        await prisma.$disconnect();
    } 
}