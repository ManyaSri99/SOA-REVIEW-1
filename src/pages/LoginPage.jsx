import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import { getApiErrorMessage } from '../utils/helpers';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      // Send login details to Spring Boot backend
      const response = await authService.login({
        username: form.username.trim(),
        password: form.password,
      });

      console.log('Login response:', response);

      // Get JWT token
      const token = response.token || response.accessToken;

      // Get user details returned by backend
      const user = response.user || {
        username: response.username || form.username,
        name: response.name || response.username || form.username,
        email: response.email || '',
        role: response.role || 'CUSTOMER',
      };

      // Check token
      if (!token) {
        throw new Error('Authentication token missing in login response.');
      }

      // Save user and token
      login(user, token);

      console.log('Logged in user:', user);

      // Redirect according to role
      if (user.role === 'HOTEL_MANAGER') {
        navigate('/manager/dashboard');
      } else if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error('Login error:', err);

      setError(
        getApiErrorMessage(
          err,
          'Unable to login. Please check your username and password.'
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h2>Welcome back</h2>

        <p>
          Sign in to manage your stays and reservations.
        </p>

        {/* Error message */}
        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="auth-form">

          {/* Username */}
          <label>
            Username

            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </label>

          {/* Password */}
          <label>
            Password

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </label>

          {/* Login button */}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>

        </form>

        <p className="switch-auth">
          Need an account?{' '}
          <Link to="/register">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;