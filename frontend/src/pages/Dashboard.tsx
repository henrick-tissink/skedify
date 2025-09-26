import React, { useState } from 'react';
import {
  AppShell,
  Burger,
  Group,
  Text,
  Button,
  Avatar,
  Menu,
  rem,
  UnstyledButton,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout, IconUser, IconCalendar, IconClock, IconInbox } from '@tabler/icons-react';
import { useAuth } from '@context/AuthContext';
import CalendarManagement from '@components/CalendarManagement';
import SessionTypeManagement from '@components/SessionTypeManagement';
import BookingManagement from '@components/BookingManagement';
import SkedifyLogo from '@components/SkedifyLogo';

type DashboardView = 'calendars' | 'sessions' | 'bookings';

const Dashboard: React.FC = () => {
  const [opened, { toggle }] = useDisclosure();
  const [activeView, setActiveView] = useState<DashboardView>('calendars');
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'calendars' as DashboardView, label: 'Calendars', icon: IconCalendar },
    { id: 'sessions' as DashboardView, label: 'Session Types', icon: IconClock },
    { id: 'bookings' as DashboardView, label: 'Bookings', icon: IconInbox },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'calendars':
        return <CalendarManagement />;
      case 'sessions':
        return <SessionTypeManagement />;
      case 'bookings':
        return <BookingManagement />;
      default:
        return <CalendarManagement />;
    }
  };

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        header: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        },
        navbar: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group gap="sm">
              <SkedifyLogo size={36} className="skedify-logo" />
              <Text size="xl" fw={700} style={{ color: 'white', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)' }} className="skedify-brand-text">
                Skedify
              </Text>
            </Group>
          </Group>

          <Menu
            shadow="lg"
            width={220}
            styles={{
              dropdown: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }
            }}
          >
            <Menu.Target>
              <UnstyledButton
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
                }}
                className="skedify-card"
              >
                <Group gap="sm">
                  <Avatar
                    size={36}
                    radius="md"
                    style={{
                      background: 'var(--skedify-gradient-purple)',
                      color: 'white'
                    }}
                  >
                    {user?.first_name?.[0] || user?.username[0] || 'U'}
                  </Avatar>
                  <Text size="md" fw={600} visibleFrom="sm" style={{ color: 'white' }}>
                    {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                  </Text>
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconUser style={{ width: rem(14), height: rem(14) }} />}>
                Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                onClick={logout}
                color="red"
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="lg">
        <Stack gap="md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <Button
                key={item.id}
                className={isActive ? 'skedify-button-primary' : 'skedify-button-secondary'}
                justify="flex-start"
                leftSection={<Icon size={20} />}
                onClick={() => {
                  setActiveView(item.id);
                  toggle(); // Close mobile menu
                }}
                size="lg"
                radius="md"
                styles={{
                  root: {
                    height: '50px',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '16px'
                  }
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>{renderContent()}</AppShell.Main>
    </AppShell>
  );
};

export default Dashboard;