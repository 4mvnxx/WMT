import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { deleteEvent, getEvents } from '../api/events';
import EmptyView from '../components/EmptyView';
import LoadingView from '../components/LoadingView';
import { useAuth } from '../context/AuthContext';
import { AppTheme } from '../constants/appTheme';
import { resolveMediaUrl } from '../utils/media';

export default function EventListScreen({ navigation }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getEvents();
      setEvents(response.data || []);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Could not load events');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteEvent = useCallback(
    (event: any) => {
      Alert.alert('Delete event', `Delete ${event.title}? This will also remove related bookings.`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(event._id);
              await fetchEvents();
            } catch (error: any) {
              Alert.alert('Delete failed', error?.response?.data?.message || 'Unable to delete event');
            }
          },
        },
      ]);
    },
    [fetchEvents]
  );

  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  if (loading) {
    return <LoadingView text="Loading events..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>👋</Text>
        <Text style={styles.heroTitle}>Welcome, {user?.name || 'Guest'}</Text>
        <Text style={styles.heroText}>
          {user?.role === 'admin'
            ? 'Admin dashboard ready. Manage events and bookings from here.'
            : 'Your events and bookings are ready in one clean mobile view.'}
        </Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => String(item._id)}
        numColumns={2}
        key="2"
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContentGrid}
        ListEmptyComponent={<EmptyView message="No events yet" />}
        renderItem={({ item }) => {
          const seatsLeft = (item.totalSeats || 0) - (item.bookedSeats || 0);
          const imageUrl = resolveMediaUrl(item.imageUrl);

          return (
            <View style={styles.cardShellGrid}>
              <Pressable
                style={[styles.card, styles.cardGrid]}
                onPress={() => navigation.navigate('EventDetail', { eventId: item._id })}
              >
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={[styles.image, styles.gridImage]} resizeMode="cover" />
                ) : (
                  <View style={[styles.imagePlaceholder, styles.gridImage]}>
                    <Text style={styles.imagePlaceholderText}>📌 Event</Text>
                  </View>
                )}

                <View style={[styles.cardBody, styles.gridCardBody]}>
                  <Text style={[styles.name, styles.gridName]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    {item.venue}
                  </Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    {new Date(item.eventDate).toLocaleDateString()}
                  </Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.price}>₹{item.ticketPrice}</Text>
                    <Text style={styles.status}>{item.status}</Text>
                  </View>
                  <Text style={styles.seats}>{seatsLeft} seats left</Text>

                  {isAdmin ? (
                    <View style={styles.adminActionRow}>
                      <Pressable
                        style={[styles.adminActionButton, styles.editButton]}
                        onPress={() => navigation.navigate('EventForm', { event: item })}
                      >
                        <MaterialCommunityIcons name="pencil" size={16} color={AppTheme.colors.navyDeep} />
                        <Text style={styles.adminActionText}>Edit</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.adminActionButton, styles.deleteButton]}
                        onPress={() => handleDeleteEvent(item)}
                      >
                        <MaterialCommunityIcons name="delete-outline" size={16} color={AppTheme.colors.white} />
                        <Text style={styles.adminActionTextDelete}>Delete</Text>
                      </Pressable>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            </View>
          );
        }}
      />

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.bottomButton}
          onPress={() => navigation.navigate(user?.role === 'admin' ? 'AllBookings' : 'MyBookings')}
        >
          <Text style={styles.bottomButtonText}>🎫</Text>
          <Text style={styles.bottomButtonLabel}>{user?.role === 'admin' ? 'All Bookings' : 'Bookings'}</Text>
        </Pressable>

        {user?.role === 'admin' ? (
          <Pressable style={[styles.bottomButton, styles.bottomButtonAccent]} onPress={() => navigation.navigate('EventForm')}>
            <Text style={styles.bottomButtonText}>➕</Text>
            <Text style={styles.bottomButtonLabel}>Add Event</Text>
          </Pressable>
        ) : null}

        <Pressable style={[styles.bottomButton, styles.bottomButtonDanger]} onPress={async () => await logout()}>
          <MaterialCommunityIcons name="logout" size={20} color="#fff" />
          <Text style={styles.bottomButtonLabel}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.ice,
  },
  heroCard: {
    backgroundColor: AppTheme.colors.navy,
    borderRadius: AppTheme.radius.large,
    padding: 18,
    marginHorizontal: 18,
    marginTop: 12,
    marginBottom: 10,
  },
  heroEmoji: {
    fontSize: 26,
    marginBottom: 8,
  },
  heroTitle: {
    color: AppTheme.colors.white,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  heroText: {
    color: '#dbeafe',
    lineHeight: 19,
    fontSize: 13,
  },
  listContentGrid: {
    paddingHorizontal: 18,
    paddingBottom: 180,
  },
  columnWrapper: {
    gap: 10,
    marginBottom: 10,
  },
  cardShell: {
    marginBottom: 14,
  },
  cardShellGrid: {
    flex: 1,
    marginBottom: 0,
  },
  card: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: AppTheme.radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AppTheme.colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardGrid: {
    minHeight: 210,
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: AppTheme.colors.sky,
  },
  gridImage: {
    height: 74,
  },
  imagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: AppTheme.colors.sky,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: AppTheme.colors.blue,
    fontWeight: '800',
    fontSize: 16,
  },
  cardBody: {
    padding: 14,
  },
  gridCardBody: {
    padding: 9,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: AppTheme.colors.text,
    marginBottom: 5,
  },
  gridName: {
    fontSize: 13,
    marginBottom: 2,
  },
  meta: {
    color: AppTheme.colors.muted,
    marginBottom: 3,
    fontSize: 11,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    color: AppTheme.colors.blue,
    fontWeight: '800',
    fontSize: 14,
  },
  status: {
    backgroundColor: AppTheme.colors.sky,
    color: AppTheme.colors.navyDeep,
    fontWeight: '800',
    fontSize: 12,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  seats: {
    color: AppTheme.colors.success,
    fontWeight: '700',
    marginTop: 5,
    fontSize: 11,
  },
  adminActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 7,
  },
  adminActionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  editButton: {
    backgroundColor: 'rgba(37,99,235,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.18)',
  },
  deleteButton: {
    backgroundColor: AppTheme.colors.danger,
  },
  adminActionText: {
    color: AppTheme.colors.navyDeep,
    fontWeight: '800',
    fontSize: 10,
  },
  adminActionTextDelete: {
    color: AppTheme.colors.white,
    fontWeight: '800',
    fontSize: 10,
  },
  bottomBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 6,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.93)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.03)',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 7,
  },
  bottomButton: {
    flex: 1,
    backgroundColor: 'rgba(37, 100, 235, 0.19)',
    borderRadius: 14,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 2,
  },
  bottomButtonAccent: {
    backgroundColor: 'rgba(37, 100, 235, 0.4)',
  },
  bottomButtonDanger: {
    backgroundColor: 'rgba(8, 144, 178, 0.29)',
  },
  bottomButtonText: {
    color: AppTheme.colors.navyDeep,
    fontWeight: '800',
    fontSize: 16,
  },
  bottomButtonLabel: {
    color: AppTheme.colors.navyDeep,
    fontWeight: '700',
    fontSize: 11,
  },
});
