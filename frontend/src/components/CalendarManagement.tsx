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
  Textarea,
  ActionIcon,
  Grid,
  Badge,
  LoadingOverlay,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash, IconCalendar } from '@tabler/icons-react';
import { apiClient } from '@api/client';
import type { Calendar, CalendarEvent } from '@types';
import { AxiosError } from 'axios';

interface CalendarForm {
  name: string;
  description: string;
}

const CalendarManagement: React.FC = () => {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCalendar, setSelectedCalendar] = useState<Calendar | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);

  const form = useForm<CalendarForm>({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => (value.length < 1 ? 'Name is required' : null),
    },
  });

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const response = await apiClient.get<{ calendars: Calendar[] }>('/calendars');
      setCalendars(response.data.calendars);
      if (response.data.calendars.length > 0 && !selectedCalendar) {
        setSelectedCalendar(response.data.calendars[0]);
        fetchEvents(response.data.calendars[0].id);
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch calendars',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async (calendarId: number) => {
    try {
      const response = await apiClient.get<{ events: CalendarEvent[] }>(`/calendars/${calendarId}/events`);
      setEvents(response.data.events);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch events',
        color: 'red',
      });
    }
  };

  const handleSubmit = async (values: CalendarForm) => {
    try {
      if (editingCalendar) {
        await apiClient.put(`/calendars/${editingCalendar.id}`, values);
        notifications.show({
          title: 'Success',
          message: 'Calendar updated successfully',
          color: 'green',
        });
      } else {
        await apiClient.post('/calendars', values);
        notifications.show({
          title: 'Success',
          message: 'Calendar created successfully',
          color: 'green',
        });
      }
      fetchCalendars();
      close();
      form.reset();
      setEditingCalendar(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Failed to save calendar',
        color: 'red',
      });
    }
  };

  const handleEdit = (calendar: Calendar) => {
    setEditingCalendar(calendar);
    form.setValues({
      name: calendar.name,
      description: calendar.description || '',
    });
    open();
  };

  const handleDelete = async (calendar: Calendar) => {
    try {
      await apiClient.delete(`/calendars/${calendar.id}`);
      notifications.show({
        title: 'Success',
        message: 'Calendar deleted successfully',
        color: 'green',
      });
      fetchCalendars();
      if (selectedCalendar?.id === calendar.id) {
        setSelectedCalendar(null);
        setEvents([]);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Failed to delete calendar',
        color: 'red',
      });
    }
  };

  const openCreateModal = () => {
    setEditingCalendar(null);
    form.reset();
    open();
  };

  if (loading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Stack>
      <Group justify="space-between" mb="xl">
        <Title order={2} style={{ color: 'white', fontWeight: 700 }}>Calendar Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openCreateModal}
          className="skedify-button-primary"
          radius="md"
          size="lg"
        >
          Add Calendar
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Title order={3} size="h4" mb="md" style={{ color: 'white', fontWeight: 600 }}>
            Your Calendars
          </Title>
          <Stack gap="xs">
            {calendars.map((calendar) => (
              <Card
                key={calendar.id}
                padding="lg"
                radius="md"
                style={{
                  cursor: 'pointer',
                  background: selectedCalendar?.id === calendar.id
                    ? 'rgba(78, 205, 196, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: selectedCalendar?.id === calendar.id
                    ? '2px solid rgba(78, 205, 196, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  setSelectedCalendar(calendar);
                  fetchEvents(calendar.id);
                }}
              >
                <Group justify="space-between">
                  <Stack gap={2}>
                    <Text fw={600} style={{ color: 'white' }}>{calendar.name}</Text>
                    {calendar.description && (
                      <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {calendar.description}
                      </Text>
                    )}
                  </Stack>
                  <Group gap="xs">
                    <ActionIcon
                      variant="subtle"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(calendar);
                      }}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(calendar);
                      }}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 8 }}>
          {selectedCalendar ? (
            <Stack>
              <Title order={3} size="h4" style={{ color: 'white', fontWeight: 600 }}>
                {selectedCalendar.name} Events
              </Title>
              {events.length === 0 ? (
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
                    <IconCalendar size={48} color="var(--skedify-secondary)" />
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>No events in this calendar</Text>
                  </Stack>
                </Card>
              ) : (
                <Stack gap="xs">
                  {events.map((event) => (
                    <Card
                      key={event.id}
                      padding="md"
                      radius="md"
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <Group justify="space-between">
                        <Stack gap={2}>
                          <Text fw={600} style={{ color: 'white' }}>{event.title}</Text>
                          <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            {new Date(event.start_time).toLocaleString()} -{' '}
                            {new Date(event.end_time).toLocaleString()}
                          </Text>
                          {event.description && (
                            <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                              {event.description}
                            </Text>
                          )}
                        </Stack>
                        {event.booking_id && (
                          <Badge className="skedify-badge" size="md">
                            Booking
                          </Badge>
                        )}
                      </Group>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          ) : (
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
                <IconCalendar size={48} color="var(--skedify-accent)" />
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Select a calendar to view events</Text>
              </Stack>
            </Card>
          )}
        </Grid.Col>
      </Grid>

      <Modal
        opened={opened}
        onClose={close}
        title={editingCalendar ? 'Edit Calendar' : 'Create Calendar'}
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
              label="Calendar Name"
              placeholder="My Calendar"
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
            <Textarea
              label="Description"
              placeholder="Calendar description (optional)"
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
                {editingCalendar ? 'Update' : 'Create'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
};

export default CalendarManagement;