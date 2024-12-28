import * as React from 'react';

interface VerificationEmailProps {
    username: string;
    otp: string;
}


export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
        <div>
            <h1>Welcome, {username}!</h1>
            <h3>Here is your Verification Code: {otp}</h3>
        </div>
    )
}