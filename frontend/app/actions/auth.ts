'use server'

import  {redirect}  from "next/navigation"
import { cookies } from "next/headers"


export async function login(formData: FormData)
{
    const email = formData.get('email')
    const password = formData.get('password')
    let userRole = 'employee';

    try{
    const res = await fetch('http://127.0.0.1:8000/api/auth/login/',
        {
            method : 'POST',
            body : JSON.stringify({email , password}),
            headers: {'Content-Type':'application/json'}
        }
    )

    if(!res.ok)
    {
        const data = await res.json()
        throw new Error(data.error || "Login failed")
    }
    
    const data = await res.json()
    
    const cookieStore = await cookies()
    cookieStore.set('user_email', email as string, { httpOnly: true, secure: true })
    cookieStore.set('user_token', data.token, { httpOnly: true, secure: true })
    
    console.log("login successful")
    userRole = data.role;    
}   

catch(error: any)
{
    console.log(error)
    throw error
}

if(userRole == 'admin')
{
    redirect("/admindashboard")
}
redirect("/dashboard")
}


export async function register(formData:FormData)
{
    const email = formData.get("email");
    const password = formData.get("password");
    const username = formData.get("username");
    const phone_number = formData.get("phonenumber")
    const role = formData.get("role") || "employee";

    try{    
    const res = await fetch('http://127.0.0.1:8000/api/auth/register/',
        {
            method:'POST',
            body: JSON.stringify({username , email , password , phone_number, role}),
            headers: {'Content-Type':'application/json'}
        }
    )

    if(!res.ok)
    {
        const data = await res.json()
        throw new Error(data.error || "Registration failed")
    }
    
    const data = await res.json();
    console.log("Registration successful")
}

catch(error: any)
{
    console.log(error);
    throw error
}
    redirect("/")
}
























