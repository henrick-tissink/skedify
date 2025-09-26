import React, { useState, useEffect } from 'react';
import {
  Title,
  Button,
  Card,
  Text,
  Stack,
  Group,
  Modal,
  TextInput,
  Select,
  ActionIcon,
  Badge,
  LoadingOverlay,
  CopyButton,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash, IconCopy, IconCheck, IconClock, IconLink } from '@tabler/icons-react';
import { apiClient } from '@api/client';
import type { SessionType } from '@types';
import { AxiosError } from 'axios';

interface SessionTypeForm {
  name: string;
  duration_minutes: string;
  description: string;
}

const SessionTypeManagement: React.FC = () => {
  const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingSession, setEditingSession] = useState<SessionType | null>(null);

  const form = useForm<SessionTypeForm>({
    initialValues: {
      name: '',
      duration_minutes: '30',
      description: '',
    },
    validate: {
      name: (value) => (value.length < 1 ? 'Name is required' : null),
      duration_minutes: (value) =>
        !value ? 'Duration is required' : null,
      description: (value) => null, // Optional field, no validation needed
    },
  });

  useEffect(() => {
    fetchSessionTypes();
  }, []);

  const fetchSessionTypes = async () => {
    try {
      const response = await apiClient.get<{ sessionTypes: SessionType[] }>('/session-types');
      setSessionTypes(response.data.sessionTypes);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch session types',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: SessionTypeForm) => {
    try {
      const payload = {
        name: values.name,
        duration_minutes: parseInt(values.duration_minutes, 10),
        description: values.description
      };

      if (editingSession) {
        await apiClient.put(`/session-types/${editingSession.id}`, payload);
        notifications.show({
          title: 'Success',
          message: 'Session type updated successfully',
          color: 'green',
        });
      } else {
        await apiClient.post('/session-types', payload);
        notifications.show({
          title: 'Success',
          message: 'Session type created successfully',
          color: 'green',
        });
      }
      fetchSessionTypes();
      close();
      form.reset();
      setEditingSession(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Failed to save session type',
        color: 'red',
      });
    }
  };

  const handleEdit = (sessionType: SessionType) => {
    setEditingSession(sessionType);
    form.setValues({
      name: sessionType.name,
      duration_minutes: sessionType.duration_minutes.toString(),
      description: sessionType.description || '',
    });
    open();
  };

  const handleDelete = async (sessionType: SessionType) => {
    try {
      await apiClient.delete(`/session-types/${sessionType.id}`);
      notifications.show({
        title: 'Success',
        message: 'Session type deleted successfully',
        color: 'green',
      });
      fetchSessionTypes();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Failed to delete session type',
        color: 'red',
      });
    }
  };

  const openCreateModal = () => {
    setEditingSession(null);
    form.reset();
    open();
  };

  const getBookingUrl = (uniqueLink: string) => {
    return `${window.location.origin}/book/${uniqueLink}`;
  };

  if (loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack>
      <Group justify="space-between" mb="xl">
        <Title order={2} style={{ color: 'white', fontWeight: 700 }}>Session Types</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openCreateModal}
          className="skedify-button-primary"
          radius="md"
          size="lg"
        >
          Add Session Type
        </Button>
      </Group>

      {sessionTypes.length === 0 ? (
        <Card
          padding="xl"
          radius="md"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
        >
          <Stack align="center" py="xl">
            <IconClock size={48} color="var(--skedify-accent)" />
            <Text ta="center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              No session types created yet. Create your first session type to start accepting bookings.
            </Text>
            <Button onClick={openCreateModal} className="skedify-button-primary" radius="md">Create Session Type</Button>
          </Stack>
        </Card>
      ) : (
        <Stack gap="md">
          {sessionTypes.map((sessionType) => (
            <Card
              key={sessionType.id}
              padding="lg"
              radius="md"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s ease'
              }}
            >
              <Stack gap="sm">
                <Group justify="space-between" align="flex-start">
                  <Stack gap={4}>
                    <Group gap="sm">
                      <Text fw={600} size="lg" style={{ color: 'white' }}>
                        {sessionType.name}
                      </Text>
                      <Badge className="skedify-badge" size="md">
                        {sessionType.duration_minutes} min
                      </Badge>
                    </Group>
                    {sessionType.description && (
                      <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)', fontStyle: 'italic' }}>
                        {sessionType.description}
                      </Text>
                    )}
                    <Group gap="xs">
                      <IconLink size={14} color="var(--skedify-secondary)" />
                      <Text size="sm" style={{ fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.7)' }}>
                        {getBookingUrl(sessionType.unique_link)}
                      </Text>
                    </Group>
                  </Stack>
                  <Group gap="xs">
                    <CopyButton value={getBookingUrl(sessionType.unique_link)}>
                      {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copied' : 'Copy link'}>
                          <ActionIcon variant="subtle" onClick={copy}>
                            {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
                    <ActionIcon variant="subtle" onClick={() => handleEdit(sessionType)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(sessionType)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Stack>
            </Card>
          ))}
        </Stack>
      )}

      <Modal
        opened={opened}
        onClose={close}
        title={editingSession ? 'Edit Session Type' : 'Create Session Type'}
        radius="md"
        styles={{
          content: {
            background: 'rgba(20, 20, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
          header: {
            background: 'transparent',
          },
          title: {
            color: 'white',
            fontWeight: 700,
            fontSize: '1.2rem'
          }
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Session Name"
              placeholder="1-on-1 Consultation"
              required
              size="md"
              radius="sm"
              styles={{
                label: { fontWeight: 600, color: 'white', marginBottom: '8px' },
                input: {
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }
              }}
              {...form.getInputProps('name')}
            />
            <Select
              label="Duration"
              placeholder="Select duration"
              required
              size="md"
              radius="sm"
              styles={{
                label: { fontWeight: 600, color: 'white', marginBottom: '8px' },
                input: {
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }
              }}
              data={[
                { value: '30', label: '30 minutes' },
                { value: '60', label: '1 hour' },
                { value: '90', label: '1.5 hours' },
                { value: '120', label: '2 hours' }
              ]}
              {...form.getInputProps('duration_minutes')}
            />
            <TextInput
              label="Description (Optional)"
              placeholder="Brief description of this session type..."
              size="md"
              radius="sm"
              styles={{
                label: { fontWeight: 600, color: 'white', marginBottom: '8px' },
                input: {
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white'
                }
              }}
              {...form.getInputProps('description')}
            />
            <Group justify="flex-end">
              <Button
                type="submit"
                className="skedify-button-primary"
                radius="sm"
                size="md"
              >
                {editingSession ? 'Update' : 'Create'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
};

export default SessionTypeManagement;