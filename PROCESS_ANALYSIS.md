# Curbside Process Improvement Case Study

Texas Roadhouse - COVID Operational Transformation

## Business Problem

At the start of the COVID lockdown, the restaurant shifted from dine-in service to a fully curbside takeout model. The existing to-go process was designed for low-volume orders and could not support the sudden increase in demand.

During the first two weeks of lockdown, volume was manageable. By the third week, demand increased significantly and the system collapsed.

Operational issues included:

- No way to track guest parking locations
- Poor communication between runners and inside staff
- Unreliable payment processing using mobile terminals
- Poor organization of completed food orders
- Long wait times
- Traffic backing up onto the main road
- Safety risks for employees running through traffic

The failure was systemic. The curbside process was never designed for a high-volume operation.

## My Role

Service Manager - Process Improvement Lead

I was responsible for stabilizing the curbside operation and redesigning the workflow to improve speed, accuracy, and safety.

Responsibilities included:

- Mapping the curbside process
- Identifying bottlenecks and failure points
- Implementing operational process improvements
- Designing and building a custom software system to support curbside operations
- Monitoring operational results and refining the process

Because of my experience running high-speed dining room operations, management gave me full authority to redesign the curbside system.

## Current State Process (Original System)

1. Guest arrives and speaks to an employee directing traffic.
2. Employee attempts to communicate the guest's arrival to an inside parking director via radio.
3. The parking director updates a dry erase board showing the parking lot layout.
4. The guest parks and waits.
5. A runner checks whether the order has been paid.
6. If not prepaid, the runner collects payment using a handheld POS terminal.
7. The runner searches staged food orders to locate the guest's order.
8. If the order is ready, the runner delivers it to the vehicle. If not, the runner waits.

## Major Problems Identified

### Communication Breakdown

Communication relied on radios and a manually updated dry erase board. This created constant confusion about which guests had arrived and where they were parked.

Impact:

- Incorrect parking spot tracking
- Runners searching for guests
- Orders delivered to the wrong vehicles

### Technology Limitations

Payment runners used mobile POS terminals that depended on WiFi. The parking lot did not have strong enough WiFi coverage to support reliable transactions.

Impact:

- Payment failures
- Slow transaction times
- Frustration for staff and guests

### Poor Food Organization

Orders were organized by order number. Under high volume, this system became difficult to maintain.

Impact:

- Food orders lost in staging areas
- Long search times
- Increased order inaccuracies

### Traffic Congestion and Safety Issues

The curbside line regularly extended out of the parking lot and onto the main road.

Impact:

- Traffic congestion
- Unsafe working conditions for runners navigating vehicles

## Root Cause Analysis

The primary root cause was that the system relied heavily on manual coordination.

The process assumed:

- Low order volume
- Simple communication
- Limited staff coordination

The pandemic created a high-volume logistics environment that required real-time coordination and visibility across multiple roles.

Key root causes included:

- Manual tracking systems
- Lack of centralized order visibility
- Unreliable technology infrastructure
- Fragmented communication between staff roles

## Iteration 2 - Operational Improvements

Before introducing new technology, several operational changes were implemented to stabilize the process.

### Centralized Parking Lot Tracking

Computers normally used for dining room seating were moved to the front of the restaurant. The digital layout was modified to represent the parking lot instead of the dining room.

A parking lot director could now track arriving guests through a computer terminal instead of a dry erase board.

Additional terminals were placed near food staging and payment stations so employees could see the same parking lot data.

### Centralized Payment Station

Mobile POS devices were eliminated. All payments were processed inside the restaurant at a dedicated payment station near the front entrance.

Payment runners retrieved payment information inside instead of attempting transactions in the parking lot.

### Food Staging Redesign

Completed food orders were reorganized using a simple alphabetical grouping based on the first letter of the guest's first name.

Three staging zones were created and rebalanced every few days to prevent overcrowding in any one section.

## Iteration 2 Results

Starting conditions:

- Curbside line extended onto the main road
- Frequent payment failures
- Approximately 15 abandoned meals per day

After iteration 2:

- Traffic contained within the restaurant parking lot
- Payment failures eliminated
- Leftover meals reduced from 15 to approximately 2 per day

## Remaining Problems After Iteration 2

### Parking Director Bottleneck

Using the dining room seating system to track parking lot guests was still slow. The parking lot director remained a bottleneck during high arrival volume.

### Kitchen Coordination Issues

The kitchen still lacked a clear way to track order status, causing occasional order loss during preparation.

### Fragile Process Structure

The system relied heavily on guests following specific instructions. If guests parked in the wrong location or skipped steps, the process broke down.

## Iteration 3 - Custom Software System

While quarantined due to a COVID exposure in my household, I designed a software system specifically for Texas Roadhouse curbside operations.

### Technology Stack

- TypeScript
- React
- Firebase
- Twilio

The system was designed to work across tablets, Chromebooks, and iPads used throughout the restaurant.

### System Design Principles

#### Real-Time Shared System

All stations interacted with the same live system so every role had accurate, synchronized information.

#### Role-Based Interfaces

Each station viewed only the information relevant to its role.

Examples included:

- Food runners
- Payment station
- Parking lot updater
- Managers with a full operational dashboard

#### Minimal Typing

The interface relied heavily on buttons and status updates instead of manual typing, allowing employees to move quickly while interacting with the system.

#### Visual Parking Lot Dashboard

Managers had a visual overview of the parking lot with color-coded statuses for each guest, allowing instant recognition of:

- Arrived guests
- Orders waiting for food
- Payment status
- Orders ready for delivery

#### Guest Check-In Automation

Parking spaces were numbered. When an order was entered into the system, the guest automatically received a text message explaining the curbside process.

Guests checked in by texting their parking spot number. This eliminated the need for a parking lot director.

#### Updated Staff Role

The previous traffic director role became an "Updater." Instead of directing every car, the updater focused on identifying guests who had not checked in and quickly adding them to the system.

This made the process far more resilient.

## Final Results

Before:

- Parking lot gridlock
- Lines extending onto the main road
- Frequent lost orders
- Communication breakdown between staff

After:

- Only a few cars waiting during peak periods
- Clear real-time visibility of all orders
- Near-zero lost orders
- Faster service times
- Improved staff coordination and safety
