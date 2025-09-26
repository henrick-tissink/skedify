import React, { useState, useEffect } from 'react';
import {
  Title,
  Card,
  Text,
  Stack,
  Group,
  Badge,
  Button,
  LoadingOverlay,
  Tabs,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconInbox, IconCalendarCheck, IconCalendarX } from '@tabler/icons-react';
import { apiClient } from '@api/client';
import type { Booking } from '@types';
import { AxiosError } from 'axios';

const BookingManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('pending');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await apiClient.get<{ bookings: Booking[] }>('/bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to fetch bookings',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId: number) => {
    try {
      await apiClient.put(`/bookings/${bookingId}/approve`);
      notifications.show({
        title: 'Success',
        message: 'Booking approved successfully',
        color: 'green',
      });
      fetchBookings();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Failed to approve booking',
        color: 'red',
      });
    }
  };

  const handleReject = async (bookingId: number) => {
    try {
      await apiClient.put(`/bookings/${bookingId}/reject`);
      notifications.show({
        title: 'Success',
        message: 'Booking rejected successfully',
        color: 'green',
      });
      fetchBookings();
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      notifications.show({
        title: 'Error',
        message: axiosError.response?.data?.error || 'Failed to reject booking',
        color: 'red',
      });
    }
  };

  const filterBookings = (status: string) => {
    return bookings.filter((booking) => booking.status === status);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <Card
      key={booking.id}
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
              <Text fw={600} style={{ color: 'white' }}>
                {booking.booked_by_first_name} {booking.booked_by_last_name}
              </Text>
              <Badge color={getBadgeColor(booking.status)} size="md">
                {booking.status}
              </Badge>
            </Group>
            <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              {formatDateTime(booking.start_time)}
            </Text>
            <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Contact: {booking.booked_by_email || booking.booked_by_phone}
            </Text>
          </Stack>
          
          {booking.status === 'pending' && (
            <Group gap="xs">
              <Button
                size="sm"
                className="skedify-button-primary"
                leftSection={<IconCheck size={14} />}
                onClick={() => handleApprove(booking.id)}
                radius="sm"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                leftSection={<IconX size={14} />}
                onClick={() => handleReject(booking.id)}
                radius="sm"
                styles={{
                  root: {
                    borderColor: 'var(--skedify-primary)',
                    color: 'var(--skedify-primary)',
                    '&:hover': {
                      background: 'rgba(255, 107, 107, 0.1)'
                    }
                  }
                }}
              >
                Reject
              </Button>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );

  if (loading) {
    return <LoadingOverlay visible />;
  }

  const pendingBookings = filterBookings('pending');
  const approvedBookings = filterBookings('approved');
  const rejectedBookings = filterBookings('rejected');

  return (
    <Stack>
      <Title order={2} mb="xl" style={{ color: 'white', fontWeight: 700 }}>Booking Management</Title>

      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value || 'pending')}
        styles={{
          tab: {
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255, 255, 255, 0.7)',
            '&[data-active]': {
              background: 'rgba(255, 255, 255, 0.15)',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: 'white'
            }
          },
          tabLabel: {
            fontWeight: 600
          }
        }}
      >
        <Tabs.List>
          <Tabs.Tab
            value="pending"
            leftSection={<IconInbox size={16} />}
          >
            Pending ({pendingBookings.length})
          </Tabs.Tab>
          <Tabs.Tab
            value="approved"
            leftSection={<IconCalendarCheck size={16} />}
          >
            Approved ({approvedBookings.length})
          </Tabs.Tab>
          <Tabs.Tab
            value="rejected"
            leftSection={<IconCalendarX size={16} />}
          >
            Rejected ({rejectedBookings.length})
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="pending" pt="md">
          {pendingBookings.length === 0 ? (
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
                <IconInbox size={48} color="var(--skedify-warning)" />
                <Text ta="center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No pending bookings
                </Text>
              </Stack>
            </Card>
          ) : (
            <Stack gap="md">
              {pendingBookings.map(renderBookingCard)}
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="approved" pt="md">
          {approvedBookings.length === 0 ? (
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
                <IconCalendarCheck size={48} color="var(--skedify-success)" />
                <Text ta="center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No approved bookings
                </Text>
              </Stack>
            </Card>
          ) : (
            <Stack gap="md">
              {approvedBookings.map(renderBookingCard)}
            </Stack>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="rejected" pt="md">
          {rejectedBookings.length === 0 ? (
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
                <IconCalendarX size={48} color="var(--skedify-primary)" />
                <Text ta="center" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  No rejected bookings
                </Text>
              </Stack>
            </Card>
          ) : (
            <Stack gap="md">
              {rejectedBookings.map(renderBookingCard)}
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default BookingManagement;