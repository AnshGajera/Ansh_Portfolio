// Test script for contact form API
const testContact = async () => {
    try {
        const response = await fetch('https://portfolio-backend-mu-blush.vercel.app/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message from the portfolio contact form to verify email functionality.',
            }),
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testContact();
