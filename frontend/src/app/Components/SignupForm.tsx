import { useRouter } from 'next/navigation';
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

interface FormData {
    username: string
    email: string
    password1: string
    password2: string
}

const getCookie = (name: string): string | null => {
    const cookieValue = document.cookie.split('; ')
        .find((row) => row.startsWith(name + '='))?.split('=')[1];
    return cookieValue ? decodeURIComponent(cookieValue) : null;
};

const SignupForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password1: '',
        password2: ''
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        fetch('http://localhost:8000/spotify/get-csrf-token/', {
            credentials: 'include',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
        .catch((error) => {
            console.error('Error fetching CSRF token:', error);
        });
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value});
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const csrfToken = getCookie('csrftoken');

        try {
            const response = await fetch('http://localhost:8000/spotify/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': csrfToken || '',
                },
                body: new URLSearchParams({
                    username: formData.username,
                    email: formData.email,
                    password1: formData.password1,
                    password2: formData.password2,
                }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Sign-Up Successful:', data);
                setErrorMessage(null);
                router.push('dashboard/');
            } else if (response.status === 400) {
                const errorData = await response.json();
                console.error('Unexpected 400 Error:', errorData);

                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join(' ');
                    setErrorMessage(errorMessages);
                } else {
                    setErrorMessage('Unexpected Error. Try Again');
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'An error occured. Please try again.');
            }
        } catch (error) {
            console.error('Unexpected Error:', error);
            setErrorMessage('An Unexpected Error Occured. Please try again.')
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div>
                <label>Email:</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password1" value={formData.password1} onChange={handleChange} />
            </div>
            <div>
                <label>Retype Password:</label>
                <input type="password" name="password2" value={formData.password2} onChange={handleChange} />
            </div>
            <button type="submit">Sign Up!</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    )
}

export default SignupForm;