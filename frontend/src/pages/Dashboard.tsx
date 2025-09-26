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
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              color="white"
            />
            <Group gap="sm">
              <SkedifyLogo size={36} className="skedify-logo" />
              <Text size="xl" fw={700} style={{ color: 'white', textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)' }} className="skedify-brand-text">
                Skedify
              </Text>
            </Group>
          </Group>

          <Menu
            shadow="lg"
            width={250}
            styles={{
              dropdown: {
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                borderRadius: '12px'
              },
              item: {
                color: 'white',
                fontSize: '14px',
                fontWeight: 500,
                padding: '12px 16px',
                borderRadius: '8px',
                margin: '4px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateX(2px)',
                  boxShadow: '0 4px 16px rgba(255, 255, 255, 0.1)'
                },
                '&[data-hovered]': {
                  background: 'rgba(255, 255, 255, 0.15)'
                }
              },
              divider: {
                borderColor: 'rgba(255, 255, 255, 0.3)',
                margin: '8px 4px'
              }
            }}
          >
            <Menu.Target>
              <UnstyledButton
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
                }}
                className="skedify-card"
              >
                <Group gap="sm">
                  <Avatar
                    size={38}
                    radius="md"
                    style={{
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 25%, #45B7D1 50%, #96CEB4 75%, #FECA57 100%)',
                      color: 'white',
                      fontWeight: 700,
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {user?.first_name?.[0] || user?.username[0] || 'U'}
                  </Avatar>
                  <Text size="md" fw={600} visibleFrom="sm" style={{ color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}>
                    {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                  </Text>
                </Group>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconUser style={{ width: rem(16), height: rem(16), color: 'var(--skedify-accent)' }} />}
              >
                <Text style={{ color: 'white', fontWeight: 500 }}>Profile Settings</Text>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconLogout style={{ width: rem(16), height: rem(16), color: 'var(--skedify-primary)' }} />}
                onClick={logout}
                styles={{
                  item: {
                    '&:hover': {
                      background: 'rgba(255, 107, 107, 0.1)'
                    }
                  }
                }}
              >
                <Text style={{ color: 'white', fontWeight: 500 }}>Sign Out</Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="lg"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        <Stack gap="sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <Button
                key={item.id}
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
                    height: '52px',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '15px',
                    background: isActive
                      ? 'linear-gradient(135deg, #FF6B6B 0%, #FECA57 100%)'
                      : 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(20px)',
                    border: isActive
                      ? '1px solid rgba(255, 255, 255, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    boxShadow: isActive
                      ? '0 4px 20px rgba(255, 107, 107, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: isActive
                        ? 'linear-gradient(135deg, #FF6B6B 0%, #FECA57 100%)'
                        : 'rgba(255, 255, 255, 0.12)',
                      transform: 'translateX(4px) scale(1.02)',
                      boxShadow: isActive
                        ? '0 6px 25px rgba(255, 107, 107, 0.4)'
                        : '0 4px 16px rgba(255, 255, 255, 0.1)'
                    }
                  },
                  leftSection: {
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)'
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