# Curbside Operations Management System

A real-time curbside operations management system built during COVID to coordinate parking, orders, and staff workflows for high-volume restaurant takeout.

---

### Key System Capabilities

- Real-time parking lot tracking
- SMS-based guest check-in
- Role-based views for staff positions
- Visual dashboard for managers
- Shared order status across all stations

```
Staff Devices (Phones / Chromebooks / iPads)
                 │
                 ▼
              React App
                 │
                 ▼
            Firebase DB
                 │
                 ▼
             Twilio SMS
```

---


## Texas Roadhouse - York, PA COVID Response

This repository documents a custom curbside management system developed during the COVID-19 lockdown when restaurant operations rapidly shifted from dine-in service to a 100% curbside takeout model.

The project began as an operational crisis and evolved into a full process redesign supported by a custom-built software solution.

## Project Overview

During the early stages of the COVID lockdown, Pennsylvania restaurants experienced a limit to only to-go orders. The existing to-go process had been designed for low-volume takeout and quickly failed under the new demand.

The resulting system breakdown caused:

- Long wait times
- Lost or incorrect orders
- Communication failures between staff
- Payment processing delays
- Parking lot congestion extending onto the main road
- Safety risks for employees working around heavy vehicle traffic

This project documents the process improvements and software system that stabilized curbside operations and allowed the restaurant to handle high-volume takeout service efficiently.

## My Role

Service Manager - Process Improvement Lead

Responsibilities included:

- Mapping the existing curbside workflow
- Identifying operational bottlenecks and root causes
- Implementing operational process improvements
- Designing and building a custom software solution
- Coordinating staff workflows and system adoption

The Managing Partner gave me responsibility for stabilizing and redesigning the curbside operation.

## Initial System Failure

The original curbside workflow relied on manual coordination and tools that were not designed for high-volume service.

### Original Workflow

1. Guest arrives and checks in with a parking lot traffic director.
2. Traffic director communicates arrival via radio to an inside parking coordinator.
3. Coordinator updates a dry erase board showing parking lot occupancy.
4. Guest parks and waits for order.
5. Runner takes payment using handheld POS terminals.
6. Runner searches staging area for the food order.
7. Order is delivered to the guest's vehicle.

## Major Problems Identified

### Lack of Parking Location Tracking

Staff had no reliable way to track where guests parked.

Impact:

- Runners searching for vehicles
- Incorrect order delivery
- Increased wait times

### Communication Breakdown

Communication depended on radios and a manually updated dry erase board.

Impact:

- Confusion about which guests had arrived
- Inaccurate parking records
- Delays locating orders

### Unreliable Mobile Payment Processing

Handheld POS terminals relied on weak WiFi signals in the parking lot.

Impact:

- Payment failures
- Slow transactions
- Guest frustration

### Poor Food Organization

Orders were organized by order number, which became difficult to manage at high volume.

Impact:

- Lost food orders
- Long search times
- Increased order errors

### Traffic and Safety Issues

The curbside line frequently extended beyond the parking lot and onto the main road.

Impact:

- Traffic congestion
- Unsafe conditions for employees running between vehicles

## Iteration 2 - Operational Improvements

Before developing a software solution, several operational improvements were implemented.

### Parking Lot Tracking

Computers originally used for dining room seating were moved to the front of the restaurant and repurposed to represent the parking lot layout.

Multiple terminals were placed near:

- Food staging
- Payment station
- Management station

This allowed staff to view parking lot activity from multiple locations.

### Centralized Payment Station

Mobile POS devices were removed from the parking lot.

All payments were processed at a centralized station inside the restaurant.

Benefits:

- Eliminated WiFi reliability issues
- Faster payment processing
- More consistent transactions

### Food Staging Redesign

Completed orders were grouped alphabetically by the first letter of the guest's first name.

Three staging zones were created to distribute orders and reduce search time.

The zones were periodically adjusted to balance order volume.

## Iteration 2 Results

Operational improvements significantly stabilized the curbside operation.

| Metric | Before | After |
| --- | --- | --- |
| Parking lot traffic | Backed onto main road | Contained within parking lot |
| Lost orders | ~15 per day | ~2 per day |
| Payment failures | Frequent | Eliminated |

Although operations improved, several bottlenecks remained.

## Remaining Challenges

### Parking Director Bottleneck

Tracking vehicles using the repurposed seating system was still slow and created a new bottleneck during peak arrival times.

### Kitchen Order Visibility

The kitchen lacked a clear way to track order status during preparation, which occasionally resulted in lost orders.

### Process Fragility

The system relied heavily on guests following specific instructions. If guests parked incorrectly or skipped steps, the workflow could break down.

## Final Solution - Custom Software System

During a COVID quarantine period, I designed and built a custom curbside management system specifically tailored to restaurant curbside operations.

The goal was to create a system that provided real-time visibility and coordination across all staff roles.

### Technology Stack

- TypeScript
- React
- Firebase
- Twilio

The system was designed to run on:

- Phones
- Chromebooks
- iPads used throughout the restaurant

## System Design Principles

### Real-Time Shared Data

All staff interacted with the same live system, ensuring accurate and synchronized information.

### Role-Based Interfaces

Each station saw only the information relevant to their responsibilities.

Examples:

- Food runners
- Payment station
- Parking lot updater
- Managers with full operational dashboard

### Minimal Typing

The interface relied primarily on buttons and quick status updates to allow employees to work quickly during busy service periods.

### Visual Parking Lot Dashboard

Managers had access to a real-time dashboard showing the entire parking lot.

Parking spots were color-coded to represent status such as:

- Guest arrived
- Waiting for food
- Payment pending
- Order ready for delivery

This allowed instant awareness of operational status.

### Guest Check-In Automation

Parking spaces were numbered.

When an order was entered into the system, guests automatically received a text message explaining the curbside process.

Guests checked in by texting their parking spot number.

This eliminated the need for a manual parking lot director.

### Updated Staff Roles

The former traffic director role became an Updater.

Instead of directing every vehicle, the updater focused on identifying guests who had not checked in and quickly adding them to the system.

This made the process significantly more resilient.
## Screenshots

### Order Overview
![Order Overview](./screenshots/Order%20Overview.png)

### Order Entry Overview
![Order Entry Overview](./screenshots/Order%20Entry%20Overview.png)

### Color Coded Names and Order Times
![Color Coded Names and Order Times](./screenshots/Color%20Coded%20Names%20and%20Order%20times.png)

### Color Coded Parking Lot Diagram
![Color Coded Parking Lot Diagram](./screenshots/Color%20Coded%20Parking%20Lot%20Diagram.png)

### Position Based View
![Position Based View](./screenshots/Positioned%20Based%20View.png)


## Final Results

The redesigned system transformed curbside operations.

Before:

- Parking lot gridlock
- Lines extending onto the main road
- Frequent lost orders
- Communication breakdown between staff

After:

- Traffic contained within the parking lot
- Clear real-time order visibility
- Near-zero lost orders
- Faster service times
- Improved staff coordination and safety

## Repository Contents

- `PROCESS_ANALYSIS.md`: Detailed documentation of the operational analysis
- `legacy/curbside-2020-app/`: Source code for the curbside management system
- `./screenshots/`: Interface screenshots and system visuals


## Purpose of This Repository

This repository serves as a historical archive of the curbside system developed during the COVID lockdown and demonstrates the intersection of operations management, business process improvement, and software development.
