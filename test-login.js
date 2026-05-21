const login = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com', // Replace with a known verified email if possible
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log('Login Response:', data);
  } catch (err) {
    console.error('Login Error:', err.message);
  }
};

login();
