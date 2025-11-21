Service Booking App

A Service Booking App built with React Native, Expo, TypeScript, and Redux Toolkit.
This app allows users to log in, browse services, view service details, book services, and manage bookings stored locally.

Project Overview

The Service Booking App allows users to:

Log in with dummy credentials

Browse and filter a list of services

View service details

Book services with date, time, and optional notes

View and delete bookings

Tabs for Services and Bookings with smooth navigation

Why we use app/ instead of screens/

With the latest Expo Router, routing is filesystem-based, similar to Next.js.

Each file/folder in app/ automatically becomes a route.

_layout.tsx defines layouts and navigation for its child routes.

Tabs only include main screens; detail screens are separate stack routes.

This avoids duplicate screens, reduces boilerplate, and improves maintainability.

Folder Structure
/app
  ├── _layout.tsx                # Root layout: Stack navigator + Provider
  ├── login.tsx                  # Login screen
  ├── not-found.tsx              # 404 page
  ├── (tabs)/                   # Tab navigator
  │     ├── _layout.tsx          # Tabs layout
  │     ├── services.tsx         # Services tab
  │     └── bookings.tsx         # Bookings tab

/services
  ├── index.tsx                  # Services list (main UI)
  └── [serviceId].tsx            # Service details

/booking
  ├── index.tsx                  # Bookings list
  └── form.tsx                   # Booking form

/src
  ├── components/                # Reusable UI components
  │     ├── Button.tsx
  │     ├── Input.tsx
  │     ├── ServiceCard.tsx
  │     └── BookingCard.tsx
  ├── constants/                 # Dummy data (local JSON)
  ├── store/                     # Redux slices and store
  ├── types/                     # TypeScript interfaces
  ├── storage/                   # AsyncStorage helpers
  └── utils/                     # Helper functions

Libraries Used

React Native & Expo – mobile framework

TypeScript – static typing

Redux Toolkit & React-Redux – state management

AsyncStorage – local storage for bookings

Formik + Yup – form handling and validation

Expo Router – filesystem-based routing (stack + tabs)

React Native Safe Area Context – safe area support

React Native Vector Icons – icons

React Native Modal DateTime Picker – date/time selection

App Flow & Features
Login Screen

Fields: Email, Password

Validation with Formik & Yup:

Email must contain @

Password ≥ 6 characters

Dummy credentials:

Email: user@example.com
Password: 1234567890


On successful login → navigate to Services tab:

router.replace("/(tabs)/services");

Tab Navigation

Two tabs: Services & Bookings

Only main screens are in tabs; detail pages use stack navigation

<Tabs screenOptions={{ headerShown: false }}>
  <Tabs.Screen name="services" options={{ title: "Services" }} />
  <Tabs.Screen name="bookings" options={{ title: "Bookings" }} />
</Tabs>

Services

Shows a list of services from dummyData.ts

Tap a service → navigate to Service Details

Features:

Search/filter

Pull-to-refresh

Smooth scrolling & animations

Service Details

Shows full service information

Button: Book this service → navigate to Booking Form

Route example:

router.push("/booking/form", { service });

Booking Form

Fields:

Service name (read-only)

Date & Time picker

Notes (optional)

Validate date & time

On submit → save booking in Redux + AsyncStorage

Navigate to Bookings List

Bookings List

Load bookings from Redux + AsyncStorage

Show:

Service name

Date

Time

Features:

Empty state message if no bookings

Delete booking functionality

Optional: filter by service/date

Steps to Run the Project

Clone the repository:

git clone <repository-url>
cd ServiceBookingApp


Install dependencies:

npm install


Start the Expo server:

npx expo start


Open the app:

Scan QR code with Expo Go (Android/iOS)

Or run on simulator/emulator

Login with dummy credentials:

Email: user@example.com
Password: 1234567890

Assumptions Made

No real backend; login is dummy

Services are loaded from local JSON

Bookings are stored locally using AsyncStorage

Tabs only show main screens; details are stack screens

Basic error handling for empty inputs and storage failures

Advanced Features

Search & filter services

Pull-to-refresh on service list

Smooth animations for list and transitions

Theme support with consistent spacing & colors

Booking confirmation modal

Error handling for storage/API failures