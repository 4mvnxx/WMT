import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { deleteEvent, getEventById } from '../api/events';
import { createBooking } from '../api/bookings';
import LoadingView from '../components/LoadingView';
import EmptyView from '../components/EmptyView';
import { useAuth } from '../context/AuthContext';
import { AppTheme } from '../constants/appTheme';
import { resolveMediaUrl } from '../utils/media';

export default function EventDetailScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEventById(eventId);
        setEvent(response.data);
      } catch (error: any) {
        Alert.alert('Error', error?.response?.data?.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleBooking = async () => {
    try {
      const response = await createBooking(eventId, quantity);
      Alert.alert('Success', response.data.message || 'Booking created and sent for approval');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Booking failed', error?.response?.data?.message || 'Unable to create booking');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Delete event', `Delete ${event.title}? This removes related bookings too.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteEvent(eventId);
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Events');
            }
          } catch (error: any) {
            Alert.alert('Delete failed', error?.response?.data?.message || 'Unable to delete event');
          }
        },
      },
    ]);
  };

  if (loading) return <LoadingView text="Loading event..." />;
  if (!event) return <EmptyView message="Event not found" />;

  const remainingSeats = (event.totalSeats || 0) - (event.bookedSeats || 0);
  const imageUrl = resolveMediaUrl(event.imageUrl);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>🎫 Event</Text>
        </View>
      )}

      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>{event.venue}</Text>
      <Text style={styles.meta}>{new Date(event.eventDate).toLocaleString()}</Text>
      <Text style={styles.meta}>Price: ₹{event.ticketPrice}</Text>
      <Text style={styles.meta}>Seats left: {remainingSeats}</Text>
      <Text style={styles.description}>{event.description}</Text>

      {user?.role === 'admin' && (
        <View style={styles.adminActionGroup}>
          <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('EventForm', { event })}>
            <Text style={styles.secondaryButtonText}>🛠️ Edit Event</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={handleDelete}>
            <Text style={styles.dangerButtonText}>🗑️ Delete Event</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.bookingBox}>
        <Text style={styles.label}>Quantity</Text>
        <View style={styles.row}>
          <Pressable style={styles.stepButton} onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}>
            <Text style={styles.stepButtonText}>-</Text>
          </Pressable>
          <Text style={styles.quantity}>{quantity}</Text>
          <Pressable style={styles.stepButton} onPress={() => setQuantity((prev) => prev + 1)}>
            <Text style={styles.stepButtonText}>+</Text>
          </Pressable>
        </View>
        <Pressable style={styles.primaryButton} onPress={handleBooking}>
          <Text style={styles.primaryButtonText}>Book now</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.ice,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: AppTheme.radius.large,
    marginBottom: 20,
    backgroundColor: AppTheme.colors.sky,
  },
  imagePlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: AppTheme.radius.large,
    marginBottom: 20,
    backgroundColor: AppTheme.colors.sky,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: AppTheme.colors.blue,
    fontWeight: '800',
    fontSize: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: AppTheme.colors.text,
    marginBottom: 8,
  },
  meta: {
    color: AppTheme.colors.muted,
    marginBottom: 6,
    fontSize: 15,
  },
  description: {
    marginTop: 18,
    lineHeight: 24,
    color: AppTheme.colors.text,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.blue,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  primaryButtonText: {
    color: AppTheme.colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 20,
    backgroundColor: 'rgba(37,99,235,0.10)',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.16)',
  },
  secondaryButtonText: {
    color: AppTheme.colors.navyDeep,
    fontWeight: '800',
  },
  adminActionGroup: {
    gap: 12,
  },
  dangerButton: {
    marginTop: 12,
    backgroundColor: AppTheme.colors.danger,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: AppTheme.colors.white,
    fontWeight: '800',
  },
  bookingBox: {
    marginTop: 22,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(219,234,254,0.9)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
    color: AppTheme.colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  stepButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: AppTheme.colors.ice,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepButtonText: {
    fontSize: 22,
    fontWeight: '800',
    color: AppTheme.colors.navyDeep,
  },
  quantity: {
    fontSize: 22,
    fontWeight: '800',
    minWidth: 40,
    textAlign: 'center',
    color: AppTheme.colors.text,
  },
});
