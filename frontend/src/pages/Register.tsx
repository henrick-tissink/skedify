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
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useAuth } from '@context/AuthContext';
import { AxiosError } from 'axios';
import SkedifyLogo from '@components/SkedifyLogo';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterForm>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
    },
    validate: {
      username: (value) => (value.length < 3 ? 'Username must be at least 3 characters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
      first_name: (value) => (value.length < 1 ? 'First name is required' : null),
      last_name: (value) => (value.length < 1 ? 'Last name is required' : null),
    },
  });

  const handleSubmit = async (values: RegisterForm) => {
    setLoading(true);
    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
      });
      notifications.show({
        title: 'Success',
        message: 'Account created successfully!',
        color: 'green',
      });
      navigate('/dashboard');
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Registration Failed',
        message: axiosError.response?.data?.error || 'An error occurred',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={540} my={40}>
      <Stack align="center" gap="xl">
        <Stack align="center" gap="md">
          <SkedifyLogo size={80} className="skedify-logo" />
          <Title order={1} ta="center" style={{ color: 'white', fontWeight: 800, textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)' }}>
            Create your <span className="skedify-brand-text">Skedify</span> account
          </Title>
          <Text ta="center" size="lg" style={{ color: 'rgba(255, 255, 255, 0.8)', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.2)' }}>
            Join the beautiful scheduling revolution
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
              <Group grow>
                <TextInput
                  label="First Name"
                  placeholder="John"
                  required
                  size="lg"
                  radius="sm"
                  styles={{
                    label: { fontWeight: 600, color: 'white', marginBottom: '8px' },
                    input: { background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }
                  }}
                  {...form.getInputProps('first_name')}
                />

                <TextInput
                  label="Last Name"
                  placeholder="Doe"
                  required
                  size="lg"
                  radius="sm"
                  styles={{
                    label: { fontWeight: 600, color: 'white', marginBottom: '8px' },
                    input: { background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }
                  }}
                  {...form.getInputProps('last_name')}
                />
              </Group>

              <TextInput
                label="Username"
                placeholder="johndoe"
                required
                size="lg"
                radius="sm"
                styles={{
                  label: { fontWeight: 600, color: 'white', marginBottom: '8px' },
                  input: { background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }
                }}
                {...form.getInputProps('username')}
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                size="lg"
                radius="sm"
                styles={{
                  label: { fontWeight: 600, color: 'white', marginBottom: '8px' },
                  input: { background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }
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
                  label: { fontWeight: 600, color: 'white', marginBottom: '8px' },
                  input: { background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }
                }}
                {...form.getInputProps('password')}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                size="lg"
                radius="sm"
                styles={{
                  label: { fontWeight: 600, color: 'white', marginBottom: '8px' },
                  input: { background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.3)', color: 'white' }
                }}
                {...form.getInputProps('confirmPassword')}
              />

              <Button
                type="submit"
                fullWidth
                size="xl"
                radius="sm"
                className="skedify-button-primary"
                loading={loading}
                p="lg"
                styles={{
                  root: { height: '60px', fontSize: '18px', fontWeight: 700 }
                }}
              >
                Create Account 🚀
              </Button>
            </Stack>
          </form>

          <Text ta="center" mt="xl" size="md" style={{ color: 'white' }}>
            Already have an account?{' '}
            <Anchor component={Link} to="/login" fw={600} style={{ color: 'var(--skedify-warning)' }}>
              Sign in
            </Anchor>
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
};

export default Register;