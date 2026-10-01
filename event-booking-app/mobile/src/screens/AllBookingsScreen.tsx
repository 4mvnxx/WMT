import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { approveBooking, getAllBookings, rejectBooking } from '../api/bookings';
import EmptyView from '../components/EmptyView';
import LoadingView from '../components/LoadingView';
import { AppTheme } from '../constants/appTheme';

export default function AllBookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const fetchBookings = useCallback(async () => {
    try {
      const response = await getAllBookings();
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

  const handleApprove = async (id: string) => {
    try {
      await approveBooking(id);
      await fetchBookings();
    } catch (error: any) {
      Alert.alert('Approve failed', error?.response?.data?.message || 'Unable to approve booking');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectBooking(id);
      await fetchBookings();
    } catch (error: any) {
      Alert.alert('Reject failed', error?.response?.data?.message || 'Unable to reject booking');
    }
  };

  const filteredBookings = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.event?.title?.toLowerCase().includes(query) ||
        booking.user?.name?.toLowerCase().includes(query) ||
        booking.user?.email?.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchText, statusFilter]);

  if (loading) return <LoadingView text="Loading all bookings..." />;

  const emptyMessage = bookings.length === 0 ? 'No bookings yet' : 'No bookings match your search';

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => String(item._id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerCard}>
            <Text style={styles.headerText}>Search by event name, user name, or email, then filter by status.</Text>

            <View style={styles.searchBox}>
              <MaterialCommunityIcons name="magnify" size={20} color={AppTheme.colors.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search event name"
                placeholderTextColor={AppTheme.colors.muted}
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText ? (
                <Pressable onPress={() => setSearchText('')} hitSlop={10}>
                  <MaterialCommunityIcons name="close-circle" size={20} color={AppTheme.colors.muted} />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.filterRow}>
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => {
                const active = statusFilter === status;

                return (
                  <Pressable
                    key={status}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setStatusFilter(status)}
                  >
                    <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{status}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyView message={emptyMessage} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.title} numberOfLines={2}>
                {item.event?.title || 'Event'}
              </Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>

            <Text style={styles.meta}>User: {item.user?.name || item.user?.email || 'Unknown'}</Text>
            <Text style={styles.meta}>Email: {item.user?.email || '-'}</Text>
            <Text style={styles.meta}>Venue: {item.event?.venue || '-'}</Text>
            <Text style={styles.meta}>Quantity: {item.quantity}</Text>
            <Text style={styles.meta}>Total: ₹{item.totalPrice}</Text>

            {item.status === 'Pending' && (
              <View style={styles.actionRow}>
                <Pressable style={[styles.actionButton, styles.approveButton]} onPress={() => handleApprove(item._id)}>
                  <Text style={styles.actionText}>Approve</Text>
                </Pressable>
                <Pressable style={[styles.actionButton, styles.rejectButton]} onPress={() => handleReject(item._id)}>
                  <Text style={styles.actionText}>Reject</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.ice,
  },
  listContent: {
    padding: 18,
    paddingBottom: 24,
    gap: 12,
  },
  headerCard: {
    backgroundColor: AppTheme.colors.navy,
    borderRadius: 20,
    padding: 18,
    marginBottom: 4,
  },
  headerTitle: {
    color: AppTheme.colors.white,
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 6,
  },
  headerText: {
    color: '#dbeafe',
    lineHeight: 20,
    marginBottom: 14,
  },
  searchBox: {
    backgroundColor: AppTheme.colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.18)',
  },
  searchInput: {
    flex: 1,
    color: AppTheme.colors.text,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  filterChipActive: {
    backgroundColor: AppTheme.colors.white,
  },
  filterChipText: {
    color: AppTheme.colors.white,
    fontWeight: '800',
    fontSize: 12,
  },
  filterChipTextActive: {
    color: AppTheme.colors.navyDeep,
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: AppTheme.colors.text,
    paddingRight: 10,
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
  meta: {
    color: AppTheme.colors.text,
    marginBottom: 4,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: AppTheme.colors.success,
  },
  rejectButton: {
    backgroundColor: AppTheme.colors.danger,
  },
  actionText: {
    color: AppTheme.colors.white,
    fontWeight: '800',
  },
});
