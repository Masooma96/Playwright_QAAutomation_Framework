import { test as base, expect } from '@playwright/test';
import { BookingClient } from '../clients/BookingClient';
import { Booking, CreateBookingResponse } from '../clients/types';
import auth from '../data/restful-booker/auth.json';
import bookings from '../data/restful-booker/bookings.json';

type ApiFixtures = {
  bookingClient: BookingClient;
  /** A valid admin token (credentials from tests/api/data/restful-booker/auth.json). */
  authToken: string;
  /** A booking created for the test and deleted afterwards (setup + teardown, so tests stay independent). */
  createdBooking: CreateBookingResponse;
};

export const test = base.extend<ApiFixtures>({
  bookingClient: async ({ request }, use) => use(new BookingClient(request)),

  authToken: async ({ bookingClient }, use) => {
    await use(await bookingClient.getToken(auth.valid.username, auth.valid.password));
  },

  createdBooking: async ({ bookingClient, authToken }, use) => {
    const response = await bookingClient.createBooking(bookings.create[0].payload as Booking);
    expect(response.status()).toBe(bookings.expectedStatus.created);
    const created: CreateBookingResponse = await response.json();
    await use(created);
    await bookingClient.deleteBooking(created.bookingid, authToken); // teardown
  },
});

export { expect };
