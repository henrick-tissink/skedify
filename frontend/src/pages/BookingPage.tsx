import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  Group,
  Button,
  TextInput,
  Grid,
  Badge,
  LoadingOverlay,
  Alert,
  SimpleGrid,
  Box,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCalendar, IconClock, IconCheck, IconAlertCircle } from '@tabler/icons-react';
import { apiClient } from '@api/client';
import type { SessionType } from '@types';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import SkedifyLogo from '@components/SkedifyLogo';

interface BookingForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface BookingPageData {
  sessionType: {
    id: number;
    name: string;
    duration_minutes: number;
  };
  availableSlots: string[];
}

const BookingPage: React.FC = () => {
  const { uniqueLink } = useParams<{ uniqueLink: string }>();
  const [loading, setLoading] = useState(true);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const form = useForm<BookingForm>({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    },
    validate: {
      first_name: (value) => (value.length < 1 ? 'First name is required' : null),
      last_name: (value) => (value.length < 1 ? 'Last name is required' : null),
      email: (value) => {
        if (!value && !form.values.phone) {
          return 'Either email or phone is required';
        }
        if (value && !/^\S+@\S+$/.test(value)) {
          return 'Invalid email format';
        }
        return null;
      },
      phone: (value) => {
        if (!value && !form.values.email) {
          return 'Either email or phone is required';
        }
        return null;
      },
    },
  });

  useEffect(() => {
    const fetchSessionType = async () => {
      try {
        const response = await apiClient.get<BookingPageData>(`/book/${uniqueLink}`);
        setSessionType({
          id: response.data.sessionType.id,
          name: response.data.sessionType.name,
          duration_minutes: response.data.sessionType.duration_minutes,
          user_id: 0, // Not needed for booking page
          unique_link: uniqueLink || '',
          created_at: '',
        });
      } catch (error) {
        const axiosError = error as AxiosError<{ error: string }>;
        notifications.show({
          title: 'Error',
          message: axiosError.response?.data?.error || 'Session type not found',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    if (uniqueLink) {
      fetchSessionType();
    }
  }, [uniqueLink]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!sessionType || !selectedDate) return;

      setSlotsLoading(true);
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await apiClient.get<BookingPageData>(
          `/book/${uniqueLink}?date=${dateStr}`
        );
        setAvailableSlots(response.data.availableSlots);
        setSelectedSlot(null);
      } catch {
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch available slots',
          color: 'red',
        });
        setAvailableSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };

    if (sessionType && selectedDate) {
      fetchAvailableSlots();
    }
  }, [sessionType, selectedDate, uniqueLink]);

  const handleSubmit = async (values: BookingForm) => {
    if (!selectedSlot) {
      notifications.show({
        title: 'Error',
        message: 'Please select a time slot',
        color: 'red',
      });
      return;
    }

    setBookingLoading(true);
    try {
      await apiClient.post(`/book/${uniqueLink}`, {
        ...values,
        start_time: selectedSlot,
      });
      
      setBookingSuccess(true);
      notifications.show({
        title: 'Success',
        message: 'Booking request submitted successfully!',
        color: 'green',
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Booking Failed',
        message: axiosError.response?.data?.error || 'Failed to create booking',
        color: 'red',
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const formatSlotTime = (slot: string) => {
    return dayjs(slot).format('h:mm A');
  };

  const isSlotInPast = (slot: string) => {
    return dayjs(slot).isBefore(dayjs());
  };

  if (loading) {
    return <LoadingOverlay visible />;
  }

  if (!sessionType) {
    return (
      <Container size="sm" my={40}>
        <Stack align="center" gap="xl">
          <SkedifyLogo size={80} className="skedify-logo" />
          <Paper className="skedify-card" p={40} radius="md">
            <Stack align="center" gap="lg">
              <IconAlertCircle size={64} color="var(--skedify-primary)" />
              <Title order={2} ta="center" style={{ color: 'white', fontWeight: 700 }}>
                Session Not Found
              </Title>
              <Text ta="center" size="lg" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                The session link you're looking for could not be found. Please check the URL and try again.
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  }

  if (bookingSuccess) {
    return (
      <Container size="sm" my={40}>
        <Stack align="center" gap="xl">
          <SkedifyLogo size={80} className="skedify-logo" />
          <Paper className="skedify-card" p={40} radius="md">
            <Stack align="center" gap="xl">
              <IconCheck size={80} color="var(--skedify-success)" />
              <Title order={1} ta="center" style={{ color: 'white', fontWeight: 800 }}>
                Booking Request Submitted!
              </Title>
              <Text ta="center" size="lg" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Your booking request for <strong style={{ color: 'white' }}>{sessionType.name}</strong> has been submitted successfully.
                You will receive a confirmation once the booking is approved.
              </Text>
              <Badge className="skedify-badge" size="xl" p="lg">
                {dayjs(selectedSlot).format('MMMM D, YYYY at h:mm A')}
              </Badge>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="lg" my={40}>
      <Stack align="center" gap="xl">
        <Group align="center" gap="lg">
          <SkedifyLogo size={60} className="skedify-logo" />
          <Title order={1} size="h1" style={{ color: 'white', fontWeight: 800, textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)' }} className="skedify-brand-text">
            Skedify
          </Title>
        </Group>

        <Paper className="skedify-card" p={40} radius="md">
          <Stack gap="xl">
            <Group justify="center" gap="lg">
              <IconCalendar size={40} color="var(--skedify-warning)" />
              <Stack gap={4} align="center">
                <Title order={2} ta="center" style={{ color: 'white', fontWeight: 700 }}>{sessionType.name}</Title>
                <Group gap="sm">
                  <IconClock size={20} color="var(--skedify-secondary)" />
                  <Text size="lg" fw={500} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{sessionType.duration_minutes} minutes</Text>
                </Group>
              </Stack>
            </Group>

            <Stack gap="xl">
              {/* Mobile view - stacked layout */}
              <Grid gutter="xl">
                <Grid.Col span={{ base: 12, md: 7 }}>
                  <Stack>
                    <Title order={3} size="h4" ta="center" style={{ color: 'white', fontWeight: 700 }}>
                      Select Date
                    </Title>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '0 20px'
                    }}>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '16px'
                      }}>
                        <DatePicker
                          value={selectedDate}
                          onChange={(date) => {
                            if (typeof date === 'string') {
                              setSelectedDate(date ? new Date(date) : null);
                            } else {
                              setSelectedDate(date as Date | null);
                            }
                          }}
                          minDate={new Date()}
                          size="md"
                          styles={{
                            calendarHeader: {
                              color: 'white'
                            },
                            calendarHeaderControl: {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                              }
                            },
                            calendarHeaderLevel: {
                              color: 'white',
                              fontWeight: 700,
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                              }
                            },
                            day: {
                              color: 'white',
                              '&[data-weekend]': {
                                color: 'var(--skedify-warning)'
                              },
                              '&[data-selected]': {
                                backgroundColor: 'var(--skedify-accent)',
                                color: 'white',
                                fontWeight: 700
                              },
                              '&[data-outside]': {
                                color: 'rgba(255, 255, 255, 0.3)'
                              },
                              '&:hover:not([data-disabled])': {
                                backgroundColor: 'rgba(255, 255, 255, 0.15)'
                              },
                              '&[data-disabled]': {
                                color: 'rgba(255, 255, 255, 0.2)',
                                cursor: 'not-allowed'
                              }
                            },
                            weekday: {
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '0.85rem',
                              fontWeight: 600
                            },
                            monthCell: {
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)'
                              },
                              '&[data-selected]': {
                                backgroundColor: 'var(--skedify-accent)'
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </Stack>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 5 }}>
                  <Stack>
                    <Title order={3} size="h4" ta="center" style={{ color: 'white', fontWeight: 700 }}>
                      Available Times
                    </Title>

                    {slotsLoading ? (
                      <LoadingOverlay visible />
                    ) : availableSlots.length === 0 ? (
                      <Text ta="center" py="xl" size="lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        No available slots for this date
                      </Text>
                    ) : (
                      <>
                        <Box hiddenFrom="md" px="xl">
                          <SimpleGrid cols={3} spacing="xs">
                            {availableSlots.map((slot) => (
                              <Button
                                key={slot}
                                className={`skedify-time-slot ${selectedSlot === slot ? 'skedify-button-primary' : 'skedify-button-secondary'}`}
                                size="sm"
                                onClick={() => setSelectedSlot(slot)}
                                disabled={isSlotInPast(slot)}
                                fullWidth
                                radius="md"
                                styles={{
                                  root: {
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    padding: '8px 4px',
                                    minHeight: '40px'
                                  }
                                }}
                              >
                                {formatSlotTime(slot)}
                              </Button>
                            ))}
                          </SimpleGrid>
                        </Box>

                        <Box visibleFrom="md">
                          <SimpleGrid cols={3} spacing="xs">
                            {availableSlots.map((slot) => (
                              <Button
                                key={slot}
                                className={`skedify-time-slot ${selectedSlot === slot ? 'skedify-button-primary' : 'skedify-button-secondary'}`}
                                size="sm"
                                onClick={() => setSelectedSlot(slot)}
                                disabled={isSlotInPast(slot)}
                                fullWidth
                                radius="md"
                                styles={{
                                  root: {
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    padding: '8px 4px',
                                    minHeight: '40px'
                                  }
                                }}
                              >
                                {formatSlotTime(slot)}
                              </Button>
                            ))}
                          </SimpleGrid>
                        </Box>
                      </>
                    )}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Stack>

            {selectedSlot && (
              <Alert
                radius="md"
                p="lg"
                style={{
                  background: 'rgba(78, 205, 196, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(78, 205, 196, 0.4)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Text size="lg" fw={600} ta="center" style={{ color: 'white' }}>
                  Selected time: <strong>{dayjs(selectedSlot).format('MMMM D, YYYY at h:mm A')}</strong>
                </Text>
              </Alert>
            )}
          </Stack>
        </Paper>

        <Paper className="skedify-card" p={40} radius="md">
          <Title order={2} mb="xl" ta="center" style={{ color: 'white', fontWeight: 700 }}>
            Your Information
          </Title>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="lg">
              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="First Name"
                    placeholder="John"
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
                    {...form.getInputProps('first_name')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Last Name"
                    placeholder="Doe"
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
                    {...form.getInputProps('last_name')}
                  />
                </Grid.Col>
              </Grid>

              <TextInput
                label="Email"
                placeholder="john@example.com"
                size="lg"
                radius="sm"
                                styles={{
                  label: {
                    fontWeight: 600,
                    color: 'white',
                    marginBottom: '8px'
                  }
                }}
                {...form.getInputProps('email')}
              />

              <TextInput
                label="Phone"
                placeholder="+1 (555) 123-4567"
                size="lg"
                radius="sm"
                                styles={{
                  label: {
                    fontWeight: 600,
                    color: 'white',
                    marginBottom: '8px'
                  }
                }}
                {...form.getInputProps('phone')}
              />

              <Text size="md" ta="center" fw={500} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                * Either email or phone number is required
              </Text>

              <Button
                type="submit"
                size="xl"
                radius="md"
                className="skedify-button-primary"
                loading={bookingLoading}
                disabled={!selectedSlot}
                fullWidth
                p="lg"
                styles={{
                  root: {
                    height: '60px',
                    fontSize: '18px',
                    fontWeight: 700
                  }
                }}
              >
                Book Your Session 🚀
              </Button>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
};

export default BookingPage;