import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Anchor,
  Stack,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconInfoCircle } from '@tabler/icons-react';
import { useAuth } from '@context/AuthContext';
import { AxiosError } from 'axios';
import SkedifyLogo from '@components/SkedifyLogo';

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 1 ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully!',
        color: 'green',
      });
      navigate('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Login Failed',
        message: axiosError.response?.data?.error || 'An error occurred',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={480} my={40}>
      <Stack align="center" gap="xl">
        <Stack align="center" gap="md">
          <SkedifyLogo size={100} className="skedify-logo" />
          <Title
            order={1}
            ta="center"
            size="3rem"
            style={{
              color: 'white',
              fontWeight: 800,
              textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)'
            }}
          >
            Welcome to <span className="skedify-brand-text">Skedify</span>
          </Title>
          <Text
            ta="center"
            size="lg"
            fw={500}
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            Your beautiful scheduling solution
          </Text>
        </Stack>

        <Paper
          p={40}
          radius="md"
          w="100%"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="lg">
              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                size="lg"
                radius="sm"
                styles={{
                  label: {
                    fontWeight: 600,
                    color: 'white',
                    marginBottom: '8px'
                  },
                  input: {
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white'
                  }
                }}
                {...form.getInputProps('email')}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                required
                size="lg"
                radius="sm"
                styles={{
                  label: {
                    fontWeight: 600,
                    color: 'white',
                    marginBottom: '8px'
                  },
                  input: {
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white'
                  }
                }}
                {...form.getInputProps('password')}
              />

              <Button
                type="submit"
                fullWidth
                size="xl"
                radius="md"
                className="skedify-button-primary"
                loading={loading}
                p="lg"
                styles={{
                  root: {
                    height: '60px',
                    fontSize: '18px',
                    fontWeight: 700
                  }
                }}
              >
                Sign In ✨
              </Button>
            </Stack>
          </form>

          <Text ta="center" mt="xl" size="md" style={{ color: 'white' }}>
            Don&apos;t have an account?{' '}
            <Anchor component={Link} to="/register" fw={600} style={{ color: 'var(--skedify-warning)' }}>
              Create account
            </Anchor>
          </Text>
        </Paper>

        <Alert
          icon={<IconInfoCircle size="1.2rem" />}
          radius="md"
          p="lg"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Text fw={600} size="md" style={{ color: 'white' }}>
            <strong>Demo App:</strong> This is a demo scheduling application. Create an account to start managing your calendar and bookings.
          </Text>
        </Alert>
      </Stack>
    </Container>
  );
};

export default Login;