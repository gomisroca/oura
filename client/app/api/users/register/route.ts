const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import prisma from "@/utils/db";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RegisterInputs {
    firstName: string;
    lastName: string;
    email: string; 
    password: string;
    role?: Role;
}

export async function POST(request: NextRequest) {
    try {
        const req = await request.json()
        const { firstName, lastName, email, password, role }: RegisterInputs = req;
        
        if (!(email && password && firstName && lastName)) {
            return NextResponse.json("All input is required", { status: 400 });
        }
 
        const existingUser: User | null = await prisma.user.findUnique({ 
            where: {
                email: email.toLowerCase(),
            },
        })

        if (existingUser) {
            return NextResponse.json("User already exists", { status: 409 });
        }
    
        //Encrypt user password
        let encryptedPassword: string = await bcrypt.hash(password, 10);
    
        // Create user in our database
        let user: User = await prisma.user.create({ 
            data: { 
                firstName: firstName,
                lastName: lastName,
                email: email.toLowerCase(),
                password: encryptedPassword 
            }
        });

        if(role){
            user = await prisma.user.update({ 
                where: {
                    id: user.id,
                },
                data: { 
                    role: role 
                }
            });
        }
        
        let access_token: string = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                firstName: user.firstName, 
                lastName: user.lastName, 
                role: user.role  
            },
            process.env.TOKEN_KEY
        );
    
        return NextResponse.json(access_token, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json("UNCAUGHT_ERROR", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}