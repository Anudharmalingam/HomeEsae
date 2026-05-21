const run = async () => {
  const email = 'test' + Date.now() + '@example.com';
  console.log('--- Testing User Flow ---');
  const data = await register(email, 'user');
  if (data && data.userId && data.devOtp) {
    await verify(data.userId, data.devOtp);
    await login(email);
  }

  const workerEmail = 'worker' + Date.now() + '@example.com';
  console.log('\n--- Testing Worker Flow ---');
  const workerData = await register(workerEmail, 'worker');
  if (workerData && workerData.userId && workerData.devOtp) {
    await verify(workerData.userId, workerData.devOtp);
    await login(workerEmail);
  }
};

const register = async (email, role) => {
  try {
    const payload = {
      name: 'Test ' + role,
      email: email,
      phone: '1234567890',
      password: 'password123',
      role: role
    };

    if (role === 'worker') {
      payload.workerDetails = {
        category: 'maid',
        experience: 5,
        pricing: {
          amount: 200,
          type: 'hour'
        }
      };
    }

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Register Response:', data);
    return data;
  } catch (err) {
    console.error('Register Error:', err.message);
  }
};

const verify = async (userId, otp) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp })
    });
    const data = await res.json();
    console.log('Verify OTP Response:', data);
  } catch (err) {
    console.error('Verify Error:', err.message);
  }
};

const login = async (email) => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    });
    const data = await res.json();
    console.log('Login Response:', data);
  } catch (err) {
    console.error('Login Error:', err.message);
  }
};

run();



