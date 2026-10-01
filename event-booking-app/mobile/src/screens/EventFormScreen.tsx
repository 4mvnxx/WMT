import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createEvent, updateEvent } from '../api/events';
import FormInput from '../components/FormInput';
import { validateRequired } from '../utils/validators';
import { AppTheme } from '../constants/appTheme';
import { resolveMediaUrl } from '../utils/media';

export default function EventFormScreen({ navigation, route }: any) {
  const isEdit = !!route?.params?.event;
  const event = route?.params?.event || null;

  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [venue, setVenue] = useState(event?.venue || '');
  const [eventDate, setEventDate] = useState(event?.eventDate ? new Date(event.eventDate).toISOString().slice(0, 10) : '');
  const [ticketPrice, setTicketPrice] = useState(String(event?.ticketPrice || ''));
  const [totalSeats, setTotalSeats] = useState(String(event?.totalSeats || ''));
  const [image, setImage] = useState<any>(null);
  const [errors, setErrors] = useState({ title: '', description: '', venue: '', eventDate: '', ticketPrice: '', totalSeats: '' });
  const previewUrl = image?.uri || resolveMediaUrl(event?.imageUrl);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow photo access to upload an event image.');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const validate = () => {
    const nextErrors = {
      title: validateRequired(title, 'Title'),
      description: validateRequired(description, 'Description'),
      venue: validateRequired(venue, 'Venue'),
      eventDate: validateRequired(eventDate, 'Event date'),
      ticketPrice: Number(ticketPrice) > 0 ? '' : 'Ticket price must be greater than 0',
      totalSeats: Number(totalSeats) > 0 ? '' : 'Seats must be at least 1',
    };

    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('venue', venue);
    formData.append('eventDate', eventDate);
    formData.append('ticketPrice', String(ticketPrice));
    formData.append('totalSeats', String(totalSeats));

    if (image) {
      formData.append(
        'image',
        {
          uri: image.uri,
          name: image.fileName || 'event-image.jpg',
          type: image.mimeType || 'image/jpeg',
        } as any
      );
    }

    console.log('[EventForm] submit', {
      isEdit,
      title,
      venue,
      eventDate,
      ticketPrice,
      totalSeats,
      hasImage: !!image,
      imageUri: image?.uri || null,
    });

    try {
      if (isEdit) {
        await updateEvent(event._id, formData);
        Alert.alert('Success', 'Event updated');
      } else {
        await createEvent(formData);
        Alert.alert('Success', 'Event created');
      }
      navigation.goBack();
    } catch (error: any) {
      console.log('[EventForm] submit error', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      Alert.alert('Error', error?.response?.data?.message || 'Unable to save event');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.heroCard}>
        <Text style={styles.heroEmoji}>{isEdit ? '🛠️' : '➕'}</Text>
        <Text style={styles.title}>{isEdit ? 'Edit event' : 'Add event'}</Text>
        <Text style={styles.subtitle}>Give your event a polished mobile-friendly listing for users and admins.</Text>
      </View>

      {previewUrl ? (
        <Image source={{ uri: previewUrl }} style={styles.previewImage} resizeMode="cover" />
      ) : null}

      <FormInput 
        label="Title" 
        value={title} 
        onChangeText={(text) => {
          setTitle(text);
          if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
        }} 
        onBlur={() => setErrors((prev) => ({ ...prev, title: validateRequired(title, 'Title') }))}
        error={errors.title} 
      />
      <FormInput 
        label="Description" 
        value={description} 
        onChangeText={(text) => {
          setDescription(text);
          if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
        }} 
        onBlur={() => setErrors((prev) => ({ ...prev, description: validateRequired(description, 'Description') }))}
        error={errors.description} 
        multiline 
        numberOfLines={4} 
      />
      <FormInput 
        label="Venue" 
        value={venue} 
        onChangeText={(text) => {
          setVenue(text);
          if (errors.venue) setErrors((prev) => ({ ...prev, venue: '' }));
        }} 
        onBlur={() => setErrors((prev) => ({ ...prev, venue: validateRequired(venue, 'Venue') }))}
        error={errors.venue} 
      />
      <FormInput 
        label="Event date" 
        value={eventDate} 
        onChangeText={(text) => {
          setEventDate(text);
          if (errors.eventDate) setErrors((prev) => ({ ...prev, eventDate: '' }));
        }} 
        onBlur={() => setErrors((prev) => ({ ...prev, eventDate: validateRequired(eventDate, 'Event date') }))}
        placeholder="YYYY-MM-DD" 
        error={errors.eventDate} 
      />
      <FormInput 
        label="Ticket price" 
        value={ticketPrice} 
        onChangeText={(text) => {
          setTicketPrice(text);
          if (errors.ticketPrice) setErrors((prev) => ({ ...prev, ticketPrice: '' }));
        }} 
        onBlur={() => setErrors((prev) => ({ ...prev, ticketPrice: Number(ticketPrice) > 0 ? '' : 'Ticket price must be greater than 0' }))}
        keyboardType="numeric" 
        error={errors.ticketPrice} 
      />
      <FormInput 
        label="Total seats" 
        value={totalSeats} 
        onChangeText={(text) => {
          setTotalSeats(text);
          if (errors.totalSeats) setErrors((prev) => ({ ...prev, totalSeats: '' }));
        }} 
        onBlur={() => setErrors((prev) => ({ ...prev, totalSeats: Number(totalSeats) > 0 ? '' : 'Seats must be at least 1' }))}
        keyboardType="numeric" 
        error={errors.totalSeats} 
      />

      <Pressable style={styles.secondaryButton} onPress={pickImage}>
        <Text style={styles.secondaryButtonText}>{image ? 'Change image' : 'Choose image'}</Text>
      </Pressable>

      <Pressable style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.primaryButtonText}>{isEdit ? 'Save event' : 'Create event'}</Text>
      </Pressable>
    </ScrollView>
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
    marginBottom: 18,
  },
  heroEmoji: {
    fontSize: 26,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: AppTheme.colors.white,
    marginBottom: 6,
  },
  subtitle: {
    color: '#dbeafe',
    lineHeight: 20,
  },
  previewImage: {
    width: '100%',
    height: 180,
    borderRadius: AppTheme.radius.large,
    marginBottom: 16,
    backgroundColor: AppTheme.colors.sky,
  },
  secondaryButton: {
    backgroundColor: 'rgba(37,99,235,0.10)',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.16)',
  },
  secondaryButtonText: {
    color: AppTheme.colors.navyDeep,
    fontWeight: '800',
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.blue,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
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
});
