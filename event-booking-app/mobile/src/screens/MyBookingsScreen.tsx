import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { cancelBooking, getMyBookings } from '../api/bookings';
import EmptyView from '../components/EmptyView';
import LoadingView from '../components/LoadingView';
import { AppTheme } from '../constants/appTheme';

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const response = await getMyBookings();
      setBookings(response.data || []);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Could not load bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [fetchBookings])
  );

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id);
      await fetchBookings();
    } catch (error: any) {
      Alert.alert('Cancel failed', error?.response?.data?.message || 'Unable to cancel booking');
    }
  };

  if (loading) return <LoadingView text="Loading bookings..." />;

  return (
    <View style={styles.container}>
      {bookings.length === 0 ? (
        <EmptyView message="No bookings yet" />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => String(item._id)}
          contentContainerStyle={{ padding: 18, gap: 12 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.event?.title || 'Event'}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Status</Text>
                <Text style={styles.metaValue}>{item.status}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Quantity</Text>
                <Text style={styles.metaValue}>{item.quantity}</Text>
              </View>
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Total</Text>
                <Text style={styles.metaValue}>₹{item.totalPrice}</Text>
              </View>

              {item.status === 'Pending' && (
                <Pressable style={styles.cancelButton} onPress={() => handleCancel(item._id)}>
                  <Text style={styles.cancelButtonText}>❌ Cancel Booking</Text>
                </Pressable>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.ice,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(219,234,254,0.9)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 10,
    color: AppTheme.colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaLabel: {
    color: AppTheme.colors.navyDeep,
    fontWeight: '700',
  },
  metaValue: {
    color: AppTheme.colors.text,
    fontWeight: '800',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: AppTheme.colors.danger,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: AppTheme.colors.white,
    fontWeight: '700',
  },
});
