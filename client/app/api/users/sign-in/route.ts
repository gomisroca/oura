const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import prisma from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface LoginInputs {
    email: string; 
    password: string;
    keepAlive: boolean
}

export async function POST(request: NextRequest) {
    try {
        const req = await request.json()
        const { email, password, keepAlive }: LoginInputs = req;

        if (!(email && password)) {
            NextResponse.json("INVALID_INPUT", { status: 400 });
        } else {
            const user: User | null = await prisma.user.findUnique({ 
                where: {
                    email: email.toLowerCase(),
                },
            });

            let isPassValid: boolean = await bcrypt.compare(password, user?.password);

            if (user && isPassValid) {
                let access_token: string;
                if (keepAlive == true) {
                    access_token = jwt.sign(
                        { 
                            id: user.id, 
                            email: user.email, 
                            firstName: user.firstName, 
                            lastName: user.lastName, 
                            role: user.role  
                        },
                        process.env.TOKEN_KEY
                    );
                } else {
                    access_token = jwt.sign(
                        { 
                            id: user.id, 
                            email: user.email, 
                            firstName: user.firstName, 
                            lastName: user.lastName, 
                            role: user.role 
                        },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn: "1h",
                        }
                    );
                }
                console.log(access_token)
                return NextResponse.json(access_token, { status: 200 });
            } else {
                return NextResponse.json("INVALID_CREDENTIALS", { status: 403 });
            }
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json("UNCAUGHT_ERROR", { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}